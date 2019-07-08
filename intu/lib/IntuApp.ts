
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
    // order: api, admin, editors, webapp

    const eA = new EditorRoutes(this, this.db)
    const aA = new AdminRoutes(this, this.db)
    this.handleRRoute('api', 'editors', eA.ROUTES)
    this.handleRRoute('api', 'admin', aA.ROUTES)


    this.serveStatic(path.join(__dirname, '/'))
    
}//()
    
}//

module.exports = {
    IntuApp
}