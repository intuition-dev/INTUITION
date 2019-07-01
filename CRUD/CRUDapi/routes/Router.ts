
import { CDB } from '../lib/CDB'


export class Router {

   cdb:CDB

   constructor() {
      this.cdb =new CDB()
      this..init()
      /* for dev only
      .then(function(){
         cdb.selectAll()
      })
      */
   }

   CRUD(req, res) {

      const user = req.fields.user // user, for example to check if allowed to work with company in params
      const pswd = req.fields.pswd
   
      const method = req.fields.method
      const params = JSON.parse( req.fields.params )
   
      if('selectOne'==method) { // RPC for the page could handle several methods, eg one for each of CRUD
         let a = params.a
         let b = params.b

         const resp:any= {} // new response

         resp.result = 0
   
         resp.type = ''//eg array
         resp.ispacked = false
         console.log(resp)
         res.json(resp)

      } else if('selectAll'==method) { 

         const resp:any= {} // new response
         resp.result = await this.cdb.selectAll()
         resp.type = ''//eg array
         resp.ispacked = false
         console.log(resp)
         res.json(resp)

      } else if('insert'==method) { 
      
      
      }

      const resp:any= {} // new response
      resp.errorLevel = -1
      resp.errorMessage = 'mismatch'
      console.log(resp)
      res.json(resp)
      
      console.info()
   }

}//class


module.exports = {
   Router
}