"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Serv_1 = require("mbake/lib/Serv");
const Email_1 = require("../lib/Email");
class SetupRoutes extends Serv_1.BasePgRouter {
    constructor(db) {
        super();
        this.emailJs = new Email_1.Email();
        this.adbDB = db;
    }
    setup(resp, params, email, password) {
        let emailjsService_id = params.emailjsService_id;
        let emailjsTemplate_id = params.emailjsTemplate_id;
        let emailjsUser_id = params.emailjsUser_id;
        try {
            console.info('setup called ...');
            this.adbDB.setAdmin(email, password, emailjsService_id, emailjsTemplate_id, emailjsUser_id, 9081);
            console.info('db created  ...');
            let msg = 'Hi, your email and password are registered as login credentials for WebAdmin!';
            this.emailJs.send(email, emailjsService_id, emailjsTemplate_id, emailjsUser_id, msg);
            this.ret(resp, 'OK');
        }
        catch (err) {
            console.warn(err);
            this.retErr(resp, err);
        }
    }
}
exports.SetupRoutes = SetupRoutes;
