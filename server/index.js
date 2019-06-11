"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var path_1 = require("path");
var ws_1 = __importDefault(require("ws"));
var util_1 = require("util");
var glob_1 = __importDefault(require("glob"));
var fs = __importStar(require("fs"));
var child_process_1 = require("child_process");
var open_1 = __importDefault(require("open"));
var app = express_1.default();
var HTTPServerPort = 1337;
var WSServerPort = 1338;
var asyncGlob = util_1.promisify(glob_1.default);
var asyncReaddir = util_1.promisify(fs.readdir);
var asyncReadFile = util_1.promisify(fs.readFile);
var asyncExec = util_1.promisify(child_process_1.exec);
var projectCache = {};
var childProcessCache = {};
var wss = new ws_1.default.Server({
    port: WSServerPort,
});
app.use(express_1.default.static(path_1.join(__dirname, "../app/dist")));
app.get('*', function (_a) {
    var res = _a.res;
    res.sendFile(path_1.join(__dirname, "../app/dist/index.html"), {
        root: path_1.join(__dirname, "../app/dist"),
    });
});
var run = function () { return __awaiter(_this, void 0, void 0, function () {
    var _this = this;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                app.listen(HTTPServerPort, function () {
                    console.log("Listening on " + HTTPServerPort + "...");
                });
                if (!(process.env.NODE_ENV !== 'development')) return [3 /*break*/, 2];
                return [4 /*yield*/, open_1.default("http://localhost:" + HTTPServerPort)];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2:
                wss.on('connection', function (ws) {
                    ws.on('message', function (message) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            message = JSON.parse(message);
                            switch (message.action) {
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
                            return [2 /*return*/];
                        });
                    }); });
                });
                return [2 /*return*/];
        }
    });
}); };
exports.run = run;
var methods = {
    search: function (ws, folderPath) {
        return __awaiter(this, void 0, void 0, function () {
            var folders, _i, folders_1, packageJsonPath, folderPath_1, packageJson, script, obj, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        return [4 /*yield*/, asyncGlob(path_1.resolve(folderPath, '*/package.json'))];
                    case 1:
                        folders = _a.sent();
                        _i = 0, folders_1 = folders;
                        _a.label = 2;
                    case 2:
                        if (!(_i < folders_1.length)) return [3 /*break*/, 6];
                        packageJsonPath = folders_1[_i];
                        folderPath_1 = packageJsonPath.replace('/package.json', '');
                        if (!!projectCache[packageJsonPath]) return [3 /*break*/, 4];
                        return [4 /*yield*/, asyncReadFile(packageJsonPath, 'utf-8')];
                    case 3:
                        packageJson = _a.sent();
                        packageJson = JSON.parse(packageJson);
                        projectCache[packageJsonPath] = {
                            folderPath: folderPath_1,
                            projectName: folderPath_1.split('/').pop(),
                            packageJson: packageJson,
                        };
                        _a.label = 4;
                    case 4:
                        for (script in projectCache[packageJsonPath].packageJson.scripts) {
                            if (childProcessCache[folderPath_1] && childProcessCache[folderPath_1][script]) {
                                projectCache[packageJsonPath].packageJson.scripts[script] = true;
                            }
                        }
                        packageJsonPath = folderPath_1;
                        _a.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 2];
                    case 6:
                        obj = {
                            action: 'searchResult',
                            payload: {
                                searchPath: folderPath,
                                folders: folders.map(function (folder) { return projectCache[folder]; }),
                            }
                        };
                        ws.send(JSON.stringify(obj));
                        return [3 /*break*/, 8];
                    case 7:
                        e_1 = _a.sent();
                        console.log(e_1);
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    },
    startScript: function (ws, payload) {
        return __awaiter(this, void 0, void 0, function () {
            var child;
            var _a;
            return __generator(this, function (_b) {
                try {
                    if (childProcessCache[payload.project] && childProcessCache[payload.project][payload.scriptName]) {
                        return [2 /*return*/];
                    }
                    child = child_process_1.spawn(/^win/.test(process.platform) ? 'npm.cmd' : 'npm', ['run', payload.scriptName], {
                        cwd: payload.project,
                    });
                    child.stdout.on('data', function (data) {
                        ws.send(JSON.stringify({
                            action: 'childStdout',
                            payload: {
                                project: payload.project,
                                scriptName: payload.scriptName,
                                stdout: data.toString('utf8'),
                            }
                        }));
                    });
                    child.stderr.on('data', function (data) {
                        ws.send(JSON.stringify({
                            action: 'childStderr',
                            payload: {
                                project: payload.project,
                                scriptName: payload.scriptName,
                                stderr: data.toString('utf8'),
                            }
                        }));
                    });
                    child.on('close', function (code) {
                        ws.send(JSON.stringify({
                            action: 'childStop',
                            payload: {
                                project: payload.project,
                                scriptName: payload.scriptName,
                                code: code,
                            }
                        }));
                    });
                    childProcessCache[payload.project] = (_a = {},
                        _a[payload.scriptName] = child,
                        _a);
                }
                catch (e) {
                    console.log(e);
                }
                return [2 /*return*/];
            });
        });
    },
    stopScript: function (ws, payload) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!/^win/.test(process.platform)) return [3 /*break*/, 2];
                        process.kill(childProcessCache[payload.project][payload.scriptName].pid, 'SIGINT');
                        return [4 /*yield*/, asyncExec("taskkill /PID " + childProcessCache[payload.project][payload.scriptName].pid + " /F")];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        process.kill(childProcessCache[payload.project][payload.scriptName].pid, 'SIGINT');
                        childProcessCache[payload.project][payload.scriptName].kill('SIGINT');
                        childProcessCache[payload.project][payload.scriptName] = null;
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
};
process.on('exit', function () { return __awaiter(_this, void 0, void 0, function () {
    var pids, project, script, _i, pids_1, pid;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                pids = [];
                for (project in childProcessCache) {
                    for (script in childProcessCache[project]) {
                        pids.push(childProcessCache[project][script].pid);
                    }
                }
                _i = 0, pids_1 = pids;
                _a.label = 1;
            case 1:
                if (!(_i < pids_1.length)) return [3 /*break*/, 5];
                pid = pids_1[_i];
                if (!/^win/.test(process.platform)) return [3 /*break*/, 3];
                process.kill(pid, 'SIGINT');
                return [4 /*yield*/, asyncExec("taskkill /PID " + pid + " /F")];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                process.kill(pid, 'SIGINT');
                _a.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 1];
            case 5: return [2 /*return*/];
        }
    });
}); });
if (process.env.NODE_ENV === 'development') {
    run();
}
//# sourceMappingURL=index.js.map