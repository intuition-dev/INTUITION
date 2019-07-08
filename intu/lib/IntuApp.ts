
import { ExpressRPC } from 'mbake/lib/Serv'

import { EditorRoutes } from './routes/editor'
import { AdminRoutes } from './routes/admin'
import { ADB } from './ADB';

export class IntuApp extends ExpressRPC {

db:ADB
constcutor(db:ADB) {
    this.db = db
}

run(port) {
    // order if routes: api, admin, editors, webapp

    //api
    const eA = new EditorRoutes(this, this.db)
    const aA = new AdminRoutes(this, this.db)
    this.handleRRoute('api', 'editors', eA.ROUTES)
    this.handleRRoute('api', 'admin', aA.ROUTES)

    //admin

    //editors

    //webapp
    const appPath = this.db.getAppPath()
    this.serveStatic(appPath)
    
}//()
    
}//

module.exports = {
    IntuApp
}