import { CrudPgRouter } from './routes/Routers'

import { IntuApp } from 'intu/node-srv/IntuSrv'
import { ADB } from     'intu/node-srv/lib/ADB'

// intu /////////////////////////////////////////

let mainIApp:IntuApp

function runISrv() {
   const ip = require('ip')
   const ipAddres = ip.address()

   const hostIP = 'http://' + ipAddres + ':'

   console.log("TCL: hostIP", hostIP)
   const adbDB = new ADB()

   // the only place there is DB new is here.
   mainIApp = new IntuApp(adbDB, ['*'])
}
runISrv()

// app ////////////////////////////////////

// log requests
mainIApp.appInst.use(function (req, res, next) {
   // log requests if local
   if(true) console.log('Time:', Date.now())
   next()
})

//api
const cRouter = new CrudPgRouter()
mainIApp.handleRRoute('api', 'CRUD1Pg', cRouter.route.bind(cRouter))

//boiler plate
mainIApp.serveStatic('../node_modules/intu/WWW') // can be moved to class in intu
mainIApp.serveStatic('../www')

//catch all
mainIApp.appInst.all('*', function (req, resp) {
   const path = req.path
   console.log('no route', path)
   resp.json({'No route': path })
})

// start ////////////////////////////////////////////////////////
mainIApp.start()
