
import { IntuApp } from 'intu/node-srv/IntuSrv'
import { SDB } from './lib/SDB'
import { SnipHook } from './lib/SnipHook';

const db = new SDB()
const mainEApp = new IntuApp(db, ['*'])
// app starts ////////////////////////////////////

// single port - to accept the post
const snipHook = new SnipHook(db) 
mainEApp.appInst.post('/api/snipHook/', snipHook.handleWebHook)

// boiler plate
mainEApp.serveStatic('../www')

//catch all
mainEApp.appInst.all('*', function (req, resp) {
   const path = req.path
   console.log('no route', path)
   resp.json({'No route': path })
})

// start
mainEApp.appInst.listen(8888, () => {
   console.info('server running on port: 8888')
})
