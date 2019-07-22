"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
Object.defineProperty(exports, "__esModule", { value: true });
var Email_1 = require("../lib/Email");
var Serv_1 = require("mbake/lib/Serv");
var ADB_1 = require("../lib/ADB");
var FileOpsExtra_1 = require("mbake/lib/FileOpsExtra");
var FileOpsBase_1 = require("mbake/lib/FileOpsBase");
var AppLogic_1 = require("../lib/AppLogic");
var fs = require('fs-extra');
var EditorRoutes = (function (_super) {
    __extends(EditorRoutes, _super);
    function EditorRoutes(adbDB) {
        var _this = _super.call(this) || this;
        _this.emailJs = new Email_1.Email();
        _this.fm = new FileOpsExtra_1.FileMethods();
        _this.appLogic = new AppLogic_1.AppLogic();
        _this.adbDB = adbDB;
        _this.auth = new ADB_1.EditorAuth(adbDB);
        return _this;
    }
    EditorRoutes.prototype.checkEditor = function (resp, params, user, pswd) {
        return __awaiter(this, void 0, void 0, function () {
            var auth;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.auth.auth(user, pswd, resp)];
                    case 1:
                        auth = _a.sent();
                        if (auth != 'OK')
                            return [2];
                        this.ret(resp, 'OK');
                        return [2];
                }
            });
        });
    };
    EditorRoutes.prototype.emailResetPasswordCode = function (resp, params, email, pswd) {
        var config = this.adbDB.getConfig();
        var emailjsService_id = config.emailjsService_id;
        var emailjsTemplate_id = config.emailjsTemplate_id;
        var emailjsUser_id = config.emailjsUser_id;
        var code = this.adbDB.getVcodeEditor(email);
        var msg = 'Enter your code at http://bla.bla' + code;
        this.emailJs.send(email, emailjsService_id, emailjsTemplate_id, emailjsUser_id, msg);
        this.ret(resp, 'OK');
    };
    EditorRoutes.prototype.resetPasswordIfMatch = function (resp, params, email, password) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.adbDB.resetPasswordEditorIfMatch(email, params.code, params.password)];
                    case 1:
                        result = _a.sent();
                        this.ret(resp, result);
                        return [2];
                }
            });
        });
    };
    EditorRoutes.prototype.getDirs = function (resp, params, user, pswd) {
        return __awaiter(this, void 0, void 0, function () {
            var auth, appPath, dirs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.auth.auth(user, pswd, resp)];
                    case 1:
                        auth = _a.sent();
                        if (auth != 'OK')
                            return [2];
                        return [4, this.adbDB.getAppPath()];
                    case 2:
                        appPath = _a.sent();
                        dirs = this.fm.getDirs(appPath);
                        this.ret(resp, dirs);
                        return [2];
                }
            });
        });
    };
    EditorRoutes.prototype.getFiles = function (resp, params, user, pswd) {
        return __awaiter(this, void 0, void 0, function () {
            var auth, itemPath, appPath, files;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.auth.auth(user, pswd, resp)];
                    case 1:
                        auth = _a.sent();
                        if (auth != 'OK')
                            return [2];
                        itemPath = '/' + params.itemPath;
                        return [4, this.adbDB.getAppPath()];
                    case 2:
                        appPath = _a.sent();
                        files = this.fm.getFiles(appPath, itemPath);
                        this.ret(resp, files);
                        return [2];
                }
            });
        });
    };
    EditorRoutes.prototype.getFileContent = function (resp, params, user, pswd) {
        return __awaiter(this, void 0, void 0, function () {
            var auth, itemPath, file, appPath, fileName, THIZ;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.auth.auth(user, pswd, resp)];
                    case 1:
                        auth = _a.sent();
                        if (auth != 'OK')
                            return [2];
                        itemPath = '/' + params.itemPath;
                        file = '/' + params.file;
                        return [4, this.adbDB.getAppPath()];
                    case 2:
                        appPath = _a.sent();
                        fileName = appPath + itemPath + file;
                        THIZ = this;
                        fs.readFile(fileName, 'utf8', function (err, data) {
                            if (err) {
                                THIZ.retErr(resp, err);
                                return;
                            }
                            THIZ.ret(resp, data);
                        });
                        return [2];
                }
            });
        });
    };
    EditorRoutes.prototype.saveFile = function (resp, params, user, pswd) {
        return __awaiter(this, void 0, void 0, function () {
            var auth, itemPath, file, appPath, fileName, content, fileOps;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.auth.auth(user, pswd, resp)];
                    case 1:
                        auth = _a.sent();
                        if (auth != 'OK')
                            return [2];
                        itemPath = '/' + params.itemPath;
                        file = '/' + params.file;
                        return [4, this.adbDB.getAppPath()];
                    case 2:
                        appPath = _a.sent();
                        fileName = itemPath + file;
                        content = params.content;
                        content = Buffer.from(content, 'base64');
                        this.appLogic.archive(appPath, itemPath, fileName);
                        fileOps = new FileOpsBase_1.FileOps(appPath);
                        fileOps.write(fileName, content);
                        this.ret(resp, 'OK');
                        return [2];
                }
            });
        });
    };
    EditorRoutes.prototype.compileCode = function (resp, params, user, pswd) {
        return __awaiter(this, void 0, void 0, function () {
            var auth, itemPath, file, appPath, fileName;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.auth.auth(user, pswd, resp)];
                    case 1:
                        auth = _a.sent();
                        if (auth != 'OK')
                            return [2];
                        itemPath = '/' + params.itemPath;
                        file = '/' + params.file;
                        return [4, this.adbDB.getAppPath()];
                    case 2:
                        appPath = _a.sent();
                        fileName = itemPath + file;
                        this.ret(resp, 'OK');
                        this.appLogic.autoBake(appPath, itemPath, fileName);
                        return [2];
                }
            });
        });
    };
    EditorRoutes.prototype.cloneItem = function (resp, params, user, pswd) {
        return __awaiter(this, void 0, void 0, function () {
            var auth, itemPath, newItemPath, appPath;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.auth.auth(user, pswd, resp)];
                    case 1:
                        auth = _a.sent();
                        if (auth != 'OK')
                            return [2];
                        itemPath = '/' + params.itemPath;
                        newItemPath = '/' + params.newItemPath;
                        return [4, this.adbDB.getAppPath()];
                    case 2:
                        appPath = _a.sent();
                        return [4, this.appLogic.clone(appPath, itemPath, newItemPath)];
                    case 3:
                        _a.sent();
                        this.ret(resp, 'OK');
                        return [2];
                }
            });
        });
    };
    EditorRoutes.prototype.setPublishDate = function (resp, params, user, pswd) {
        return __awaiter(this, void 0, void 0, function () {
            var auth, itemPath, appPath, publish_date;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.auth.auth(user, pswd, resp)];
                    case 1:
                        auth = _a.sent();
                        if (auth != 'OK')
                            return [2];
                        itemPath = '/' + params.itemPath;
                        return [4, this.adbDB.getAppPath()];
                    case 2:
                        appPath = _a.sent();
                        publish_date = params.publish_date;
                        this.appLogic.setPublishDate(appPath, itemPath, publish_date);
                        this.ret(resp, 'OK');
                        return [2];
                }
            });
        });
    };
    return EditorRoutes;
}(Serv_1.BasePgRouter));
exports.EditorRoutes = EditorRoutes;
module.exports = {
    EditorRoutes: EditorRoutes
};
