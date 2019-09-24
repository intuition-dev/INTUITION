"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Email_1 = require("mbake/lib/Email");
const Serv_1 = require("mbake/lib/Serv");
const IDB_1 = require("../lib/IDB");
class AdminHandler extends Serv_1.BaseRPCMethodHandler {
    constructor(IDB) {
        super();
        this.emailJs = new Email_1.Email();
        this.IDB = IDB;
        this.auth = new IDB_1.AdminAuthX(IDB);
    }
    async checkAdmin(resp, params, ent, user, pswd, token) {
        console.log("TCL: AdminHandler -> checkAdmin -> params", params._parsedUrl);
        console.log("TCL: AdminHandler -> checkAdmin -> ent", ent);
        let user1 = Buffer.from(params.admin_email).toString('base64');
        let pswd1 = Buffer.from(params.admin_pass).toString('base64');
        let auth = await this.auth.auth(user1, pswd1, resp);
        if (auth != 'OK')
            this.ret(resp, 'FAIL', null, null);
        this.ret(resp, 'OK', null, null);
    }
    async getConfig(resp, params, ent, user, pswd, token) {
        console.log("TCL: AdminHandler -> getConfig -> params", params);
        console.log("TCL: AdminHandler -> getConfig -> ent", ent);
        let user1 = Buffer.from(params.admin_email).toString('base64');
        let pswd1 = Buffer.from(params.admin_pass).toString('base64');
        let auth = await this.auth.auth(user1, pswd1, resp);
        if (auth != 'OK')
            return;
        let data = await this.IDB.getConfig();
        this.ret(resp, data, null, null);
    }
    async updateConfig(resp, params, ent, user, pswd, token) {
        let user1 = Buffer.from(params.admin_email).toString('base64');
        let pswd1 = Buffer.from(params.admin_pass).toString('base64');
        let auth = await this.auth.auth(user1, pswd1, resp);
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
            this.ret(resp, data, null, null);
        }
    }
    async emailResetPasswordCode(resp, params, ent, email, pswd) {
        const config = await this.IDB.getConfig();
        let emailjsService_id = config.emailjsService_id;
        let emailjsTemplate_id = config.emailjsTemplate_id;
        let emailjsUser_id = config.emailjsUser_id;
        let sendToEmail = Buffer.from(params.admin_email).toString('base64');
        let enterCodeUrl = params.loginUrl;
        let code = this.IDB.getVcodeAdmin();
        let msg = 'Your verification code is: ' + code + '<br>Enter your code at ' + enterCodeUrl + '#code';
        this.emailJs.send(sendToEmail, emailjsService_id, emailjsTemplate_id, emailjsUser_id, msg);
        this.ret(resp, 'OK', null, null);
    }
    async resetPasswordIfMatch(resp, params, ent, email, password) {
        let adminEmail = Buffer.from(params.admin_email).toString('base64');
        let newPassword = Buffer.from(params.password).toString('base64');
        const result = await this.IDB.resetPasswordAdminIfMatch(adminEmail, params.code, newPassword);
        this.ret(resp, result, null, null);
    }
    async getEditors(resp, params, ent, user, pswd, token) {
        console.log("TCL: AdminHandler -> getEditors -> params", params);
        console.log("TCL: AdminHandler -> getEditors -> ent", ent);
        let user1 = Buffer.from(params.admin_email).toString('base64');
        let pswd1 = Buffer.from(params.admin_pass).toString('base64');
        let auth = await this.auth.auth(user1, pswd1, resp);
        if (auth != 'OK')
            return;
        let EditorsJson = await this.IDB.getEditors();
        this.ret(resp, EditorsJson, null, null);
    }
    async addEditor(resp, params, ent, user, pswd, token) {
        let auth = await this.auth.auth(user, pswd, resp);
        if (auth != 'OK')
            return;
        let guid = params.id;
        let email = params.email;
        let name = params.name;
        let password = params.password;
        await this.IDB.addEditor(guid, name, email, password);
        this.ret(resp, 'OK', null, null);
    }
    async editEditor(resp, params, ent, user, pswd, token) {
        let auth = await this.auth.auth(user, pswd, resp);
        if (auth != 'OK')
            return;
        let guid = params.uid;
        let name = params.name;
        let data = await this.IDB.editEditor(guid, name);
        this.ret(resp, data, null, null);
    }
    async deleteEditor(resp, params, ent, user, pswd, token) {
        let auth = await this.auth.auth(user, pswd, resp);
        if (auth != 'OK')
            return;
        let guid = params.uid;
        await this.IDB.deleteEditor(guid);
        this.ret(resp, 'OK', null, null);
    }
}
exports.AdminHandler = AdminHandler;
