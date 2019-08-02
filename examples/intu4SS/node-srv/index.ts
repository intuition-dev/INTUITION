
// import { IntuApp } from 'intu/node-srv/IntuSrv'
// import { SnipHook } from './lib/SnipHook';
import { Stripe } from './routes/routes'
import { ExpressRPC } from "mbake/lib/Serv"

const srv = new ExpressRPC()
srv.makeInstance(['*'])
const port = 3000
// const db = new SDB()
// const mainEApp = new IntuApp(db, ['*'])
// app starts ////////////////////////////////////

// single port - to accept the post
const stripe = new Stripe()
srv.handleRRoute("stripe", "get-session", stripe.route.bind(stripe))


// // boiler plate
// mainEApp.serveStatic('../www')

// //catch all
// mainEApp.appInst.all('*', function (req, resp) {
//    const path = req.path
//    console.log('no route', path)
//    resp.json({ 'No route': path })
// })

// // start
// mainEApp.appInst.listen(8888, () => {
//    console.info('server running on port: 8888')
// })

srv.appInst.listen(port, () => {
   console.info({ "server on port": port })
})
