"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Serv_1 = require("mbake/lib/Serv");
const editorRoutes_1 = require("./routes/editorRoutes");
const adminRoutes_1 = require("./routes/adminRoutes");
const uploadRoute_1 = require("./routes/uploadRoute");
const logger = require('tracer').console();
const Setup_1 = require("./Setup");
const FileOpsExtra_1 = require("mbake/lib/FileOpsExtra");
const AppLogic_1 = require("./lib/AppLogic");
const AppLogic_2 = require("./lib/AppLogic");
class IntuApp extends Serv_1.ExpressRPC {
    constructor(db, origins) {
        super();
        this.makeInstance(origins);
        this.db = db;
        this.uploadRoute = new uploadRoute_1.UploadRoute();
        FileOpsExtra_1.VersionNag.isCurrent('intu', AppLogic_1.AppLogic.veri()).then(function (isCurrent_) {
            try {
                if (!isCurrent_)
                    console.log('There is a newer version of intu(INTUITION.DEV), please update.');
            }
            catch (err) {
                console.log(err);
            }
        });
    }
    async start() {
        console.log('starting intu');
        try {
            const setupDone = await this.db.isSetupDone();
            if (setupDone) {
                logger.trace('setup done');
                await this.db.init();
                this._runNormal();
            }
            else {
                logger.trace('run setup');
                this._runSetup();
            }
        }
        catch (err) {
            logger.warn(err);
        }
    }
    _runSetup() {
        console.log('setup');
        const setup = new Setup_1.Setup(this.db, this);
        setup.setup();
        this._run(9081, AppLogic_2.Util.intuPath + '/ROOT');
    }
    async _runNormal() {
        const port = await this.db.getPort();
        this.db.getAppPath().then(appPath => {
            this._run(port, appPath);
        });
    }
    async _run(port, appPath) {
        console.log('running');
        const ar = new adminRoutes_1.AdminRoutes(this.db);
        const er = new editorRoutes_1.EditorRoutes(this.db);
        this.handleRRoute('admin', 'admin', ar.route.bind(ar));
        this.handleRRoute('api', 'editors', er.route.bind(er));
        this.appInst.post('/upload', this.uploadRoute.upload);
        this.appInst.get('/monitor', (req, res) => {
            this.db.monitor()
                .then(count => {
                return res.send('OK');
            }).catch(error => {
                console.info('monitor error: ', error);
                res.status(400);
                return res.send = (error);
            });
        });
        this.appInst.get('/ver', (req, res) => {
            return res.send(AppLogic_1.AppLogic.veri);
        });
        this.serveStatic(AppLogic_2.Util.intuPath + '/INTU');
        this.serveStatic(appPath);
        this.listen(port);
    }
}
exports.IntuApp = IntuApp;
module.exports = {
    IntuApp
};
