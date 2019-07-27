import { CrudPgRouter } from './routes/Routers'

import { IntuApp } from 'intu/node-srv/IntuSrv'
import { ADB } from     'intu/node-srv/lib/ADB'

// intu /////////////////////////////////////////

let mainEApp

function runISrv() {
   const ip = require('ip')
   const ipAddres = ip.address()

   const hostIP = 'http://' + ipAddres + ':'

   console.log("TCL: hostIP", hostIP)
   const adbDB = new ADB()

   // the only place there is DB new is here.
   mainEApp = new IntuApp(adbDB, '../node_modules/intu/WWW', ['*'])
}
runISrv()

// app starts ////////////////////////////////////

// log requests
mainEApp.appInst.use(function (req, res, next) {
   // log requests if local
   if(true) console.log('Time:', Date.now())
   next()
})

//api
const cRouter = new CrudPgRouter()
mainEApp.handleRRoute('api', 'CRUD1Pg', cRouter.route.bind(cRouter))

//boiler plate
mainEApp.serveStatic('../www')

//catch all
mainEApp.appInst.all('*', function (req, resp) {
   const path = req.path
   console.log('no route', path)
   resp.json({'No route': path })
})

// start ////////////////////////////////////////////////////////
mainEApp.start()
