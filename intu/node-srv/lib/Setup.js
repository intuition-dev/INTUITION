"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Email_1 = require("./Email");
class Setup {
    constructor(app) {
        this.emailJs = new Email_1.Email();
        this.app = app;
    }
    setup(pathToDb) {
        const port = '9081';
        this.adbDB.connectToDb(pathToDb);
        let host;
        this.app.makeInstance(host);
    }
    route(req, res) {
        const method = req.fields.method;
        let params = JSON.parse(req.fields.params);
        let email = params.email;
        let password = params.password;
        let emailjsService_id = params.emailjsService_id;
        let emailjsTemplate_id = params.emailjsTemplate_id;
        let emailjsUser_id = params.emailjsUser_id;
        let resp = {};
        if ('setup' == method) {
            resp.result = {};
            try {
                console.info('setup called ...');
                this.adbDB.addAdmin(email, password, emailjsService_id, emailjsTemplate_id, emailjsUser_id, '9081');
                console.info('db created  ...');
                let msg = 'Hi, your email and password are registered as login credentials for WebAdmin!';
                this.emailJs.send(email, emailjsService_id, emailjsTemplate_id, emailjsUser_id, msg);
                resp['result'] = 'OK';
                return res.json(resp);
            }
            catch (err) {
                console.warn(err);
            }
        }
        else {
            return res.json(resp);
        }
    }
}
exports.Setup = Setup;
