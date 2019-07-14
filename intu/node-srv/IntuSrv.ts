
import { ExpressRPC } from 'mbake/lib/Serv'

import { EditorRoutes } from './routes/editor'
import { AdminRoutes } from './routes/admin'
import { ADB } from './lib/ADB';

import { Setup } from './Setup';
import { SetupRoutes } from './routes/setup';

export class IntuApp extends ExpressRPC {

    db:ADB
    uploadRoute = new Upload()

    constructor(db:ADB) {
        super()
        this.db = db
    }

    start() {
        try {
            //check if the file of the database exist
            if (this.db.dbExists()) {
                this._runNormal()
            } else {
            console.log('run setup')
                this._runSetup()
                
            }
        } catch (err) {
            console.warn(err)
        }
    }//()

    _runSetup() {
        this._run(8090, true)

        const setup = new Setup(this.db)
        setup.setup()
    }

    async _runNormal() {
        const port:number = await this.db.getPort()
        this._run(port, false)
    }//()

    async _run(port:number, setup:boolean) {    
        // order of routes: api, all intu apps, webapp
        
        //api
        const sr = new SetupRoutes(this.db)
        const ar = new AdminRoutes(this.db)
        const er = new EditorRoutes(this.db)
        this.handleRRoute('setup', 'setup', sr.route )
        this.handleRRoute('admin', 'admin', ar.route )
        this.handleRRoute('api', 'editors', er.route )

        this.appInst.post('/upload', this.uploadRoute.upload)

        this.serveStatic('../WWW')// the editor apps

        if(!setup) {
            const appPath:string = await this.db.getAppPath()
            //webapp being managed
            this.serveStatic(appPath)
        }

        // endpoint for monitoring
        this.appInst.get('/monitor',  (req, res) => {
            this.db.monitor()
            .then(count => {
                return res.send('OK')
            }).catch(error => {
                console.info('monitor error: ', error)
                res.status(400);
                return res.send = (error)
            })
        })//

        // get version
        this.appInst.get('/ver',  (req, res) => {
            return res.send(this.db.veri)
        })

        this.listen(port)
    }//()
    
}//class

module.exports = {
    IntuApp
}