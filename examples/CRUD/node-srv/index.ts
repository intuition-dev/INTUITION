import { CrudPgHandler } from './handlers/Handlers'
import { IntuApp } from 'intu/node-srv/IntuApp'
import { IDB } from     'intu/node-srv/lib/IDB'
import { Util } from 'intu/node-srv/lib/AppLogic'
import { CDB } from './lib/CDB';
const bunyan = require('bunyan')
const log = bunyan.createLogger({src: true, name: "class name"})

// intu /////////////////////////////////////////

const idb = new IDB(process.cwd(), '/IDB.sqlite')

const mainIApp = new IntuApp(idb, ['*'])


async function app() {
   // app ////////////////////////////////////
   const cdb = new CDB(process.cwd(), '/CDB.sqlite')

   const setupDone = await cdb.isSetupDone()
   log.info('app', setupDone)
   
   //api
   const cRouter = new CrudPgHandler(cdb)

   mainIApp.handleRRoute('capi', 'CRUD1Pg', cRouter.route.bind(cRouter))

   //www
   mainIApp.serveStatic('..' + '/www', null, null)

   //catch all
   mainIApp.appInst.all('*', function (req, resp) {
      const path = req.path
      log.info('no route', path)
      resp.json({'No route': path })
   })

   // start ////////////////////////////////////////////////////////
   mainIApp.listen(8080)
}

async function  runISrv() {

   const setupDone = await idb.isSetupDone()
   log.info('?', setupDone)
   
   let intuPath = Util.appPath + '/node_modules/intu/INTU'
   log.info(intuPath)

   if (setupDone) {
       log.info('normal')
       await mainIApp.run(intuPath)

   } else {
       log.info('run setup')
       await mainIApp.run(intuPath)
   }
   
   console.log('######################################','intu ready')

   app()
}

runISrv()
