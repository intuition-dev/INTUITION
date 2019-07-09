"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Serv_1 = require("mbake/lib/Serv");
const editor_1 = require("./routes/editor");
const admin_1 = require("./routes/admin");
class IntuApp extends Serv_1.ExpressRPC {
    constructor(db) {
        super();
        this.db = db;
    }
    run(port) {
        const eA = new editor_1.EditorRoutes(this, this.db);
        const aA = new admin_1.AdminRoutes(this, this.db);
        this.handleRRoute('api', 'editors', eA.ROUTES);
        this.handleRRoute('api', 'admin', aA.ROUTES);
        const appPath = this.db.getAppPath();
        this.serveStatic(appPath);
        this.appInst.get('/monitor', (req, res) => {
            this.db.monitor()
                .then(res1 => {
                return res.send('OK');
            }).catch(error => {
                console.info('monitor error: ', error);
                res.status(400);
                return res.send = (error);
            });
        });
    }
}
exports.IntuApp = IntuApp;
module.exports = {
    IntuApp
};
