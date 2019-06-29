"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Serv_1 = require("mbake/lib/Serv");
const mainEApp = new Serv_1.ExpressRPC();
mainEApp.makeInstance(['*']);
mainEApp.handleRRoute('api', 'editPg', function (req, res) {
    const resp = {};
    resp.result = 'OK';
    res.json(resp);
});
mainEApp.serveStatic('../xcEdit');
mainEApp.serveStatic('../xcApp');
mainEApp.appInst.listen(8888, () => {
    console.info('server running on port: 8888');
});
class Check {
    auth(user, pswd, resp, ctx) {
        return new Promise(function (resolve, reject) {
            resolve('NO');
        });
    }
}
