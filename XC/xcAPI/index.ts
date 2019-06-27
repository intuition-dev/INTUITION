
import { ExpressRPC } from 'mbake/lib/Serv'

const mainEApp = new ExpressRPC()
mainEApp.makeInstance(['*'])

mainEApp.serveStatic('../xcEdit')
mainEApp.serveStatic('../xcApp')

// RPC
mainEApp.appInst.post('/api1', function(req, res){
   const resp:any= {} // new response
   res.result = 'OK'
   res.json(resp)
})

// start
mainEApp.appInst.listen(8888, () => {
   console.info('server running on port: 8888')
})