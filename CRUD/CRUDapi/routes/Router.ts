
import { CDB } from '../lib/CDB'


export class Pg1Router {

   cdb:CDB

   constructor() {
      this.cdb =new CDB()
      this.cdb.init()
      /* for dev only
      .then(function(){
         cdb.selectAll()
      })
      */
   }

   /**
    * Dynamically invoke RPC method for a Page, acts like a switch()
      eg: mainEApp.handleRRoute('api', 'editors', pg1Router.route)

    * @param req 
    * @param resp 
    */
   async route(req, resp) {
      try {
         const user = req.fields.user
         const pswd = req.fields.pswd
      
         const method = req.fields.method
         const params = JSON.parse( req.fields.params )
      
         this[method](resp, params, user, pswd)
      } catch(err) {
         this.retErr(resp, err)
      }
   }


   async selectAll(resp, params, user, pswd) {

      this.ret(resp, 'OK')

   }//()


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

   /**
    * returns a data response
    * @param resp http response
    * @param result data
    */
   ret(resp, result) {
      const ret:any= {} // new return
      ret.result = result
      resp.json(ret)
   }

   /**
    * returns an error
    * @param resp http response
    * @param msg error msg
    */
   retErr(resp, msg) {
      const ret:any= {} // new return
      ret.errorLevel = -1
      ret.errorMessage = msg
      resp.json(resp)
   }

}//class



module.exports = {
   Pg1Router
}