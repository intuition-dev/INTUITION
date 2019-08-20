
// Bus. Layer test
import { IDB } from 'intu/node-srv/lib/IDB';
const is = require('is')
const logger = require('tracer').console()
const perfy = require('perfy')


const idb = new IDB('.', '/IDB.sqlite')

idb.isSetupDone()