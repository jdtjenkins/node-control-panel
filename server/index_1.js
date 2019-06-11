const express = require('express');
const { join, resolve } = require('path');
const WebSocket = require('ws');
const { promisify } = require('util');
const glob = require('glob');
const fs = require('fs');
const { spawn, exec } = require('child_process');
const open = require('open');

const app = express();
const HTTPServerPort = 1337;
const WSServerPort = 1338;

const asyncGlob = promisify(glob);
const asyncReaddir = promisify(fs.readdir);
const asyncReadFile = promisify(fs.readFile);
const asyncExec = promisify(exec);

const projectCache = {}
const childProcessCache = {}

const wss = new WebSocket.Server({
	port: WSServerPort,
})

app.use(express.static(join(__dirname, `../app/dist`)));

app.get('*', (req, res) => {
	res.sendFile(join(__dirname, `../app/dist/index.html`), {
		root: join(__dirname, `../app/dist`),
	});
})

const run = async () => {
	app.listen(HTTPServerPort, () => {
		console.log(`Listening on ${ HTTPServerPort }...`);
	});

	await open(`http://localhost:${ HTTPServerPort }`);

	wss.on('connection', function connection(ws) {
		ws.on('message', async message => {
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
	async search(ws, folderPath) {
		try {
			const folders = await asyncGlob(resolve(folderPath, '*/package.json'));

			for (let packageJsonPath of folders){
				const folderPath = packageJsonPath.replace('/package.json', '')

				if (!projectCache[packageJsonPath]) {
					let packageJson = await asyncReadFile(packageJsonPath);

					packageJson = JSON.parse(packageJson);

					projectCache[packageJsonPath] = {
						folderPath,
						projectName: folderPath.split('/').pop(),
						packageJson,
					}
				}

				for (let script in projectCache[packageJsonPath].packageJson.scripts) {
					if (childProcessCache[folderPath] && childProcessCache[folderPath][script]) {
						projectCache[packageJsonPath].packageJson.scripts[script] = true;
					}
				}

				packageJsonPath = folderPath;
			}

			const obj = {
				action: 'searchResult',
				payload: {
					searchPath: folderPath,
					folders: folders.map(folder => projectCache[folder]),
				}
			}

			ws.send(JSON.stringify(obj));
		} catch (e) {
			console.log(e);
		}
	},
	async startScript(ws, payload) {
		try {
			if (childProcessCache[payload.project] && childProcessCache[payload.project][payload.scriptName]){
				return;
			}

			const child = spawn(/^win/.test(process.platform) ? 'npm.cmd' : 'npm', ['run',  payload.scriptName], {
				cwd: payload.project,
			});

			child.stdout.on('data', data => {
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
				[payload.scriptName]: child,
			}
		} catch (e) {
			console.log(e);
		}
	},
	async stopScript(ws, payload) {
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
		for (let script in project) {
			pids.push(script.pid)
		}
	}

	for (pid of pids){
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

exports.run = run;
