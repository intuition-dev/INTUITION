
import { ExpressRPC } from 'mbake/lib/Serv';

const mainEApp = new ExpressRPC()
mainEApp.makeInstance(['*'])

mainEApp.serveStatic('../xcEdit')
mainEApp.serveStatic('../xcApp')

// use, post
mainEApp.appInst.post('/api', function(req, res){
   const resp:any= {} // new response
   res.result = 'OK'
   res.json(resp)
})
