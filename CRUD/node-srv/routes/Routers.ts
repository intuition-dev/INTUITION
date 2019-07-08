
import { CDB } from '../lib/CDB'
const logger = require('tracer').console()
import { BasePgRouter, iAuth } from 'mbake/lib/Serv'

export class CrudPgRouter extends BasePgRouter {

   cdb:CDB
   constructor() {
      super();
      this.cdb =new CDB()
      this.cdb.init()
   }//()

   async selectAll(resp, params, user, pswd) {
      let data = await this.cdb.selectAll()
      this.ret(resp, data)
   }//()

   async selectOne(resp, params, user, pswd) {
      let id = params.id
      let data = await this.cdb.selectGUID(id)
      this.ret(resp, data)
   }//()

   async insert(resp, params, user, pswd) {
      let guid = params.guid
      let name= params.name
      let topics= params.topics

      let data = await this.cdb. insert(guid, name, topics)
      this.ret(resp, data)
   }//()

}//class

module.exports = {
   CrudPgRouter
}