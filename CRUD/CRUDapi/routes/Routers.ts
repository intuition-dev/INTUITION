
import { CDB } from '../lib/CDB'
const logger = require('tracer').console()
import { BasePgRouter, iAuth } from 'mbake/lib/Serv'

export class Pg1Router extends BasePgRouter {

   cdb:CDB
   constructor() {
      super();
      this.cdb =new CDB()
      this.cdb.init()
      /* for dev only
      .then(function(){
         cdb.selectAll()
      })
      */
   }//()

   async selectAll(resp, params, user, pswd) {
      let data = await this.cdb.selectAll()
      this.ret(resp, 'Data here')
   }//()

   async selectOne(resp, params, user, pswd) {
      let id = params.id
      let data = await this.cdb.selectAll()
      this.ret(resp, 'Data here')
   }//()

   async insert(resp, params, user, pswd) {
   
      let data = await this.cdb.selectAll()
      this.ret(resp, 'Data here')
   }//()

}//class

module.exports = {
   Pg1Router
}