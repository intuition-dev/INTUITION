
import { ExpressRPC } from 'mbake/lib/Serv'

import { EditorRoutes } from './routes/editor'
import { AdminRoutes } from './routes/admin'

export class IntuApp extends ExpressRPC {

run(port) {

    const eA = new EditorRoutes(this, adbDB);
    const aA = new AdminRoutes(this, adbDB);

    this.handleRRoute('api', 'editors', eA.ROUTES)
    this.handleRRoute('api', 'admin', aA.ROUTES)


    this.serveStatic(path.join(__dirname, '/'))
    
}//()
    
}//

module.exports = {
    IntuApp
}