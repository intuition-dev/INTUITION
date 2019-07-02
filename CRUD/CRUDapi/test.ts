
// Bus. Layer test
import { CDB } from './lib/CDB'
const assert = require('assert')

const cdb =new CDB()
cdb.init().then(tst)

function tst() {

   console.log(cdb.selectAll())

}