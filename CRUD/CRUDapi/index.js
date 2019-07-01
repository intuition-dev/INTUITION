"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Serv_1 = require("mbake/lib/Serv");
const Router_1 = require("./routes/Router");
const mainEApp = new Serv_1.ExpressRPC();
mainEApp.makeInstance(['*']);
const pg1Router = new Router_1.Pg1Router();
mainEApp.handleRRoute('api', 'CRUD', pg1Router.route);
mainEApp.serveStatic('../xcEdit');
mainEApp.serveStatic('../xcApp');
mainEApp.appInst.listen(8888, () => {
    console.info('server running on port: 8888');
});
