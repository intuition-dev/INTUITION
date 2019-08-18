import { CrudPgRouter } from './routes/Routers'
import { IntuApp } from 'intu/node-srv/IntuApp'
import { IDB } from     'intu/node-srv/lib/IDB'
import { Util } from 'intu/node-srv/lib/AppLogic'
import { CDB } from './lib/CDB';

// intu /////////////////////////////////////////

let mainIApp:IntuApp

function runISrv() {
   const ip = require('ip')
   const ipAddres = ip.address()

   const hostIP = 'http://' + ipAddres + ':'

   console.log("TCL: hostIP", hostIP)

   const idb = new IDB(Util.intuPath, '/IDB.sqlite')
   
   // the only place there is DB new is here.
   mainIApp = new IntuApp(idb, ['*'])
}
runISrv()

// app ////////////////////////////////////

// log requests
mainIApp.appInst.use(function (req, res, next) {
   // log requests if local
   if(true) console.log('Time:', Date.now())
   next()
})

const cdb = new CDB(Util.intuPath, '/CDB.sqlite')

//api
const cRouter = new CrudPgRouter(cdb)
mainIApp.handleRRoute('api', 'CRUD1Pg', cRouter.route.bind(cRouter))

//boiler plate
mainIApp.serveStatic('../node_modules/intu/INTU') // edit, setup, admin, can be moved to class in intu
mainIApp.serveStatic('../www')

//catch all
mainIApp.appInst.all('*', function (req, resp) {
   const path = req.path
   console.log('no route', path)
   resp.json({'No route': path })
})

// start ////////////////////////////////////////////////////////
mainIApp.start()
