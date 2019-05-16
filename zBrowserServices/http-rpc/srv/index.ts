
// from mbake
import { ExpressRPC } from 'mbake/lib/Serv'

let allowedDomains = []
allowedDomains.push('one.com') // get from config.yaml, should never be '*'
allowedDomains.push('two.org') // XXX host or local would match localhost

// makes a configured express instance
const serviceApp = ExpressRPC.makeInstance(allowedDomains)


serviceApp.post('/pageOne', (req, res) => { // post only

   console.log(req.fields)
   const user = req.fields.user // user, for example to check if allowed to work with company in params
   const pswd = req.fields.pswd

   const method = req.fields.method
   const params = JSON.parse( req.fields.params )

   const resp:any= {} // new response
   if('multiply'==method) { // RPC for the page could handle several methods, eg one for each of CRUD
      let a = params.a
      let b = params.b

      resp.result = multiply(a,b)

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
})

// should be class - maybe used by multiple routes
function multiply(a,b) {
   return a*b
}


serviceApp.listen(8888, () => {
   console.info('server running on port: 8888')
})
