
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
        this.uploadRoute = new UploadRoute(this.db)

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
        console.log('setup')

        let isSetupDone:boolean = await this.db.isSetupDone() 
        if(!isSetupDone) {
            const setup = new Setup(this.db, this)
            setup.setup()
        }
        
        this._run(intuPath)
    }//()

    async _run(intuPath) {
        // order of routes: api, all intu apps, Web App
        console.log('running')
        //1 API
        const ar = new AdminRoutes(this.db)
        const er = new EditorRoutes(this.db)

        this.handleRRoute('admin', 'admin', ar.route.bind(ar))
        this.handleRRoute('api', 'editors', er.route.bind(er))

        this.appInst.post('/upload', this.uploadRoute.upload.bind(this.uploadRoute))

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