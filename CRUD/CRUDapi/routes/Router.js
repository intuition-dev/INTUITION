"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CDB_1 = require("../lib/CDB");
class Pg1Router {
    constructor() {
        this.cdb = new CDB_1.CDB();
        this.cdb.init();
    }
    async route(req, resp) {
        try {
            const user = req.fields.user;
            const pswd = req.fields.pswd;
            const method = req.fields.method;
            const params = JSON.parse(req.fields.params);
            this[method](resp, params, user, pswd);
        }
        catch (err) {
            this.retErr(resp, err);
        }
    }
    async selectAll(resp, params, user, pswd) {
        this.ret(resp, 'OK');
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
    ret(resp, result) {
        const ret = {};
        ret.result = result;
        resp.json(ret);
    }
    retErr(resp, msg) {
        const ret = {};
        ret.errorLevel = -1;
        ret.errorMessage = msg;
        resp.json(resp);
    }
}
exports.Pg1Router = Pg1Router;
module.exports = {
    Pg1Router
};
