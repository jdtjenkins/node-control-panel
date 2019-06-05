#! /usr/local/bin/node
const pm2 = require('pm2');
const { join } = require('path');

const arg = process.argv[2] || null;

if (arg && arg === 'start'){
	pm2.connect(err => {
		if (err){
			console.log(err);
			process.exit(2);
		}

		pm2.start({
			script: join(__dirname, '../server/index.js')
		}, (err, apps) => {
			pm2.disconnect();
		})
	})
}
