import { ExpressRPC } from 'mbake/lib/Serv'

const logger = require('tracer').console()

// intu /////////////////////////////////////////

const mainIApp = new ExpressRPC()
mainIApp.makeInstance(['*'])

async function app() {
   //www
   mainIApp.serveStatic('..' + '/www', null, null)

   //catch all
   mainIApp.appInst.all('*', function (req, resp) {

      const path = req.path
      logger.trace('no route', path)
      resp.redirect('/')
   })

   // start ////////////////////////////////////////////////////////
   mainIApp.listen(9081)
}

app()