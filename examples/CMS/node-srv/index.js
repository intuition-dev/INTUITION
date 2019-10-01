"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Serv_1 = require("mbake/lib/Serv");
const logger = require('tracer').console();
const mainIApp = new Serv_1.ExpressRPC();
mainIApp.makeInstance(['*']);
async function app() {
    mainIApp.serveStatic('..' + '/www', null, null);
    mainIApp.appInst.all('*', function (req, resp) {
        const path = req.path;
        logger.trace('no route', path);
        resp.redirect('/');
    });
    mainIApp.listen(9081);
}
app();
