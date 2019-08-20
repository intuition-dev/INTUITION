import { CrudPgRouter } from './routes/Routers'
import { IntuApp } from 'intu/node-srv/IntuApp'
import { IDB } from     'intu/node-srv/lib/IDB'
import { Util } from 'intu/node-srv/lib/AppLogic'
import { CDB } from './lib/CDB';
const logger = require('tracer').console()

// intu /////////////////////////////////////////

const idb = new IDB('.', '/IDB.sqlite')

const mainIApp = new IntuApp(idb, ['*'])

async function  runISrv() {

   let intuPath = Util.intuPath + '/node_modules/intu/INTU'
   logger.trace(intuPath)

   const setupDone = await idb.isSetupDone()

   logger.trace('?', setupDone)
   
   if (setupDone) {
       logger.trace('normal')
       await mainIApp.runNormal(intuPath)

   } else {
       logger.trace('run setup')
       await mainIApp.runWSetup(intuPath)
   }
   
   console.log('######################################','intu ready')

   app()
}
runISrv()

function app() {
   // app ////////////////////////////////////
   const cdb = new CDB('.', '/CDB.sqlite')

   //api
   const cRouter = new CrudPgRouter(cdb)
   mainIApp.handleRRoute('capi', 'CRUD1Pg', cRouter.route.bind(cRouter))

   //www
   mainIApp.serveStatic('..' + '/www')

   //catch all
   mainIApp.appInst.all('*', function (req, resp) {
      const path = req.path
      logger.trace('no route', path)
      resp.json({'No route': path })
   })

   // start ////////////////////////////////////////////////////////
   mainIApp.listen(8080)
}