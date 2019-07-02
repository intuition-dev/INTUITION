
import { ExpressRPC } from 'mbake/lib/Serv'
import { Pg1Router } from './routes/Routers'


const mainEApp = new ExpressRPC()
mainEApp.makeInstance(['*'])

// RPC router
const pg1Router = new Pg1Router()

mainEApp.handleRRoute('api', 'editPg', pg1Router.route.bind(pg1Router))

mainEApp.serveStatic('../xcEdit')
mainEApp.serveStatic('../xcApp')

// start

mainEApp.appInst.listen(8888, () => {
   console.info('server running on port: 8888')
})


