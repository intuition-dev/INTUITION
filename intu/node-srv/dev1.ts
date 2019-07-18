// Bus. Layer test

const logger = require('tracer').console()
const perfy = require('perfy')

import { ADB } from './lib/ADB'

const adb =new ADB()
adb.init().then(tst)

async function tst() {
   let result;

   perfy.start('getSalt', true);
   logger.trace('getSalt:')

   logger.trace(await adb.getSalt())

   result = perfy.end('getSalt')
   console.log('', result.time )


   perfy.start('monitor', true);
   logger.trace('monitor:')

   logger.trace(await adb.monitor())

   result = perfy.end('monitor')
   console.log('', result.time )


   perfy.start('setAppPath', true);
   logger.trace(`setAppPath('appPath'):`)

   logger.trace(await adb.setAppPath('appPath'))

   result = perfy.end('setAppPath')
   console.log('', result.time )


   perfy.start('getAppPath', true);
   logger.trace('getAppPath:')

   logger.trace(await adb.getAppPath())

   result = perfy.end('getAppPath')
   console.log('', result.time )


   perfy.start('getPort', true);
   logger.trace('getPort:')

   logger.trace(await adb.getPort())

   result = perfy.end('getPort')
   console.log('', result.time )


   perfy.start('getConfig', true);
   logger.trace('getConfig:')

   logger.trace(await adb.getConfig())

   result = perfy.end('getConfig')
   console.log('', result.time )


   perfy.start('getVcodeAdmin', true);
   logger.trace('getVcodeAdmin:')

   logger.trace(await adb.getVcodeAdmin())

   result = perfy.end('getVcodeAdmin')
   console.log('', result.time )

   perfy.start('getVcodeEditor', true);
   logger.trace(`getVcodeEditor('n1@m.com):`)

   logger.trace(await adb.getVcodeEditor('n1@m.com'))

   result = perfy.end('getVcodeEditor')
   console.log('', result.time )


   perfy.start('addEditor', true);
   var addEditorGuid = uuidv4()
   logger.trace(`addEditor(${addEditorGuid}, 'Editor${addEditorGuid}', 'e@m.com', '1111'):`)
   
   logger.trace(await adb.addEditor(addEditorGuid, 'Editor2'+addEditorGuid, 'e2@m.com', '1111'))
   
   result = perfy.end('addEditor')
   console.log('', result.time )


   perfy.start('getEditors', true);
   logger.trace('getEditors:')

   logger.trace(await adb.getEditors())

   result = perfy.end('getEditors')
   console.log('', result.time )

   perfy.start('deleteEditor', true);
   logger.trace('deleteEditor:')

   logger.trace(await adb.deleteEditor(addEditorGuid))

   result = perfy.end('deleteEditor')
   console.log('', result.time )


   perfy.start('getEditors2', true);
   logger.trace('getEditors:')

   logger.trace(await adb.getEditors())

   result = perfy.end('getEditors2')
   console.log('', result.time )

}//()

// generate uuid for testing purposes
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}