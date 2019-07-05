import express from 'express';
import { join, resolve } from 'path';
import WebSocket from 'ws';
import { promisify } from 'util';
import glob from 'glob';
import * as fs from 'fs';
import { spawn, exec, ChildProcess } from 'child_process';
import open from 'open';

const app = express();
const HTTPServerPort = 1337;
const WSServerPort = 1338;

const asyncGlob = promisify(glob);
const asyncReaddir = promisify(fs.readdir);
const asyncReadFile = promisify(fs.readFile);
const asyncExec = promisify(exec);

const projectCache: {
	[projectPath: string]: Project;
} = {}

const childProcessCache: {
	[projectPath: string]: any;
} = {}

const wss = new WebSocket.Server({
	port: WSServerPort,
})

app.use(express.static(join(__dirname, `../app/dist`)))

app.get('*', ({ res }: any) => {
	res.sendFile(join(__dirname, `../app/dist/index.html`), {
		root: join(__dirname, `../app/dist`),
	});
})

interface PackageDotJson {
	name?: string;
	scripts?: {
		[id: string]: string | {
			command: string;
			running: boolean;
		};
	}
}

interface Payload {
	action: string;
	project: string;
	scriptName: string;
}

interface Project {
	projectName: string;
	projectPath: string;
	packageJson: Partial<PackageDotJson>;
}

interface ChildProcessCacheItem {
	child: ChildProcess;
	stdout: string[];
	stderr: string[];
}

const scriptRunning = (projectPath: string, scriptName: string) => {
	return {
		// @ts-ignore
		command: projectCache[projectPath].packageJson.scripts[scriptName],
		running: childProcessCache[projectPath][scriptName] ? true : false,
	}
}

const ProjectScriptProxy = (obj: any) => new Proxy(obj, {
	get(target: any, name: any): any {
		return {
			...target,
		}
	}
})

const run = async () => {
	app.listen(HTTPServerPort, () => {
		console.log(`Listening on ${ HTTPServerPort }...`);
	});

	if (process.env.NODE_ENV !== 'development'){
		await open(`http://localhost:${ HTTPServerPort }`);
	}

	wss.on('connection', (ws: any) => {
		ws.send(JSON.stringify({
			action: 'init',
			payload: childProcessCache,
		}));

		ws.on('message', async (message: any) => {
			message = JSON.parse(message);

			switch(message.action){
				case 'search':
					methods.search(ws, message.payload);
					break;
				case 'startScript':
					methods.startScript(ws, message.payload);
					break;
				case 'stopScript':
					methods.stopScript(ws, message.payload);
					break;
			}
		});
	});
}

const methods = {
	async search(ws: WebSocket, searchPath: string) {
		try {
			const projects: string[] = await asyncGlob(resolve(searchPath, '*/package.json'));

			for (let packageJsonPath of projects){
				const projectPath: string = packageJsonPath.replace('/package.json', '');

				if (!projectCache[packageJsonPath]) {
					const packageJsonRaw: string = await asyncReadFile(packageJsonPath, 'utf-8');
					const packageJsonParsed: PackageDotJson = JSON.parse(packageJsonRaw);

					projectCache[packageJsonPath] = <Project>{
						projectName: projectPath.split('/').pop(),
						projectPath,
						packageJson: packageJsonParsed,
					}
				}

				// for (let script in projectCache[packageJsonPath].packageJson.scripts) {
				// 	if (childProcessCache[projectPath] && childProcessCache[projectPath][script]) {
				// 		projectCache[packageJsonPath].packageJson.scripts[script] = true;
				// 	}
				// }
			}

			const obj = {
				action: 'projects',
				payload: {
					projects: projects.map(project => projectCache[project]),
				}
			}

			ws.send(JSON.stringify(obj));
		} catch (e) {
			console.log(e);
		}
	},
	async startScript(ws: WebSocket, payload: Payload) {
		try {
			if (childProcessCache[payload.project] && childProcessCache[payload.project][payload.scriptName]){
				return;
			}

			const child = spawn(/^win/.test(process.platform) ? 'npm.cmd' : 'npm', ['run',  payload.scriptName], {
				cwd: payload.project,
			});

			child.stdout.on('data', data => {
				childProcessCache[payload.project][payload.scriptName].stdout.push(data.toString('utf8'));

				ws.send(JSON.stringify({
					action: 'childStdout',
					payload: {
						project: payload.project,
						scriptName: payload.scriptName,
						stdout: data.toString('utf8'),
					}
				}));
			})

			child.stderr.on('data', data => {
				childProcessCache[payload.project][payload.scriptName].stderr.push(data.toString('utf8'));

				ws.send(JSON.stringify({
					action: 'childStderr',
					payload: {
						project: payload.project,
						scriptName: payload.scriptName,
						stderr: data.toString('utf8'),
					}
				}));
			})

			child.on('close', code => {
				ws.send(JSON.stringify({
					action: 'childStop',
					payload: {
						project: payload.project,
						scriptName: payload.scriptName,
						code,
					}
				}));
			})

			childProcessCache[payload.project] = {
				[payload.scriptName]: {
					child,
					stdout: [],
					stderr: [],

				},
			}
		} catch (e) {
			console.log(e);
		}
	},
	async stopScript(ws: WebSocket, payload: Payload) {
		if (/^win/.test(process.platform)){
			process.kill(childProcessCache[payload.project][payload.scriptName].pid, 'SIGINT');
			await asyncExec(`taskkill /PID ${ childProcessCache[payload.project][payload.scriptName].pid } /F`);
		} else {
			process.kill(childProcessCache[payload.project][payload.scriptName].pid, 'SIGINT');
			childProcessCache[payload.project][payload.scriptName].kill('SIGINT');
			childProcessCache[payload.project][payload.scriptName] = null;
		}
	}
}

process.on('exit', async () => {
	const pids = [];
	for (let project in childProcessCache) {
		for (let script in childProcessCache[project]) {
			pids.push(childProcessCache[project][script].pid)
		}
	}

	for (let pid of pids){
		if (/^win/.test(process.platform)){
			process.kill(pid, 'SIGINT');
			await asyncExec(`taskkill /PID ${ pid } /F`);
		} else {
			process.kill(pid, 'SIGINT');
		}
	}
});

if (process.env.NODE_ENV === 'development'){
	run();
}

export { run }
