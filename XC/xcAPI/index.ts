
import { ExpressRPC } from 'mbake/lib/Serv';

const mainEApp = new ExpressRPC()
mainEApp.makeInstance(['*'])

mainEApp.serveStatic('../')
mainEApp.serveStatic('../')

// use, post
mainEApp.appInst.post('/api', function(req, res){

})