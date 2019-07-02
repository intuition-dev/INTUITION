
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
   }

   selectAll(resp, params, user, pswd) {
      this.ret(resp, 'OK')
   }//()

   //old function, ignore
   async CRUD0(req, resp) {

      const user = req.fields.user // user, for example to check if allowed to work with company in params
      const pswd = req.fields.pswd
   
      const method = req.fields.method
      const params = JSON.parse( req.fields.params )
   
      if('selectOne'==method) { // RPC for the page could handle several methods, eg one for each of CRUD
         let id = params.id

         const resp:any= {} // new response

         resp.result = 0
   
         this.ret(resp, await this.cdb.selectAll())

      } else if('selectAll'==method) { 

         this.ret(resp, await this.cdb.selectAll())

      } else if('insert'==method) { 
      

      }

      this.retErr(resp, 'no such method')
   }



}//class



module.exports = {
   Pg1Router
}