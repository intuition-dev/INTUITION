"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Serv_1 = require("mbake/lib/Serv");
const editorHandler_1 = require("./handlers/editorHandler");
const adminHandler_1 = require("./handlers/adminHandler");
const uploadHandler_1 = require("./handlers/uploadHandler");
const logger = require('tracer').console();
const FileOpsExtra_1 = require("mbake/lib/FileOpsExtra");
const AppLogic_1 = require("./lib/AppLogic");
class IntuApp extends Serv_1.ExpressRPC {
    constructor(db, origins, configIntu) {
        super();
        this.makeInstance(origins);
        this.db = db;
        this.uploadRoute = new uploadHandler_1.UploadHandler(this.db);
        this.configIntu = configIntu;
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
    async run(intuPath) {
        this.appInst.use(function (req, res, next) {
            console.log("--req.url", req.url);
            next();
        });
        console.log('----running');
        const ar = new adminHandler_1.AdminHandler(this.db, this.configIntu);
        const er = new editorHandler_1.EditorHandler(this.db);
        this.routeRPC2('/admin', 'admin', ar.handleRPC2.bind(ar));
        this.routeRPC2('/api', 'editors', er.handleRPC2.bind(er));
        this.appInst.post('/upload', this.uploadRoute.upload.bind(this.uploadRoute));
        this.appInst.get('/iver', (req, res) => {
            return res.send(AppLogic_1.AppLogic.veri);
        });
        this.serveStatic(intuPath, null, null);
    }
}
exports.IntuApp = IntuApp;
module.exports = {
    IntuApp
};
