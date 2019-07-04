
import { ExpressRPC } from 'mbake/lib/Serv'
import { CrudPgRouter } from './routes/Routers'


const mainEApp = new ExpressRPC()
mainEApp.makeInstance(['*'])

// RPC router
const cRouter = new CrudPgRouter()

mainEApp.handleRRoute('api', 'CRUDPg', cRouter.route.bind(cRouter))

mainEApp.serveStatic('../ed')
mainEApp.serveStatic('../www')

// start

mainEApp.appInst.listen(8888, () => {
   console.info('server running on port: 8888')
})


