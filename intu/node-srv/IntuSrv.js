"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Serv_1 = require("mbake/lib/Serv");
const editor_1 = require("./routes/editor");
const admin_1 = require("./routes/admin");
const Setup_1 = require("./Setup");
const setup_1 = require("./routes/setup");
class IntuApp extends Serv_1.ExpressRPC {
    constructor(db) {
        super();
        this.db = db;
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
        const setup = new Setup_1.Setup(this.db);
        setup.setup();
    }
    async _runNormal() {
        const port = await this.db.getPort();
        this._run(port, false);
    }
    async _run(port, setup) {
        const sr = new setup_1.SetupRoutes(this.db);
        const ar = new admin_1.AdminRoutes(this.db);
        const er = new editor_1.EditorRoutes(this.db);
        this.handleRRoute('setup', 'setup', sr.route);
        this.handleRRoute('admin', 'admin', ar.route);
        this.handleRRoute('api', 'editors', er.route);
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
        this.listen(port);
    }
}
exports.IntuApp = IntuApp;
module.exports = {
    IntuApp
};
