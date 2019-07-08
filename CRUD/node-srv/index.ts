
import { ExpressRPC } from 'mbake/lib/Serv'
import { CrudPgRouter } from './routes/Routers'

const mainEApp = new ExpressRPC()
mainEApp.makeInstance(['*'])

// log requests
mainEApp.appInst.use(function (req, res, next) {
   // log requests if local
   if(true) console.log('Time:', Date.now())
   next()
})

// app start ///////////////////////
mainEApp.serveStatic('../ed')

const cRouter = new CrudPgRouter()
mainEApp.handleRRoute('api', 'CRUD1Pg', cRouter.route.bind(cRouter))

// write first
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


