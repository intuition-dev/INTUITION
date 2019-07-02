"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CDB_1 = require("../lib/CDB");
const logger = require('tracer').console();
const Serv_1 = require("mbake/lib/Serv");
class Pg1Router extends Serv_1.BasePgRouter {
    constructor() {
        super();
        this.cdb = new CDB_1.CDB();
        this.cdb.init();
    }
    selectAll(resp, params, user, pswd) {
        this.ret(resp, 'Data here');
    }
    async CRUD0(req, resp) {
        const user = req.fields.user;
        const pswd = req.fields.pswd;
        const method = req.fields.method;
        const params = JSON.parse(req.fields.params);
        if ('selectOne' == method) {
            let id = params.id;
            const resp = {};
            resp.result = 0;
            this.ret(resp, await this.cdb.selectAll());
        }
        else if ('selectAll' == method) {
            this.ret(resp, await this.cdb.selectAll());
        }
        else if ('insert' == method) {
        }
        this.retErr(resp, 'no such method');
    }
}
exports.Pg1Router = Pg1Router;
module.exports = {
    Pg1Router
};
