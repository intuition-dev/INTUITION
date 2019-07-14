"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Serv_1 = require("mbake/lib/Serv");
const editor_1 = require("./routes/editor");
const admin_1 = require("./routes/admin");
const Setup_1 = require("./Setup");
const FileOpsExtra_1 = require("mbake/lib/FileOpsExtra");
class IntuApp extends Serv_1.ExpressRPC {
    constructor(db) {
        super();
        this.uploadRoute = new Upload();
        this.db = db;
        FileOpsExtra_1.VersionNag.isCurrent('intu', db.veri()).then(function (isCurrent_) {
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
    start() {
        try {
            if (this.db.dbExists()) {
                this._runNormal();
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
        this._run(8090, true);
        const setup = new Setup_1.Setup(this.db, this);
        setup.setup();
    }
    async _runNormal() {
        const port = await this.db.getPort();
        this._run(port, false);
    }
    async _run(port, setup) {
        const ar = new admin_1.AdminRoutes(this.db);
        const er = new editor_1.EditorRoutes(this.db);
        this.handleRRoute('admin', 'admin', ar.route);
        this.handleRRoute('api', 'editors', er.route);
        this.appInst.post('/upload', this.uploadRoute.upload);
        this.serveStatic('../WWW');
        if (!setup) {
            const appPath = await this.db.getAppPath();
            this.serveStatic(appPath);
        }
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
            return res.send(this.db.veri);
        });
        this.listen(port);
    }
}
exports.IntuApp = IntuApp;
module.exports = {
    IntuApp
};
