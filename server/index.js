const express = require('express');
const { join } = require('path');
const app = express();

app.use(express.static(join(__dirname, `../app/dist`)));

app.get('*', (req, res) => {
	res.sendFile(join(__dirname, `../app/dist/index.html`), {
		root: join(__dirname, `../app/dist`),
	});
})

exports.run = () => {
	app.listen(1337, () => {
		console.log('Listening on 1337...');
	});
}
