"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Base_1 = require("mbake/lib/Base");
const Email_1 = require("../lib/Email");
const Serv_1 = require("mbake/lib/Serv");
const EditorAuth_1 = require("../lib/EditorAuth");
const FileOpsExtra_1 = require("mbake/lib/FileOpsExtra");
const FileOpsBase_1 = require("mbake/lib/FileOpsBase");
const fs = require('fs-extra');
const path = require('path');
class EditorRoutes extends Serv_1.BasePgRouter {
    constructor(adbDB) {
        super();
        this.emailJs = new Email_1.Email();
        this.adbDB = adbDB;
        this.iauth = new EditorAuth_1.EditorAuth(adbDB);
        this.fileMethod = new FileOpsExtra_1.FileMethods();
    }
    resetPasswordCode(resp, params, user, pswd) {
        let email = params.admin_email;
        resp.result = {};
        try {
            return this.adbDB.setVcodeEditor(email)
                .then(code => {
                this.adbDB.getEmailJsSettings()
                    .then(settings => {
                    let setting = settings[0];
                    this.emailJs.send(email, setting.emailjsService_id, setting.emailjsTemplate_id, setting.emailjsUser_id, 'your code: ' + code);
                    resp.result = true;
                    return resp.json(resp);
                });
            });
        }
        catch (err) {
            this.retErr(resp, err);
        }
    }
    resetPassword(resp, params, user, pswd) {
        resp.result = {};
        let email = params.admin_email;
        return this.adbDB.resetPasswordEditor(email, params.code, params.password)
            .then(result => {
            resp.result = result;
            return resp.json(resp);
        });
    }
    checkEditor(resp, params, user, pswd) {
        return this.iauth.auth(user, pswd, resp).then(auth => {
            if (auth === 'admin' || auth === 'editor') {
                resp.result = true;
                return resp.json(resp);
            }
            else
                this.retErr(resp, 'no post id');
        });
    }
    getItems(resp, params, user, pswd) {
        return this.iauth.auth(user, pswd, resp).then(auth => {
            if (auth === 'admin' || auth === 'editor') {
                resp.result = this.fileMethod.getDirs(this.mountPath);
                resp.json(resp);
            }
            else
                this.retErr(resp, '');
        });
    }
    getFiles(resp, params, user, pswd) {
        return this.iauth.auth(user, pswd, resp).then(auth => {
            if (auth === 'admin' || auth === 'editor') {
                let post_id = '/' + params.post_id;
                if (typeof post_id !== 'undefined') {
                    resp.result = this.fileMethod.getFiles(this.mountPath, post_id);
                    resp.json(resp);
                }
                else
                    this.retErr(resp, 'no post id');
            }
            else
                this.retErr(resp, '');
        });
    }
    getFileContent(resp, params, user, pswd) {
        return this.iauth.auth(user, pswd, resp).then(auth => {
            if (auth === 'admin' || auth === 'editor') {
                let post_id = params.post_id;
                let pathPrefix = params.pathPrefix;
                if (typeof post_id !== 'undefined') {
                    let md = this.mountPath + '/' + pathPrefix + post_id;
                    let original_post_id = post_id.replace(/\.+\d+$/, "");
                    let fileExt = path.extname(original_post_id);
                    if (fs.existsSync(md) && (fileExt === '.md' || fileExt === '.yaml' || fileExt === '.csv' || fileExt === '.pug' || fileExt === '.css')) {
                        fs.readFile(md, 'utf8', (err, data) => {
                            if (err)
                                throw err;
                            resp.result = data;
                            resp.json(resp);
                        });
                    }
                    else {
                        throw "Unknown file type!";
                    }
                }
                else
                    this.retErr(resp, 'no post id');
            }
            else
                this.retErr(resp, '');
        });
    }
    saveFile(resp, params, user, pswd) {
        return this.iauth.auth(user, pswd, resp).then(auth => {
            if (auth === 'admin' || auth === 'editor') {
                let post_id = params.post_id;
                let pathPrefix = params.pathPrefix;
                let content = params.content;
                content = Buffer.from(content, 'base64');
                if (typeof post_id !== 'undefined') {
                    let md = '/' + pathPrefix + post_id;
                    let fileOps = new FileOpsBase_1.FileOps(this.mountPath);
                    fileOps.write(md, content);
                    let dirCont = new FileOpsBase_1.Dirs(this.mountPath);
                    let substring = '/';
                    let checkDat = dirCont.getInDir('/' + pathPrefix).filter(file => file.endsWith('dat.yaml'));
                    if (checkDat.length > 0) {
                        const archivePath = '/' + pathPrefix + '/archive';
                        if (!fs.existsSync(this.mountPath + archivePath)) {
                            fs.mkdirSync(this.mountPath + archivePath);
                        }
                        let archiveFileOps = new FileOpsBase_1.FileOps(this.mountPath + archivePath);
                        let extension = path.extname(post_id);
                        let fileName = path.basename(post_id, extension);
                        let count = archiveFileOps.count(path.basename(post_id));
                        let archiveFileName = '/' + fileName + extension + '.' + count;
                        archiveFileOps.write(archiveFileName, content);
                    }
                    if (pathPrefix.includes(substring)) {
                        pathPrefix = pathPrefix.substr(0, pathPrefix.indexOf('/'));
                    }
                    resp.result = { data: 'OK' };
                    resp.json(resp);
                }
                else
                    this.retErr(resp, 'no post id');
            }
            else
                this.retErr(resp, '');
        });
    }
    compileCode(resp, params, user, pswd) {
        return this.iauth.auth(user, pswd, resp).then(auth => {
            if (auth === 'admin' || auth === 'editor') {
                let post_id = params.post_id;
                let pathPrefix = params.pathPrefix;
                if (typeof post_id !== 'undefined') {
                    let runMbake = new Base_1.MBake();
                    let dirCont = new FileOpsBase_1.Dirs(this.mountPath);
                    let checkDat_i = dirCont.getInDir('/' + pathPrefix).filter(file => file.endsWith('dat_i.yaml'));
                    if (checkDat_i.length > 0) {
                        runMbake.itemizeNBake(this.mountPath + '/' + pathPrefix, 3)
                            .then(response => {
                            resp.result = { data: 'OK' };
                            resp.json(resp);
                        }, error => {
                            resp.result = { data: error };
                            resp.json(resp);
                        });
                    }
                    else {
                        runMbake.compsNBake(this.mountPath, 3).then(response => {
                            resp.result = { data: 'OK' };
                            resp.json(resp);
                        }, error => {
                            resp.result = { data: error };
                            resp.json(resp);
                        });
                    }
                }
                else
                    this.retErr(resp, 'no post id');
            }
            else
                this.retErr(resp, '');
        });
    }
    clonePage(resp, params, user, pswd) {
        return this.iauth.auth(user, pswd, resp).then(auth => {
            if (auth === 'admin' || auth === 'editor') {
                let post_id = params.post_id;
                let pathPrefix = params.pathPrefix;
                if (typeof post_id !== 'undefined'
                    && typeof pathPrefix !== 'undefined') {
                    let postPath = this.mountPath + '/' + pathPrefix;
                    let substring = '/';
                    let newPost = '';
                    if (pathPrefix.includes(substring)) {
                        pathPrefix = pathPrefix.substr(0, pathPrefix.indexOf('/'));
                        newPost = this.mountPath + '/' + pathPrefix + '/' + post_id;
                    }
                    else {
                        newPost = this.mountPath + '/' + post_id;
                    }
                    let fileOps = new FileOpsBase_1.FileOps('/');
                    fileOps.clone(postPath, newPost);
                    resp.result = { data: 'OK' };
                    resp.json(resp);
                }
                else
                    this.retErr(resp, 'error creating a post');
            }
            else
                this.retErr(resp, '');
        });
    }
    setPublishDate(resp, params, user, pswd) {
        return this.iauth.auth(user, pswd, resp).then(auth => {
            if (auth === 'admin' || auth === 'editor') {
                let post_id = params.post_id;
                let publish_date = params.publish_date;
                if (typeof post_id !== 'undefined') {
                    let datYaml = new FileOpsBase_1.Dat(this.mountPath + '/' + post_id);
                    datYaml.set('publishDate', publish_date);
                    datYaml.write();
                    let runMbake = new Base_1.MBake();
                    let postsFolder = post_id.substr(0, post_id.indexOf('/'));
                    let pro = runMbake.itemizeNBake(this.mountPath + '/' + postsFolder, 3);
                    resp.result = { data: 'OK' };
                    resp.json(resp);
                }
                else
                    this.retErr(resp, 'no post id');
            }
            else
                this.retErr(resp, '');
        });
    }
    mbakeVersion(resp, params, user, pswd) {
        let result = this.adbDB.veri();
        this.ret(resp, result);
    }
}
exports.EditorRoutes = EditorRoutes;
module.exports = {
    EditorRoutes
};
