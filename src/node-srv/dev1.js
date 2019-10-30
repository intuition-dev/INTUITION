"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bunyan = require('bunyan');
const bformat = require('bunyan-format');
const formatOut = bformat({ outputMode: 'short' });
const log = bunyan.createLogger({ src: true, stream: formatOut, name: "class name" });
const perfy = require('perfy');
const IDB_1 = require("./lib/IDB");
const AppLogic_1 = require("./lib/AppLogic");
const idb = new IDB_1.IDB(process.cwd(), '/test.sqlite');
idb.setupIfNeeded();
const appLogic = new AppLogic_1.AppLogic();
async function test(name, f) {
    perfy.start(name, true);
    log.info(name);
    log.info(await f());
    var result = perfy.end(name);
    log.info('', result.time);
}
async function testIDB() {
    log.info('testIDB:');
    await test('getSalt', () => idb.getSalt());
    await test('getConfig', () => idb.getConfig());
    await test(`getVcodeEditor('n1@m.com)`, () => idb.makeVcodeEditor('n1@m.com'));
    var addEditorGuid = uuidv4();
    await test(`addEditor(${addEditorGuid}, 'Editor${addEditorGuid}', 'e@m.com', '1111'):`, () => idb.addEditor(addEditorGuid, 'Editor2' + addEditorGuid, 'e2@m.com', '1111'));
    await test('getEditors', () => idb.getEditorsAll());
    await test('deleteEditor', () => idb.deleteEditor(addEditorGuid));
    await test('getEditors2', () => idb.getEditorsAll());
    log.info('//testIDB');
}
async function testAppLogic() {
    log.info('testAppLogic:');
    await test('autoBake', () => appLogic.autoBake('/users/vitalii/intu-smpl', 'files/', 'newItm.md'));
    await test('setPublishDate', () => appLogic.setPublishDate('/users/vitalii/intu-smpl', '/files', 112233132323));
    await test('clone', () => appLogic.clone('/users/vitalii/intu-smpl', '/files', '/files2'));
    await test('archive', () => appLogic.archive('/users/vitalii/intu-smpl', '/files/', 'newItm.md'));
    log.info('//testAppLogic');
}
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
