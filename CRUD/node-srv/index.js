"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Serv_1 = require("mbake/lib/Serv");
const Routers_1 = require("./routes/Routers");
const mainEApp = new Serv_1.ExpressRPC();
mainEApp.makeInstance(['*']);
mainEApp.appInst.use(function (req, res, next) {
    if (true)
        console.log('Time:', Date.now());
    next();
});
mainEApp.serveStatic('../ed');
const cRouter = new Routers_1.CrudPgRouter();
mainEApp.handleRRoute('api', 'CRUD1Pg', cRouter.route.bind(cRouter));
mainEApp.serveStatic('../www');
mainEApp.appInst.all('*', function (req, resp) {
    const path = req.path;
    console.log('no route', path);
    resp.json({ 'No route': path });
});
mainEApp.appInst.listen(8888, () => {
    console.info('server running on port: 8888');
});
