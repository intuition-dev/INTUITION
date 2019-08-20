"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Email_1 = require("mbake/lib/Email");
const Serv_1 = require("mbake/lib/Serv");
const IDB_1 = require("../lib/IDB");
class AdminRoutes extends Serv_1.BasePgRouter {
    constructor(IDB) {
        super();
        this.emailJs = new Email_1.Email();
        this.IDB = IDB;
        this.auth = new IDB_1.AdminAuthX(IDB);
    }
    async checkAdmin(resp, params) {
        let user = Buffer.from(params.admin_email).toString('base64');
        let pswd = Buffer.from(params.admin_pass).toString('base64');
        let auth = await this.auth.auth(user, pswd, resp);
        if (auth != 'OK')
            this.ret(resp, 'FAIL');
        this.ret(resp, 'OK');
    }
    async getConfig(resp, params, user, pswd) {
        let auth = await this.auth.auth(user, pswd, resp);
        if (auth != 'OK')
            return;
        let data = await this.IDB.getConfig();
        this.ret(resp, data);
    }
    async updateConfig(resp, params, user, pswd) {
        let auth = await this.auth.auth(user, pswd, resp);
        if (auth != 'OK')
            return;
        let emailjsService_id = params.emailjsService_id;
        let emailjsTemplate_id = params.emailjsTemplate_id;
        let emailjsUser_id = params.emailjsUser_id;
        let pathToApp = params.path;
        let port = params.port;
        if (port === '') {
            port = 9081;
        }
        let res = await this.IDB.updateConfig(emailjsService_id, emailjsTemplate_id, emailjsUser_id, pathToApp, port);
        if (res === 'OK') {
            let data = [];
            data.push({
                emailjsService_id: emailjsService_id,
                emailjsTemplate_id: emailjsTemplate_id,
                emailjsUser_id: emailjsUser_id,
                path: pathToApp,
                port: port,
            });
            this.ret(resp, data);
        }
    }
    async emailResetPasswordCode(resp, params, email, pswd) {
        const config = await this.IDB.getConfig();
        let emailjsService_id = config.emailjsService_id;
        let emailjsTemplate_id = config.emailjsTemplate_id;
        let emailjsUser_id = config.emailjsUser_id;
        let sendToEmail = Buffer.from(params.admin_email).toString('base64');
        let enterCodeUrl = params.loginUrl;
        let code = this.IDB.getVcodeAdmin();
        let msg = 'Your verification code is: ' + code + '<br>Enter your code at ' + enterCodeUrl + '#code';
        this.emailJs.send(sendToEmail, emailjsService_id, emailjsTemplate_id, emailjsUser_id, msg);
        this.ret(resp, 'OK');
    }
    async resetPasswordIfMatch(resp, params, email, password) {
        let adminEmail = Buffer.from(params.admin_email).toString('base64');
        let newPassword = Buffer.from(params.password).toString('base64');
        const result = await this.IDB.resetPasswordAdminIfMatch(adminEmail, params.code, newPassword);
        this.ret(resp, result);
    }
    async getEditors(resp, params, user, pswd) {
        let auth = await this.auth.auth(user, pswd, resp);
        if (auth != 'OK')
            return;
        let EditorsJson = await this.IDB.getEditors();
        this.ret(resp, EditorsJson);
    }
    async addEditor(resp, params, user, pswd) {
        let auth = await this.auth.auth(user, pswd, resp);
        if (auth != 'OK')
            return;
        let guid = params.id;
        let email = params.email;
        let name = params.name;
        let password = params.password;
        await this.IDB.addEditor(guid, name, email, password);
        this.ret(resp, 'OK');
    }
    async editEditor(resp, params, user, pswd) {
        let auth = await this.auth.auth(user, pswd, resp);
        if (auth != 'OK')
            return;
        let guid = params.uid;
        let name = params.name;
        let data = await this.IDB.editEditor(guid, name);
        this.ret(resp, data);
    }
    async deleteEditor(resp, params, user, pswd) {
        let auth = await this.auth.auth(user, pswd, resp);
        if (auth != 'OK')
            return;
        let guid = params.uid;
        await this.IDB.deleteEditor(guid);
        this.ret(resp, 'OK');
    }
}
exports.AdminRoutes = AdminRoutes;
