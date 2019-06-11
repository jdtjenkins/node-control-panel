#!/usr/bin/env node
'use strict';

// import { join } from 'path';
import { run } from '../server';

const arg = process.argv[2] || null;

if (arg && arg === 'start'){
	run();
}
