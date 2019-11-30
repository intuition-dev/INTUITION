"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Email_1 = require("mbake/lib/Email");
const Serv_1 = require("http-rpc/node-srv/lib/Serv");
const IDB_1 = require("../lib/IDB");
const FileOpsExtra_1 = require("mbake/lib/FileOpsExtra");
const FileOpsBase_1 = require("mbake/lib/FileOpsBase");
const AppLogic_1 = require("../lib/AppLogic");
const bunyan = require('bunyan');
const bformat = require('bunyan-format2');
const formatOut = bformat({ outputMode: 'short' });
const log = bunyan.createLogger({ src: true, stream: formatOut, name: "editor" });
const fs = require('fs-extra');
class EditorHandler extends Serv_1.BaseRPCMethodHandler {
    constructor(IDB, configIntu) {
        super();
        this.emailJs = new Email_1.Email();
        this.fm = new FileOpsExtra_1.FileMethods();
        this.appLogic = new AppLogic_1.AppLogic();
        this.db = IDB;
        this.auth = new IDB_1.EditorAuthX(IDB);
        this.configIntu = configIntu;
    }
    async checkEditor(resp, params, ent, user, pswd) {
        let auth = await this.auth.auth(params.editor_email, params.editor_pass, resp);
        if (auth != 'OK')
            return;
        this.ret(resp, 'OK', null, null);
    }
    async emailResetPasswordCode(resp, params, email, pswd) {
        const config = await this.db.getConfig();
        let emailjsService_id = config.emailjsService_id;
        let emailjsTemplate_id = config.emailjsTemplate_id;
        let emailjsUser_id = config.emailjsUser_id;
        let code = this.db.makeVcodeEditor(params.admin_email);
        let msg = 'Enter your code at http://bla.bla ' + code;
        email = Buffer.from(params.admin_email).toString('base64');
        this.emailJs.send(email, emailjsService_id, emailjsTemplate_id, emailjsUser_id, msg);
        this.ret(resp, 'OK', null, null);
    }
    async resetPasswordIfMatch(resp, params, email, password) {
        const result = await this.db.resetPasswordEditorIfMatch(params.admin_email, params.code, params.password);
        this.ret(resp, result, null, null);
    }
    async getDirs(resp, params, ent, user, pswd) {
        log.info("TCL: EditorHandler -> getDirs -> user", user);
        log.info("TCL: EditorHandler -> getDirs -> params", params);
        let auth = await this.auth.auth(params.editor_email, params.editor_pass, resp);
        log.info("TCL: EditorHandler -> getDirs -> auth", auth);
        if (auth != 'OK')
            return;
        const appPath = this.configIntu.path;
        const dirs = this.fm.getDirs(appPath);
        this.ret(resp, dirs, null, null);
    }
    async getFiles(resp, params, user, pswd) {
        log.info("TCL: EditorHandler -> getFiles -> pswd", pswd);
        log.info("TCL: EditorHandler -> getFiles -> user", user);
        let auth = await this.auth.auth(params.editor_email, params.editor_pass, resp);
        if (auth != 'OK')
            return;
        let itemPath = '/' + params.itemPath;
        const appPath = this.configIntu.path;
        const files = this.fm.getFiles(appPath, itemPath);
        this.ret(resp, files, null, null);
    }
    async getFileContent(resp, params, user, pswd) {
        let auth = await this.auth.auth(params.editor_email, params.editor_pass, resp);
        if (auth != 'OK')
            return;
        let itemPath = '/' + params.file;
        let file = params.itemPath;
        const appPath = this.configIntu.path;
        let fileName = appPath + itemPath + file;
        const THIZ = this;
        fs.readFile(fileName, 'utf8', (err, data) => {
            if (err) {
                THIZ.retErr(resp, err, null, null);
                return;
            }
            THIZ.ret(resp, data, null, null);
        });
    }
    async saveFile(resp, params, user, pswd) {
        user = Buffer.from(user, 'base64').toString();
        let auth = await this.auth.auth(params.editor_email, params.editor_pass, resp);
        if (auth != 'OK')
            return;
        let substring = '/';
        let itemPath = '/' + params.file;
        let file = params.itemPath;
        const appPath = this.configIntu.path;
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
        this.ret(resp, 'OK', null, null);
    }
    async compileCode(resp, params, user, pswd) {
        user = Buffer.from(user, 'base64').toString();
        let auth = await this.auth.auth(params.editor_email, params.editor_pass, resp);
        if (auth != 'OK')
            return;
        let itemPath = '/' + params.file;
        let file = params.itemPath;
        const appPath = this.configIntu.path;
        let fileName = itemPath + file;
        this.ret(resp, 'OK', null, null);
        this.appLogic.autoBake(appPath, itemPath, fileName);
    }
    async cloneItem(resp, params, user, pswd) {
        user = Buffer.from(user, 'base64').toString();
        let auth = await this.auth.auth(params.editor_email, params.editor_pass, resp);
        if (auth != 'OK')
            return;
        let itemPath = '/' + params.itemPath;
        let newItemPath = '/' + params.newItemPath;
        const appPath = this.configIntu.path;
        await this.appLogic.clone(appPath, itemPath, newItemPath);
        this.ret(resp, 'OK', null, null);
    }
    async setPublishDate(resp, params, user, pswd) {
        user = Buffer.from(user, 'base64').toString();
        let auth = await this.auth.auth(params.editor_email, params.editor_pass, resp);
        if (auth != 'OK')
            return;
        let itemPath = '/' + params.itemPath;
        const appPath = this.configIntu.path;
        let publish_date = params.publish_date;
        this.appLogic.setPublishDate(appPath, itemPath, publish_date);
        this.ret(resp, 'OK', null, null);
    }
}
exports.EditorHandler = EditorHandler;
module.exports = {
    EditorHandler
};
