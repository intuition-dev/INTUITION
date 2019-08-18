
import { ExpressRPC } from 'mbake/lib/Serv'

import { EditorRoutes } from './routes/editorRoutes'
import { AdminRoutes } from './routes/adminRoutes'
import { UploadRoute } from './routes/uploadRoute'
const logger = require('tracer').console()

import { IDB } from './lib/IDB';

import { Setup } from './Setup';
import { VersionNag } from 'mbake/lib/FileOpsExtra';
import { AppLogic } from './lib/AppLogic';
import { Util } from './lib/AppLogic';

export class IntuApp extends ExpressRPC {

    db: IDB
    uploadRoute

    constructor(db: IDB, origins: Array<string>) {
        super()
        this.makeInstance(origins)

        this.db = db
        this.uploadRoute = new UploadRoute()

        VersionNag.isCurrent('intu', AppLogic.veri()).then(function (isCurrent_: boolean) {
            try {
                if (!isCurrent_)
                    console.log('There is a newer version of intu(INTUITION.DEV), please update.')
            } catch (err) {
                console.log(err)
            }
        })// 
    }//()
  
    async runWSetup(intuPath) {
        console.log('setup')

        await this.db.init() //here we create tables

        const setup = new Setup(this.db, this)
        setup.setup()

        this._run(Util.intuPath+'/INTU')
    }//()

    async runNormal(intuPath) {
        this._run(Util.intuPath+'/INTU')
    }//()

    async _run(intuPath) {
        // order of routes: api, all intu apps, webapp
        console.log('running')
        //1 API
        const ar = new AdminRoutes(this.db)
        const er = new EditorRoutes(this.db)

        this.handleRRoute('admin', 'admin', ar.route.bind(ar))
        this.handleRRoute('api', 'editors', er.route.bind(er))

        this.appInst.post('/upload', this.uploadRoute.upload)

        // endpoint for monitoring
        this.appInst.get('/imonitor', (req, res) => {
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
        this.appInst.get('/iver', (req, res) => {
            return res.send(AppLogic.veri)
        })

        // 2 INTU
        this.serveStatic(intuPath)

    }//()

}//class

module.exports = {
    IntuApp
}