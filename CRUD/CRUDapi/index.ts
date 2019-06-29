
import { ExpressRPC, iAuth } from 'mbake/lib/Serv'

const mainEApp = new ExpressRPC()
mainEApp.makeInstance(['*'])

// RPC
mainEApp.handleRRoute('api', 'editPg', function(req, res){
   const resp:any= {} // new response
   resp.result = 'OK'
   res.json(resp)
})

mainEApp.serveStatic('../xcEdit')
mainEApp.serveStatic('../xcApp')

// start
mainEApp.appInst.listen(8888, () => {
   console.info('server running on port: 8888')
})

// example impl
class Check implements iAuth {

   auth(user:string, pswd:string, resp?, ctx?):Promise<string> {
      return new Promise( function (resolve, reject) {
         resolve('NO')
      })
   }//()

}//class