"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Serv_1 = require("mbake/lib/Serv");
const Routers_1 = require("./routes/Routers");
const mainEApp = new Serv_1.ExpressRPC();
mainEApp.makeInstance(['*']);
const pg1Router = new Routers_1.Pg1Router();
mainEApp.handleRRoute('api', 'editPg', pg1Router.route.bind(pg1Router));
mainEApp.serveStatic('../xcEdit');
mainEApp.serveStatic('../xcApp');
mainEApp.appInst.listen(8888, () => {
    console.info('server running on port: 8888');
});
