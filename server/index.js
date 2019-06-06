const express = require('express');
const { join, resolve } = require('path');
const WebSocket = require('ws');
const { promisify } = require('util');
const glob = require('glob');
const fs = require('fs');

const app = express();
const HTTPServerPort = 1337;
const WSServerPort = 1338;

const asyncGlob = promisify(glob);
const asyncReaddir = promisify(fs.readdir);
const asyncReadFile = promisify(fs.readFile);

const projectCache = {}

const wss = new WebSocket.Server({
	port: WSServerPort,
})

app.use(express.static(join(__dirname, `../app/dist`)));

app.get('*', (req, res) => {
	res.sendFile(join(__dirname, `../app/dist/index.html`), {
		root: join(__dirname, `../app/dist`),
	});
})

const run = () => {
	app.listen(HTTPServerPort, () => {
		console.log(`Listening on ${ HTTPServerPort }...`);
	});

	wss.on('connection', function connection(ws) {
		ws.on('message', async message => {
			message = JSON.parse(message);

			switch(message.action){
				case 'search':
					methods.search(ws, message.payload)
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
						folderPath: folderPath,
						projectName: folderPath.split('/').pop(),
						packageJson,
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
}

if (process.env.NODE_ENV === 'development'){
	run();
}

exports.run = run;
