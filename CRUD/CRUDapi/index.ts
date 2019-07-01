
import { ExpressRPC, iAuth } from 'mbake/lib/Serv'
import { Router } from './routes/Router'


const mainEApp = new ExpressRPC()
mainEApp.makeInstance(['*'])

// RPC router
const router = new Router()
mainEApp.handleRRoute('api', 'CRUD', router.CRUD)

mainEApp.serveStatic('../xcEdit')
mainEApp.serveStatic('../xcApp')

// start

mainEApp.appInst.listen(8888, () => {
   console.info('server running on port: 8888')
})


