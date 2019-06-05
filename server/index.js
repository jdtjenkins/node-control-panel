const express = require('express');
const app = express();

app.use(express.static(`${ __dirname }/app/dist`))

app.get('*', (req, res) => {
	res.sendFile(`${ __dirname }/app/dist/index.html`, {
		root: `${ __dirname }/app/dist/`,
	});
})

app.listen(1337, () => {
	console.log('Listening on 1337...');
});
