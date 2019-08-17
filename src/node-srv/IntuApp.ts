
import { ExpressRPC } from 'mbake/lib/Serv'

import { EditorRoutes } from './routes/editorRoutes'
import { AdminRoutes } from './routes/adminRoutes'
import { UploadRoute } from './routes/uploadRoute'
const logger = require('tracer').console()

import { IDB, Util } from './lib/IDB';

import { Setup } from './Setup';
import { VersionNag } from 'mbake/lib/FileOpsExtra';

export class IntuApp extends ExpressRPC {

    db: IDB
    uploadRoute

    constructor(db: IDB, origins: Array<string>) {
        super()
        this.makeInstance(origins)

        this.db = db
        this.uploadRoute = new UploadRoute()

        VersionNag.isCurrent('intu', IDB.veri()).then(function (isCurrent_: boolean) {
            try {
                if (!isCurrent_)
                    console.log('There is a newer version of intu(INTUITION.DEV), please update.')

            } catch (err) {
                console.log(err)
            }
        })// 
    }//()

    async start() {
        console.log('starting intu')
        try {
            //check if the file of the database exist
            if (this.db.dbExists()) { //here we check if file exists
                const setupDone = await this.db.isSetupDone()
                if (setupDone) {
                    await this.db.init() //here we create tables
                    this._runNormal()
                } else {
                    logger.trace('run setup')
                    this._runSetup()
                }
            } else {
                logger.trace('run setup')
                this._runSetup()

            }
        } catch (err) {
            logger.warn(err)
        }
    }//()

    _runSetup() {
        this._run(9081)
        console.log('setup')
        const setup = new Setup(this.db, this)
        setup.setup()
    }

    async _runNormal() {
        const port: number = await this.db.getPort()
        this._run(port)

    }//()

    async _run(port: number) {
        // order of routes: api, all intu apps, webapp
        console.log('running')
        //1 API
        const ar = new AdminRoutes(this.db)
        const er = new EditorRoutes(this.db)
        this.handleRRoute('admin', 'admin', ar.route.bind(ar))
        this.handleRRoute('api', 'editors', er.route.bind(er))

        this.appInst.post('/upload', this.uploadRoute.upload)

        // endpoint for monitoring
        this.appInst.get('/monitor', (req, res) => {
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
        this.appInst.get('/ver', (req, res) => {
            return res.send(IDB.veri)
        })

        // 2 INTU
        this.serveStatic(Util.intuPath+'/INTU')

        // 3 APP
        const THIZ = this
        this.db.getAppPath().then(appPath => {
            console.log('_runNormal port:', port, appPath)

            if (typeof appPath !== 'undefined') {
                this.serveStatic(appPath)
            }

            THIZ.listen(port)
        })

    }//()

}//class

module.exports = {
    IntuApp
}