#!/usr/bin/env node
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
// import { join } from 'path';
var server_1 = require("../server");
var arg = process.argv[2] || null;
if (arg && arg === 'start') {
    server_1.run();
}
//# sourceMappingURL=index.js.map