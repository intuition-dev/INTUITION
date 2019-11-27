import { Serv } from 'mbake/lib/Serv'

const bunyan = require('bunyan')
const bformat = require('bunyan-format2')  
const formatOut = bformat({ outputMode: 'short' })
const log = bunyan.createLogger({src: true, stream: formatOut, name: "some name"})

// intu /////////////////////////////////////////

const mainIApp = new Serv(['*'])

async function app() {
   //www
   mainIApp.serveStatic('..' + '/www', null, null)

   //catch all
   mainIApp.appInst.all('*', function (req, resp) {

      const path = req.path
      log.info('no route', path)
      resp.redirect('/')
   })

   // start ////////////////////////////////////////////////////////
   mainIApp.listen(9081)
}

app()