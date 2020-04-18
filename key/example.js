"use strict";
// const URL = require('url')
Object.defineProperty(exports, "__esModule", { value: true });
const terse_b_1 = require("terse-b/terse-b");
const log = new terse_b_1.TerseB("example");
const Serv_1 = require("http-rpc/lib/Serv");
const srv = new Serv_1.Serv(['*'], 4 * 1024);
Serv_1.Serv._expInst.get('/red', function (request, response) {
    response.send('Hello RED');
});
srv.serveStatic('./webApp', 1, 1);
srv.listen(8080);
