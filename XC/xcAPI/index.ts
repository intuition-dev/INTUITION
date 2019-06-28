
import { ExpressRPC } from 'mbake/lib/Serv'

const mainEApp = new ExpressRPC()
mainEApp.makeInstance(['*'])

// RPC
mainEApp.appInst.post('/api/editPg', function(req, res){

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