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
    async selectAll(resp, params, user, pswd) {
        let data = await this.cdb.selectAll();
        this.ret(resp, 'Data here');
    }
    async selectOne(resp, params, user, pswd) {
        let id = params.id;
        let data = await this.cdb.selectAll();
        this.ret(resp, 'Data here');
    }
    async insert(resp, params, user, pswd) {
        let data = await this.cdb.selectAll();
        this.ret(resp, 'Data here');
    }
}
exports.Pg1Router = Pg1Router;
module.exports = {
    Pg1Router
};
