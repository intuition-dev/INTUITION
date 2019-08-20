
// Bus. Layer test
import { CDB } from './lib/CDB'
const is = require('is')
const logger = require('tracer').console()
const perfy = require('perfy')


const cdb = new CDB('.', '/CDB.sqlite')

cdb.init()

async function tst() {
   perfy.start('loop-stuff');

   for (let i = 0; i < 10; i++) {

      logger.trace(is.array(await cdb.selectAll()))

   }

   var result = perfy.end('loop-stuff')
   console.log('', result.time )
}//()