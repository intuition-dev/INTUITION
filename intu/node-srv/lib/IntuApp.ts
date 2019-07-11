
import { ExpressRPC } from 'mbake/lib/Serv'

import { EditorRoutes } from './routes/editor'
import { AdminRoutes } from './routes/admin'
import { ADB } from './ADB';

export class IntuApp extends ExpressRPC {

db:ADB
constructor(db:ADB) {
    super()
    this.db = db
}

run(port) {
    // order if routes: api, 3 intu apps webapp

    //api
    const eA = new EditorRoutes(this, this.db)
    const aA = new AdminRoutes(this, this.db)
    this.handleRRoute('api', 'editors', eA.route )
    this.handleRRoute('api', 'admin', aA.route )

    this.serveStatic('../WWW')

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