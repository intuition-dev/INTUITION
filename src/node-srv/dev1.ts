// Bus. Layer test

var logger = require('tracer').console()
const perfy = require('perfy')

import { IDB } from './lib/IDB'
import { AppLogic } from './lib/AppLogic'


const idb = new IDB(process.cwd(), '/test.sqlite')

idb.setupIfNeeded()//.then(testIDB) //then(testAppLogic)

const appLogic = new AppLogic()

async function test(name, f) {
  perfy.start(name, true)
  logger.trace(name)

  logger.trace(await f())

  var result = perfy.end(name)
  logger.trace('', result.time)
}

async function testIDB() {
  logger.trace('testIDB:')

  await test('getSalt', () => idb.getSalt())

  await test('getConfig', () => idb.getConfig())

  await test(`getVcodeEditor('n1@m.com)`, () => idb.makeVcodeEditor('n1@m.com'))

  var addEditorGuid = uuidv4()
  await test(`addEditor(${addEditorGuid}, 'Editor${addEditorGuid}', 'e@m.com', '1111'):`, () => idb.addEditor(addEditorGuid, 'Editor2' + addEditorGuid, 'e2@m.com', '1111'))

  await test('getEditors', () => idb.getEditorsAll())

  await test('deleteEditor', () => idb.deleteEditor(addEditorGuid))

  await test('getEditors2', () => idb.getEditorsAll())

  logger.trace('//testIDB')
}//()

async function testAppLogic() {
  logger.trace('testAppLogic:')

  await test('autoBake', () => appLogic.autoBake('/users/vitalii/intu-smpl', 'files/', 'newItm.md'))

  await test('setPublishDate', () => appLogic.setPublishDate('/users/vitalii/intu-smpl', '/files', 112233132323))

  await test('clone', () => appLogic.clone('/users/vitalii/intu-smpl', '/files', '/files2'))

  await test('archive', () => appLogic.archive('/users/vitalii/intu-smpl', '/files/', 'newItm.md'))

  logger.trace('//testAppLogic')
}

// generate uuid for testing purposes
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}