"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger = require('tracer').console();
const perfy = require('perfy');
const IDB_1 = require("./lib/IDB");
const AppLogic_1 = require("./lib/AppLogic");
const idb = new IDB_1.IDB('.', '/test.sqlite');
const appLogic = new AppLogic_1.AppLogic();
idb.isSetupDone();
async function test(name, f) {
    perfy.start(name, true);
    logger.trace(name);
    logger.trace(await f());
    var result = perfy.end(name);
    console.log('', result.time);
}
async function testIDB() {
    console.log('testIDB:');
    await test('dbExists', () => idb.dbExists());
    await test('getSalt', () => idb.getSalt());
    await test('monitor', () => idb.monitor());
    await test(`setAppPath('appPath')`, () => idb.setAppPath('appPath'));
    await test('getAppPath', () => idb.getAppPath());
    await test('getPort', () => idb.getPort());
    await test('getConfig', () => idb.getConfig());
    await test('getVcodeAdmin', () => idb.getVcodeAdmin());
    await test(`getVcodeEditor('n1@m.com)`, () => idb.getVcodeEditor('n1@m.com'));
    var addEditorGuid = uuidv4();
    await test(`addEditor(${addEditorGuid}, 'Editor${addEditorGuid}', 'e@m.com', '1111'):`, () => idb.addEditor(addEditorGuid, 'Editor2' + addEditorGuid, 'e2@m.com', '1111'));
    await test('getEditors', () => idb.getEditors());
    await test('deleteEditor', () => idb.deleteEditor(addEditorGuid));
    await test('getEditors2', () => idb.getEditors());
    console.log('//testIDB');
}
async function testAppLogic() {
    console.log('testAppLogic:');
    await test('autoBake', () => appLogic.autoBake('/users/vitalii/intu-smpl', 'files/', 'newItm.md'));
    await test('setPublishDate', () => appLogic.setPublishDate('/users/vitalii/intu-smpl', '/files', 112233132323));
    await test('clone', () => appLogic.clone('/users/vitalii/intu-smpl', '/files', '/files2'));
    await test('archive', () => appLogic.archive('/users/vitalii/intu-smpl', '/files/', 'newItm.md'));
    console.log('//testAppLogic');
}
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
