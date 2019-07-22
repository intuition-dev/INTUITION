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
Object.defineProperty(exports, "__esModule", { value: true });
var logger = require('tracer').console();
var perfy = require('perfy');
var ADB_1 = require("./lib/ADB");
var AppLogic_1 = require("./lib/AppLogic");
var adb = new ADB_1.ADB();
var appLogic = new AppLogic_1.AppLogic();
adb.init().then(testADB).then(testAppLogic);
function test(name, f) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b, result;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    perfy.start(name, true);
                    logger.trace(name);
                    _b = (_a = logger).trace;
                    return [4, f()];
                case 1:
                    _b.apply(_a, [_c.sent()]);
                    result = perfy.end(name);
                    console.log('', result.time);
                    return [2];
            }
        });
    });
}
function testADB() {
    return __awaiter(this, void 0, void 0, function () {
        var addEditorGuid;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('testADB:');
                    return [4, test('dbExists', function () { return adb.dbExists(); })];
                case 1:
                    _a.sent();
                    return [4, test('getSalt', function () { return adb.getSalt(); })];
                case 2:
                    _a.sent();
                    return [4, test('monitor', function () { return adb.monitor(); })];
                case 3:
                    _a.sent();
                    return [4, test("setAppPath('appPath')", function () { return adb.setAppPath('appPath'); })];
                case 4:
                    _a.sent();
                    return [4, test('getAppPath', function () { return adb.getAppPath(); })];
                case 5:
                    _a.sent();
                    return [4, test('getPort', function () { return adb.getPort(); })];
                case 6:
                    _a.sent();
                    return [4, test('getConfig', function () { return adb.getConfig(); })];
                case 7:
                    _a.sent();
                    return [4, test('getVcodeAdmin', function () { return adb.getVcodeAdmin(); })];
                case 8:
                    _a.sent();
                    return [4, test("getVcodeEditor('n1@m.com)", function () { return adb.getVcodeEditor('n1@m.com'); })];
                case 9:
                    _a.sent();
                    addEditorGuid = uuidv4();
                    return [4, test("addEditor(" + addEditorGuid + ", 'Editor" + addEditorGuid + "', 'e@m.com', '1111'):", function () { return adb.addEditor(addEditorGuid, 'Editor2' + addEditorGuid, 'e2@m.com', '1111'); })];
                case 10:
                    _a.sent();
                    return [4, test('getEditors', function () { return adb.getEditors(); })];
                case 11:
                    _a.sent();
                    return [4, test('deleteEditor', function () { return adb.deleteEditor(addEditorGuid); })];
                case 12:
                    _a.sent();
                    return [4, test('getEditors2', function () { return adb.getEditors(); })];
                case 13:
                    _a.sent();
                    console.log('//testADB');
                    return [2];
            }
        });
    });
}
function testAppLogic() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('testAppLogic:');
                    return [4, test('autoBake', function () { return appLogic.autoBake('/users/vitalii/intu-smpl', 'files/', 'newItm.md'); })];
                case 1:
                    _a.sent();
                    return [4, test('setPublishDate', function () { return appLogic.setPublishDate('/users/vitalii/intu-smpl', '/files', 112233132323); })];
                case 2:
                    _a.sent();
                    return [4, test('clone', function () { return appLogic.clone('/users/vitalii/intu-smpl', '/files', '/files2'); })];
                case 3:
                    _a.sent();
                    return [4, test('archive', function () { return appLogic.archive('/users/vitalii/intu-smpl', '/files/', 'newItm.md'); })];
                case 4:
                    _a.sent();
                    console.log('//testAppLogic');
                    return [2];
            }
        });
    });
}
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
