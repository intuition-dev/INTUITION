// Bus. Layer test

const logger = require('tracer').console()
const perfy = require('perfy')

import { IDB } from './lib/IDB'
import { AppLogic } from './lib/AppLogic'

const iDB =new IDB('.','/test.sqlite')
const appLogic = new AppLogic()

iDB.init().then(testIDB).then(testAppLogic)


//testAppLogic()

async function test(name, f) {
    perfy.start(name, true)
    logger.trace(name)

    logger.trace(await f())

    var result = perfy.end(name)
    console.log('', result.time)
}

async function testIDB() {
   console.log('testIDB:')

   await test('dbExists', () => iDB.dbExists())

   await test('getSalt', () => iDB.getSalt())

   await test('monitor', () => iDB.monitor())

   await test(`setAppPath('appPath')`, () => iDB.setAppPath('appPath'))

   await test('getAppPath', () => iDB.getAppPath())

   await test('getPort', () => iDB.getPort())

   await test('getConfig', () => iDB.getConfig())

   await test('getVcodeAdmin', () => iDB.getVcodeAdmin())

   await test(`getVcodeEditor('n1@m.com)`, () => iDB.getVcodeEditor('n1@m.com'))

   var addEditorGuid = uuidv4()
   await test(`addEditor(${addEditorGuid}, 'Editor${addEditorGuid}', 'e@m.com', '1111'):`, () => iDB.addEditor(addEditorGuid, 'Editor2'+addEditorGuid, 'e2@m.com', '1111'))

   await test('getEditors', () => iDB.getEditors())

   await test('deleteEditor', () => iDB.deleteEditor(addEditorGuid))

   await test('getEditors2', () => iDB.getEditors())

   console.log('//testIDB')
}//()

async function testAppLogic() {
  console.log('testAppLogic:')

  await test('autoBake', () => appLogic.autoBake('/users/vitalii/intu-smpl', 'files/', 'newItm.md'))

  await test('setPublishDate', () => appLogic.setPublishDate('/users/vitalii/intu-smpl', '/files', 112233132323))

  await test('clone', () => appLogic.clone('/users/vitalii/intu-smpl', '/files', '/files2'))

  await test('archive', () => appLogic.archive('/users/vitalii/intu-smpl', '/files/', 'newItm.md'))

  console.log('//testAppLogic')
}

// generate uuid for testing purposes
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}