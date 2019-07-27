
import { ExpressRPC } from 'mbake/lib/Serv'

import { EditorRoutes } from './routes/editorRoutes'
import { AdminRoutes } from './routes/adminRoutes'
import { UploadRoute } from './routes/uploadRoute'

import { ADB } from './lib/ADB';

import { Setup } from './Setup';
import { VersionNag } from 'mbake/lib/FileOpsExtra';

export class IntuApp extends ExpressRPC {

    db:ADB
    uploadRoute
    WWW: string

    constructor(db:ADB, WWW:string, origins:Array<string>) {
        super()
        this.WWW = WWW
        this.makeInstance(origins)

        this.db = db
        this.uploadRoute = new UploadRoute()

        VersionNag.isCurrent('intu', ADB.veri() ).then(function(isCurrent_:boolean){
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

    async start() {
        console.log('starting intu')
        try {
            //check if the file of the database exist
            if (this.db.dbExists()) {
                await this.db.init()
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
        this._run(9081, true)
        console.log('setup')
        const setup = new Setup(this.db, this)
        setup.setup()
    }

    async _runNormal() {
        const port:number = await this.db.getPort()
        console.log('_runNormal port:', port)
        this._run(port, false)
    }//()

    async _run(port:number, setup:boolean) {    
        // order of routes: api, all intu apps, webapp
        console.log('running')    
        //api
        const ar = new AdminRoutes(this.db)
        const er = new EditorRoutes(this.db)
        this.handleRRoute('admin', 'admin', ar.route.bind(ar) )
        this.handleRRoute('api', 'editors', er.route.bind(er) )

        this.appInst.post('/upload', this.uploadRoute.upload)

        console.log('i', this.WWW)
        this.serveStatic(this.WWW)// the editor apps

        if(!setup) {
            const appPath:string = await this.db.getAppPath()
            console.log('appPath: ', appPath);
            //webapp being managed
            if (appPath !== null) {
                this.serveStatic(appPath);
            }
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
            return res.send(ADB.veri)
        })

        this.listen(port)
    }//()
    
}//class

module.exports = {
    IntuApp
}