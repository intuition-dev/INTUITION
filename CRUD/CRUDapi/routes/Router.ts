
export class Router {

   CRUD(req, res) {

      console.log(req.fields)
      const user = req.fields.user // user, for example to check if allowed to work with company in params
      const pswd = req.fields.pswd
   
      const method = req.fields.method
      const params = JSON.parse( req.fields.params )
   
      const resp:any= {} // new response
      if('multiply'==method) { // RPC for the page could handle several methods, eg one for each of CRUD
         let a = params.a
         let b = params.b
   
         resp.result = 0
   
         resp.type = ''//eg array
         resp.ispacked = false
         console.log(resp)
         res.json(resp)
      } else {
         resp.errorLevel = -1
         resp.errorMessage = 'mismatch'
         console.log(resp)
         res.json(resp)
      }
      console.info()
   }

}//class


module.exports = {
   Router
}