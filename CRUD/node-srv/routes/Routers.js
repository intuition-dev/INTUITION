"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CDB_1 = require("../lib/CDB");
const logger = require('tracer').console();
const Serv_1 = require("mbake/lib/Serv");
class CrudPgRouter extends Serv_1.BasePgRouter {
    constructor() {
        super();
        this.cdb = new CDB_1.CDB();
        this.cdb.init();
    }
    async selectAll(resp, params, user, pswd) {
        let data = await this.cdb.selectAll();
        this.ret(resp, data);
    }
    async selectOne(resp, params, user, pswd) {
        let id = params.id;
        let data = await this.cdb.selectGUID(id);
        this.ret(resp, data);
    }
    async insert(resp, params, user, pswd) {
        let guid = params.guid;
        let name = params.name;
        let topics = params.topics;
        let data = await this.cdb.insert(guid, name, topics);
        this.ret(resp, data);
    }
}
exports.CrudPgRouter = CrudPgRouter;
module.exports = {
    CrudPgRouter
};
