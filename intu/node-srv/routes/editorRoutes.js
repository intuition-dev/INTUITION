"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Email_1 = require("../lib/Email");
const Serv_1 = require("mbake/lib/Serv");
const ADB_1 = require("../lib/ADB");
const FileOpsExtra_1 = require("mbake/lib/FileOpsExtra");
const FileOpsBase_1 = require("mbake/lib/FileOpsBase");
const AppLogic_1 = require("../lib/AppLogic");
const fs = require('fs-extra');
class EditorRoutes extends Serv_1.BasePgRouter {
    constructor(adbDB) {
        super();
        this.emailJs = new Email_1.Email();
        this.fm = new FileOpsExtra_1.FileMethods();
        this.appLogic = new AppLogic_1.AppLogic();
        this.adbDB = adbDB;
        this.auth = new ADB_1.EditorAuth(adbDB);
    }
    async checkEditor(resp, params, user, pswd) {
        let auth = await this.auth.auth(user, pswd, resp);
        if (auth != 'OK')
            return;
        this.ret(resp, 'OK');
    }
    emailResetPasswordCode(resp, params, email, pswd) {
        const config = this.adbDB.getConfig();
        let emailjsService_id = config.emailjsService_id;
        let emailjsTemplate_id = config.emailjsTemplate_id;
        let emailjsUser_id = config.emailjsUser_id;
        let code = this.adbDB.getVcodeEditor(email);
        let msg = 'Enter your code at http://bla.bla' + code;
        this.emailJs.send(email, emailjsService_id, emailjsTemplate_id, emailjsUser_id, msg);
        this.ret(resp, 'OK');
    }
    async resetPasswordIfMatch(resp, params, email, password) {
        const result = await this.adbDB.resetPasswordEditorIfMatch(email, params.code, params.password);
        this.ret(resp, result);
    }
    async getDirs(resp, params, user, pswd) {
        let auth = await this.auth.auth(user, pswd, resp);
        if (auth != 'OK')
            return;
        const appPath = await this.adbDB.getAppPath();
        const dirs = this.fm.getDirs(appPath);
        this.ret(resp, dirs);
    }
    async getFiles(resp, params, user, pswd) {
        let auth = await this.auth.auth(user, pswd, resp);
        if (auth != 'OK')
            return;
        let itemPath = '/' + params.itemPath;
        const appPath = await this.adbDB.getAppPath();
        const files = this.fm.getFiles(appPath, itemPath);
        this.ret(resp, files);
    }
    async getFileContent(resp, params, user, pswd) {
        let auth = await this.auth.auth(user, pswd, resp);
        if (auth != 'OK')
            return;
        let itemPath = '/' + params.itemPath;
        let file = '/' + params.file;
        const appPath = await this.adbDB.getAppPath();
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
        let auth = await this.auth.auth(user, pswd, resp);
        if (auth != 'OK')
            return;
        let itemPath = '/' + params.itemPath;
        let file = '/' + params.file;
        const appPath = await this.adbDB.getAppPath();
        let fileName = itemPath + file;
        let content = params.content;
        content = Buffer.from(content, 'base64');
        this.appLogic.archive(appPath, itemPath, fileName);
        const fileOps = new FileOpsBase_1.FileOps(appPath);
        fileOps.write(fileName, content);
        this.ret(resp, 'OK');
    }
    async compileCode(resp, params, user, pswd) {
        let auth = await this.auth.auth(user, pswd, resp);
        if (auth != 'OK')
            return;
        let itemPath = '/' + params.itemPath;
        let file = '/' + params.file;
        const appPath = await this.adbDB.getAppPath();
        let fileName = itemPath + file;
        this.ret(resp, 'OK');
        this.appLogic.autoBake(appPath, itemPath, fileName);
    }
    async cloneItem(resp, params, user, pswd) {
        let auth = await this.auth.auth(user, pswd, resp);
        if (auth != 'OK')
            return;
        let itemPath = '/' + params.itemPath;
        let newItemPath = '/' + params.newItemPath;
        const appPath = await this.adbDB.getAppPath();
        await this.appLogic.clone(appPath, itemPath, newItemPath);
        this.ret(resp, 'OK');
    }
    async setPublishDate(resp, params, user, pswd) {
        let auth = await this.auth.auth(user, pswd, resp);
        if (auth != 'OK')
            return;
        let itemPath = '/' + params.itemPath;
        const appPath = await this.adbDB.getAppPath();
        let publish_date = params.publish_date;
        this.appLogic.setPublishDate(appPath, itemPath, publish_date);
        this.ret(resp, 'OK');
    }
}
exports.EditorRoutes = EditorRoutes;
module.exports = {
    EditorRoutes
};
