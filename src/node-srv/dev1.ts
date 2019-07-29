// Bus. Layer test

const logger = require('tracer').console()
const perfy = require('perfy')

import { ADB } from './lib/ADB'
import { AppLogic } from './lib/AppLogic'

const adb =new ADB()
const appLogic = new AppLogic()

adb.init().then(testADB).then(testAppLogic)


//testAppLogic()

async function test(name, f) {
    perfy.start(name, true)
    logger.trace(name)

    logger.trace(await f())

    var result = perfy.end(name)
    console.log('', result.time)
}

async function testADB() {
   console.log('testADB:')

   await test('dbExists', () => adb.dbExists())

   await test('getSalt', () => adb.getSalt())

   await test('monitor', () => adb.monitor())

   await test(`setAppPath('appPath')`, () => adb.setAppPath('appPath'))

   await test('getAppPath', () => adb.getAppPath())

   await test('getPort', () => adb.getPort())

   await test('getConfig', () => adb.getConfig())

   await test('getVcodeAdmin', () => adb.getVcodeAdmin())

   await test(`getVcodeEditor('n1@m.com)`, () => adb.getVcodeEditor('n1@m.com'))

   var addEditorGuid = uuidv4()
   await test(`addEditor(${addEditorGuid}, 'Editor${addEditorGuid}', 'e@m.com', '1111'):`, () => adb.addEditor(addEditorGuid, 'Editor2'+addEditorGuid, 'e2@m.com', '1111'))

   await test('getEditors', () => adb.getEditors())

   await test('deleteEditor', () => adb.deleteEditor(addEditorGuid))

   await test('getEditors2', () => adb.getEditors())

   console.log('//testADB')
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