"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Serv_1 = require("mbake/lib/Serv");
const editorHandler_1 = require("./handlers/editorHandler");
const adminHandler_1 = require("./handlers/adminHandler");
const uploadHandler_1 = require("./handlers/uploadHandler");
const bunyan = require('bunyan');
const bformat = require('bunyan-format');
const formatOut = bformat({ outputMode: 'short' });
const log = bunyan.createLogger({ src: true, stream: formatOut, name: "some name" });
const FileOpsExtra_1 = require("mbake/lib/FileOpsExtra");
const AppLogic_1 = require("./lib/AppLogic");
class IntuApp extends Serv_1.ExpressRPC {
    constructor(db, origins, configIntu) {
        super();
        this.makeInstance(origins);
        this.db = db;
        this.configIntu = configIntu;
        this.uploadRoute = new uploadHandler_1.UploadHandler(this.db, this.configIntu);
        FileOpsExtra_1.VersionNag.isCurrent('intu', AppLogic_1.AppLogic.veri()).then(function (isCurrent_) {
            try {
                if (!isCurrent_)
                    log.info('There is a newer version of intu(INTUITION.DEV), please update.');
            }
            catch (err) {
                log.info(err);
            }
        });
    }
    start(intuPath) {
        this.appInst.use(function (req, res, next) {
            log.info("--req.url", req.url);
            next();
        });
        log.info('----running');
        const ar = new adminHandler_1.AdminHandler(this.db, this.configIntu);
        const er = new editorHandler_1.EditorHandler(this.db, this.configIntu);
        this.routeRPC('/admin', 'admin', ar.handleRPC.bind(ar));
        this.routeRPC('/api', 'editors', er.handleRPC.bind(er));
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
