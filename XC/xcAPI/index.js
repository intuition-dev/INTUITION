"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Serv_1 = require("mbake/lib/Serv");
const mainEApp = new Serv_1.ExpressRPC();
mainEApp.makeInstance(['*']);
mainEApp.serveStatic('../xcEdit');
mainEApp.serveStatic('../xcApp');
mainEApp.appInst.post('/api', function (req, res) {
    const resp = {};
    res.result = 'OK';
    res.json(resp);
});
