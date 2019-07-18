// Bus. Layer test

const logger = require('tracer').console()
const perfy = require('perfy')

import { ADB } from './lib/ADB'

const adb =new ADB()
adb.init().then(tst)

async function tst() {

   perfy.start('loop-stuff');
   logger.trace('getSal:')

   logger.trace(await adb.getSalt())

   var result = perfy.end('loop-stuff')
   console.log('', result.time )


   perfy.start('loop-stuff');
   logger.trace('monitor:')

   logger.trace(await adb.monitor())

   var result = perfy.end('loop-stuff')
   console.log('', result.time )


   perfy.start('loop-stuff');
   logger.trace(`setAppPath('appPath'):`)

   logger.trace(await adb.setAppPath('appPath'))

   var result = perfy.end('loop-stuff')
   console.log('', result.time )


   perfy.start('loop-stuff');
   logger.trace('getAppPath:')

   logger.trace(await adb.getAppPath())

   var result = perfy.end('loop-stuff')
   console.log('', result.time )


   perfy.start('loop-stuff');
   logger.trace('getPort:')

   logger.trace(await adb.getPort())

   var result = perfy.end('loop-stuff')
   console.log('', result.time )


   perfy.start('loop-stuff');
   logger.trace('getConfig:')

   logger.trace(await adb.getConfig())

   var result = perfy.end('loop-stuff')
   console.log('', result.time )


   perfy.start('loop-stuff');
   logger.trace('getVcodeAdmin:')

   logger.trace(await adb.getVcodeAdmin())

   var result = perfy.end('loop-stuff')
   console.log('', result.time )

   perfy.start('loop-stuff');
   logger.trace(`getVcodeEditor('n1@m.com):`)

   logger.trace(await adb.getVcodeEditor('n1@m.com'))

   var result = perfy.end('loop-stuff')
   console.log('', result.time )


   perfy.start('loop-stuff');
   var addEditorGuid = uuidv4()
   logger.trace(`addEditor(${addEditorGuid}, 'Editor${addEditorGuid}', 'e@m.com', '1111'):`)
   
   logger.trace(await adb.addEditor(addEditorGuid, 'Editor2'+addEditorGuid, 'e2@m.com', '1111'))
   
   var result = perfy.end('loop-stuff')
   console.log('', result.time )


   perfy.start('loop-stuff');
   logger.trace('getEditors:')

   logger.trace(await adb.getEditors())

   var result = perfy.end('loop-stuff')
   console.log('', result.time )

   perfy.start('loop-stuff');
   logger.trace('deleteEditor:')

   logger.trace(await adb.deleteEditor(addEditorGuid))

   var result = perfy.end('loop-stuff')
   console.log('', result.time )


   perfy.start('loop-stuff');
   logger.trace('getEditors:')

   logger.trace(await adb.getEditors())

   var result = perfy.end('loop-stuff')
   console.log('', result.time )

}//()

// generate uuid for testing purposes
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }