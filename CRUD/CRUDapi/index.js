"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Serv_1 = require("mbake/lib/Serv");
const CDB_1 = require("./lib/CDB");
CDB_1.CDB.initSchema();
const mainEApp = new Serv_1.ExpressRPC();
mainEApp.makeInstance(['*']);
mainEApp.handleRRoute('api', 'editPg', function (req, res) {
    const resp = {};
    resp.result = 'OK';
    res.json(resp);
});
mainEApp.serveStatic('../xcEdit');
mainEApp.serveStatic('../xcApp');
