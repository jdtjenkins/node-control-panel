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
			try {
				const folders = await asyncGlob(resolve(message, '*/package.json'));
				console.log(resolve(message, '*/package.json'), folders)
				ws.send(folders);
			} catch (e) {
				console.log(e);
			}
		});
	});
}

if (process.env.NODE_ENV === 'development'){
	run();
}

exports.run = run;
