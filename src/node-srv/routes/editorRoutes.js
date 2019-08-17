"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Email_1 = require("mbake/lib/Email");
const Serv_1 = require("mbake/lib/Serv");
const IDB_1 = require("../lib/IDB");
const FileOpsExtra_1 = require("mbake/lib/FileOpsExtra");
const FileOpsBase_1 = require("mbake/lib/FileOpsBase");
const AppLogic_1 = require("../lib/AppLogic");
const fs = require('fs-extra');
class EditorRoutes extends Serv_1.BasePgRouter {
    constructor(IDB) {
        super();
        this.emailJs = new Email_1.Email();
        this.fm = new FileOpsExtra_1.FileMethods();
        this.appLogic = new AppLogic_1.AppLogic();
        this.IDB = IDB;
        this.auth = new IDB_1.EditorAuth(IDB);
    }
    async checkEditor(resp, params) {
        let pswd = Buffer.from(params.editor_pass).toString('base64');
        let auth = await this.auth.auth(params.editor_email, pswd, resp);
        if (auth != 'OK')
            return;
        this.ret(resp, 'OK');
    }
    async emailResetPasswordCode(resp, params, email, pswd) {
        const config = await this.IDB.getConfig();
        let emailjsService_id = config.emailjsService_id;
        let emailjsTemplate_id = config.emailjsTemplate_id;
        let emailjsUser_id = config.emailjsUser_id;
        let code = this.IDB.getVcodeEditor(params.admin_email);
        let msg = 'Enter your code at http://bla.bla ' + code;
        email = Buffer.from(params.admin_email).toString('base64');
        this.emailJs.send(email, emailjsService_id, emailjsTemplate_id, emailjsUser_id, msg);
        this.ret(resp, 'OK');
    }
    async resetPasswordIfMatch(resp, params, email, password) {
        const result = await this.IDB.resetPasswordEditorIfMatch(params.admin_email, params.code, params.password);
        this.ret(resp, result);
    }
    async getDirs(resp, params, user, pswd) {
        user = Buffer.from(user, 'base64').toString();
        let auth = await this.auth.auth(user, pswd, resp);
        if (auth != 'OK')
            return;
        const appPath = await this.IDB.getAppPath();
        const dirs = this.fm.getDirs(appPath);
        this.ret(resp, dirs);
    }
    async getFiles(resp, params, user, pswd) {
        user = Buffer.from(user, 'base64').toString();
        let auth = await this.auth.auth(user, pswd, resp);
        if (auth != 'OK')
            return;
        let itemPath = '/' + params.itemPath;
        const appPath = await this.IDB.getAppPath();
        const files = this.fm.getFiles(appPath, itemPath);
        this.ret(resp, files);
    }
    async getFileContent(resp, params, user, pswd) {
        user = Buffer.from(user, 'base64').toString();
        let auth = await this.auth.auth(user, pswd, resp);
        if (auth != 'OK')
            return;
        let itemPath = '/' + params.file;
        let file = params.itemPath;
        const appPath = await this.IDB.getAppPath();
        let fileName = appPath + itemPath + file;
        const THIZ = this;
        fs.readFile(fileName, 'utf8', (err, data) => {
            if (err) {
                THIZ.retErr(resp, err);
                return;
            }
            THIZ.ret(resp, data);
        });
    }
    async saveFile(resp, params, user, pswd) {
        user = Buffer.from(user, 'base64').toString();
        let auth = await this.auth.auth(user, pswd, resp);
        if (auth != 'OK')
            return;
        let substring = '/';
        let itemPath = '/' + params.file;
        let file = params.itemPath;
        const appPath = await this.IDB.getAppPath();
        let fileName = itemPath + file;
        let content = params.content;
        content = Buffer.from(content, 'base64');
        if (fileName.includes(substring)) {
            let fileName2 = fileName.substr(fileName.lastIndexOf('/'));
            this.appLogic.archive(appPath, itemPath, fileName2);
        }
        else {
            this.appLogic.archive(appPath, itemPath, fileName);
        }
        const fileOps = new FileOpsBase_1.FileOps(appPath);
        fileOps.write(fileName, content);
        this.ret(resp, 'OK');
    }
    async compileCode(resp, params, user, pswd) {
        user = Buffer.from(user, 'base64').toString();
        let auth = await this.auth.auth(user, pswd, resp);
        if (auth != 'OK')
            return;
        let itemPath = '/' + params.file;
        let file = params.itemPath;
        const appPath = await this.IDB.getAppPath();
        let fileName = itemPath + file;
        this.ret(resp, 'OK');
        this.appLogic.autoBake(appPath, itemPath, fileName);
    }
    async cloneItem(resp, params, user, pswd) {
        user = Buffer.from(user, 'base64').toString();
        let auth = await this.auth.auth(user, pswd, resp);
        if (auth != 'OK')
            return;
        let itemPath = '/' + params.itemPath;
        let newItemPath = '/' + params.newItemPath;
        const appPath = await this.IDB.getAppPath();
        await this.appLogic.clone(appPath, itemPath, newItemPath);
        this.ret(resp, 'OK');
    }
    async setPublishDate(resp, params, user, pswd) {
        user = Buffer.from(user, 'base64').toString();
        let auth = await this.auth.auth(user, pswd, resp);
        if (auth != 'OK')
            return;
        let itemPath = '/' + params.itemPath;
        const appPath = await this.IDB.getAppPath();
        let publish_date = params.publish_date;
        this.appLogic.setPublishDate(appPath, itemPath, publish_date);
        this.ret(resp, 'OK');
    }
}
exports.EditorRoutes = EditorRoutes;
module.exports = {
    EditorRoutes
};
