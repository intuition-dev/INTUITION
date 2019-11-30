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
        super(1);
        this.emailJs = new Email_1.Email();
        this.fm = new FileOpsExtra_1.FileMethods();
        this.appLogic = new AppLogic_1.AppLogic();
        this.DEBUG = true;
        this.db = IDB;
        this.auth = new IDB_1.EditorAuthX(IDB);
        this.configIntu = configIntu;
    }
    async checkEditor(params) {
        let auth = await this.auth.auth(params.editor_email, params.editor_pass);
        if (auth != 'OK')
            return;
        return 'OK';
    }
    async emailResetPasswordCode(params) {
        const config = await this.db.getConfig();
        let emailjsService_id = config.emailjsService_id;
        let emailjsTemplate_id = config.emailjsTemplate_id;
        let emailjsUser_id = config.emailjsUser_id;
        let code = this.db.makeVcodeEditor(params.admin_email);
        let msg = 'Enter your code at http://bla.bla ' + code;
        let email = Buffer.from(params.admin_email).toString('base64');
        this.emailJs.send(email, emailjsService_id, emailjsTemplate_id, emailjsUser_id, msg);
        return 'OK';
    }
    async resetPasswordIfMatch(params, email, password) {
        const result = await this.db.resetPasswordEditorIfMatch(params.admin_email, params.code, params.password);
        return result;
    }
    async getDirs(params) {
        log.info("TCL: EditorHandler -> getDirs -> user");
        log.info("TCL: EditorHandler -> getDirs -> params", params);
        let auth = await this.auth.auth(params.editor_email, params.editor_pass);
        log.info("TCL: EditorHandler -> getDirs -> auth", auth);
        if (auth != 'OK')
            return;
        const appPath = this.configIntu.path;
        const dirs = this.fm.getDirs(appPath);
        return dirs;
    }
    async getFiles(params) {
        let auth = await this.auth.auth(params.editor_email, params.editor_pass);
        if (auth != 'OK')
            return;
        let itemPath = '/' + params.itemPath;
        const appPath = this.configIntu.path;
        const files = this.fm.getFiles(appPath, itemPath);
        return files;
    }
    async getFileContent(params) {
        let auth = await this.auth.auth(params.editor_email, params.editor_pass);
        if (auth != 'OK')
            return 'No Auth';
        let itemPath = '/' + params.file;
        let file = params.itemPath;
        const appPath = this.configIntu.path;
        let fileName = appPath + itemPath + file;
        log.info(fileName);
        let data = await fs.readFile(fileName, 'utf8');
        log.info(data);
        return data;
    }
    async saveFile(params) {
        let auth = await this.auth.auth(params.editor_email, params.editor_pass);
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
        return 'OK';
    }
    async compileCode(params) {
        let auth = await this.auth.auth(params.editor_email, params.editor_pass);
        if (auth != 'OK')
            return;
        let itemPath = '/' + params.file;
        let file = params.itemPath;
        const appPath = this.configIntu.path;
        let fileName = itemPath + file;
        this.appLogic.autoBake(appPath, itemPath, fileName);
        return 'OK';
    }
    async cloneItem(params) {
        let auth = await this.auth.auth(params.editor_email, params.editor_pass);
        if (auth != 'OK')
            return;
        let itemPath = '/' + params.itemPath;
        let newItemPath = '/' + params.newItemPath;
        const appPath = this.configIntu.path;
        await this.appLogic.clone(appPath, itemPath, newItemPath);
        return 'OK';
    }
    async setPublishDate(params) {
        let auth = await this.auth.auth(params.editor_email, params.editor_pass);
        if (auth != 'OK')
            return;
        let itemPath = '/' + params.itemPath;
        const appPath = this.configIntu.path;
        let publish_date = params.publish_date;
        this.appLogic.setPublishDate(appPath, itemPath, publish_date);
        return 'OK';
    }
}
exports.EditorHandler = EditorHandler;
module.exports = {
    EditorHandler
};
