
import { ExpressRPC, iAuth } from 'mbake/lib/Serv'
import { CDB } from './lib/CDB'
import { Router } from './routes/Router'

const cdb =new CDB()
cdb.init()
/* for dev only
.then(function(){
   cdb.selectAll()
})
*/

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


