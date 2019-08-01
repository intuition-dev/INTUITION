"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Serv_1 = require("mbake/lib/Serv");
const editorRoutes_1 = require("./routes/editorRoutes");
const adminRoutes_1 = require("./routes/adminRoutes");
const uploadRoute_1 = require("./routes/uploadRoute");
const ADB_1 = require("./lib/ADB");
const Setup_1 = require("./Setup");
const FileOpsExtra_1 = require("mbake/lib/FileOpsExtra");
class IntuApp extends Serv_1.ExpressRPC {
    constructor(db, origins) {
        super();
        this.makeInstance(origins);
        this.db = db;
        this.uploadRoute = new uploadRoute_1.UploadRoute();
        FileOpsExtra_1.VersionNag.isCurrent('intu', ADB_1.ADB.veri()).then(function (isCurrent_) {
            try {
                if (!isCurrent_)
                    console.log('There is a newer version of MetaBake\'s intu(Intuition), please update.');
                else
                    console.log('You have the current version of MetaBake\'s intu(Intuition)');
            }
            catch (err) {
                console.log(err);
            }
        });
    }
    async start() {
        console.log('starting intu');
        try {
            if (this.db.dbExists()) {
                const setupDone = await this.db.isSetupDone();
                if (setupDone) {
                    await this.db.init();
                    this._runNormal();
                }
                else {
                    console.log('run setup');
                    this._runSetup();
                }
            }
            else {
                console.log('run setup');
                this._runSetup();
            }
        }
        catch (err) {
            console.warn(err);
        }
    }
    _runSetup() {
        this._run(9081);
        console.log('setup');
        const setup = new Setup_1.Setup(this.db, this);
        setup.setup();
    }
    async _runNormal() {
        const port = await this.db.getPort();
        console.log('_runNormal port:', port);
        this._run(port);
    }
    async _run(port) {
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
            return res.send(ADB_1.ADB.veri);
        });
        this.listen(port);
    }
}
exports.IntuApp = IntuApp;
module.exports = {
    IntuApp
};
