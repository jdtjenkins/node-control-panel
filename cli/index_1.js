#!/usr/bin/env node
'use strict';

const { join } = require('path');
const { run } = require(join(__dirname, `../server`));

const arg = process.argv[2] || null;

if (arg && arg === 'start'){
	run();
}
