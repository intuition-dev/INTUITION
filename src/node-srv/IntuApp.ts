
import { ExpressRPC } from 'mbake/lib/Serv'

// import { ExpressRPC, iAuth } from './Serv'

import { EditorHandler } from './handlers/editorHandler'
import { AdminHandler } from './handlers/adminHandler'
import { UploadHandler } from './handlers/uploadHandler'
const logger = require('tracer').console()

import { IDB } from './lib/IDB';

import { SetupHandler } from './handlers/SetupHandler';
import { VersionNag } from 'mbake/lib/FileOpsExtra';
import { AppLogic } from './lib/AppLogic';

export class IntuApp extends ExpressRPC {

    db: IDB
    uploadRoute

    constructor(db: IDB, origins: Array<string>) {
        super()
        this.makeInstance(origins)

        this.db = db
        this.uploadRoute = new UploadHandler(this.db)

        VersionNag.isCurrent('intu', AppLogic.veri()).then(function (isCurrent_: boolean) {
            try {
                if (!isCurrent_)
                    console.log('There is a newer version of intu(INTUITION.DEV), please update.')
            } catch (err) {
                console.log(err)
            }
        })// 
    }//()

    async run(intuPath) {
        console.log('----setup')

        this.appInst.use(function (req, res, next) {
            console.log("--req.url", req.url)
            next()
        })
        let isSetupDone: boolean = await this.db.isSetupDone()
        if (!isSetupDone) {
            console.log('can do setup')
            const sr = new SetupHandler(this.db)
            this.routeRPC2('/setup', 'setup', sr.handleRPC2.bind(sr))
        }

        this._run(intuPath)
    }//()

    async _run(intuPath) {
        // order of Handler: api, all intu apps, Web App
        console.log('----running')
        //1 API
        const ar = new AdminHandler(this.db)
        const er = new EditorHandler(this.db)

        this.routeRPC2('/admin', 'admin', ar.handleRPC2.bind(ar))

        this.routeRPC2('/api', 'editors', er.handleRPC2.bind(er))

        this.appInst.post('/upload', this.uploadRoute.upload.bind(this.uploadRoute))

        // get version
        this.appInst.get('/iver', (req, res) => {
            return res.send(AppLogic.veri)
        })

        // 2 INTU
        this.serveStatic(intuPath, null, null)

    }//()

}//class

module.exports = {
    IntuApp
}