
import { ExpressRPC } from 'mbake/lib/Serv'

import { EditorRoutes } from './routes/editor'
import { AdminRoutes } from './routes/admin'
import { ADB } from './lib/ADB';

import { Setup } from './Setup';
const path = require('path')

export class IntuApp extends ExpressRPC {

db:ADB
constructor(db:ADB) {
    super()
    this.db = db
}


start(dbName) {
    
    const pathToDb = path.join(__dirname, dbName)


try {
    //check if the file of the database exist
    if (this.db.dbExists(pathToDb)) {
       _runApp()
    } else {
       console.log('run setup')
       _runApp()
       //create db file
       const setup = new Setup(pathToDb)
       setup.setup(pathToDb)
    }
 } catch (err) {
    console.warn(err)
 }
 
function _runApp() {
    console.log('run')
    this.db.getPort(pathToDb)
       .then(function (port) {
          this.run(port)
       })
 }
  
}//()

_run(port) {
    // order if routes: api, all intu apps, webapp

    //api
    const eA = new EditorRoutes(this.db)
    const aA = new AdminRoutes(this.db)
    this.handleRRoute('api', 'editors', eA.route )
    this.handleRRoute('api', 'admin', aA.route )

    this.serveStatic('../WWW')
    
    this.serveStatic(this.db.getAppPath())

    //webapp being managed
    const appPath = this.db.getAppPath()
    this.serveStatic(appPath)

    // endpoint for monitoring
    this.appInst.get('/monitor', (req, res) => {
        this.db.monitor()
        .then(res1 => {
            return res.send('OK');
        }).catch(error => {
            console.info('monitor error: ', error)
            res.status(400);
            return res.send = (error)
        })
    })// monitor
    
}//()
    
}//

module.exports = {
    IntuApp
}