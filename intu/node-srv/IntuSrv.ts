
import { ExpressRPC } from 'mbake/lib/Serv'

import { EditorRoutes } from './routes/editor'
import { AdminRoutes } from './routes/admin'
import { ADB } from './lib/ADB';

import { Setup } from './Setup';
import { VersionNag } from 'mbake/lib/FileOpsExtra';

export class IntuApp extends ExpressRPC {

    db:ADB
    uploadRoute = new Upload()

    constructor(db:ADB) {
        super()
        this.db = db

        VersionNag.isCurrent('intu', db.veri() ).then(function(isCurrent_:boolean){
            try{
                if(!isCurrent_) 
                    console.log('There is a newer version of MetaBake\'s intu(Intuition), please update.')
                else
                    console.log('You have the current version of MetaBake\'s intu(Intuition)')
            } catch(err) {
               console.log(err)
            }
        })// 
    }//()

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

        const setup = new Setup(this.db, this)
        setup.setup()
    }
    async _runNormal() {
        const port:number = await this.db.getPort()
        this._run(port, false)
    }//()

    async _run(port:number, setup:boolean) {    
        // order of routes: api, all intu apps, webapp
        
        //api
        const ar = new AdminRoutes(this.db)
        const er = new EditorRoutes(this.db)
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