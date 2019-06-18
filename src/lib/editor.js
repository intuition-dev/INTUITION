"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Base_1 = require("mbake/lib/Base");
const FileOpsBase_1 = require("mbake/lib/FileOpsBase");
const FileOpsExtra_1 = require("mbake/lib/FileOpsExtra");
const Serv_1 = require("mbake/lib/Serv");
const Email_1 = require("./Email");
const fs = require('fs-extra');
class EditorRoutes {
    routes(adbDB, port) {
        const emailJs = new Email_1.Email();
        const fs = require('fs');
        const path = require('path');
        let mountPath = '';
        const appE = Serv_1.ExpressRPC.makeInstance(['http://localhost:' + port]);
        appE.use((request, response, next) => {
            if (request.path === '/resetPassword') {
                next();
            }
            const params = JSON.parse(request.fields.params);
            const resp = {};
            let email = params.editor_email;
            let password = params.editor_pass;
            return adbDB.validateEditorEmail(email, password)
                .then(function (result) {
                console.info("--result:", result);
                resp.result = {};
                if (result.pass) {
                    mountPath = result.pathToSite;
                    return next();
                }
                else {
                    resp.errorLevel = -1;
                    resp.result = false;
                    return response.json(resp);
                }
            }).catch(function (error) {
                console.info("--error:", error);
                resp.errorLevel = -1;
                resp.errorMessage = error;
                resp.result = false;
                return response.json(resp);
            });
        });
        appE.post('/checkEditor', (req, res) => {
            const method = req.fields.method;
            let resp = {};
            if ('check-editor' == method) {
                resp.result = {};
                try {
                    resp.result = true;
                    return res.json(resp);
                }
                catch (err) {
                }
            }
            else {
                return res.json(resp);
            }
        });
        appE.post("/posts", (req, res) => {
            const method = req.fields.method;
            let resp = {};
            if ('get' == method) {
                let dirs = new FileOpsBase_1.Dirs(mountPath);
                let dirsToIgnore = ['', '.', '..'];
                resp.result = dirs.getShort()
                    .map(el => el.replace(/^\/+/g, ''))
                    .filter(el => !dirsToIgnore.includes(el));
                res.json(resp);
            }
            else {
                return res.json(resp);
            }
        });
        appE.post("/files", (req, res) => {
            const method = req.fields.method;
            let resp = {};
            let params = JSON.parse(req.fields.params);
            if ('get' == method) {
                let post_id = '/' + params.post_id;
                if (typeof post_id !== 'undefined') {
                    let dirs = new FileOpsBase_1.Dirs(mountPath);
                    resp.result = dirs.getInDir(post_id);
                    res.json(resp);
                }
                else {
                    res.status(400);
                    resp.result = { error: 'no post_id' };
                    res.json(resp);
                }
            }
            else {
                return res.json(resp);
            }
        });
        appE.post("/post-get", (req, res) => {
            const method = req.fields.method;
            let resp = {};
            let params = JSON.parse(req.fields.params);
            if ('get' == method) {
                let post_id = params.post_id;
                let pathPrefix = params.pathPrefix;
                if (typeof post_id !== 'undefined') {
                    let md = mountPath + '/' + pathPrefix + post_id;
                    let original_post_id = post_id.replace(/\.+\d+$/, "");
                    let fileExt = path.extname(original_post_id);
                    if (fs.existsSync(md) && (fileExt === '.md' || fileExt === '.yaml' || fileExt === '.csv' || fileExt === '.pug' || fileExt === '.css')) {
                        fs.readFile(md, 'utf8', function (err, data) {
                            if (err)
                                throw err;
                            resp.result = data;
                            res.json(resp);
                        });
                    }
                    else {
                        throw "Unknown file type!";
                    }
                }
                else {
                    res.status(400);
                    resp.result = { error: 'no post_id' };
                    res.json(resp);
                }
            }
            else {
                return res.json(resp);
            }
        });
        appE.post("/post-put", (req, res) => {
            const method = req.fields.method;
            let resp = {};
            let params = JSON.parse(req.fields.params);
            if ('put' == method) {
                let post_id = params.post_id;
                let pathPrefix = params.pathPrefix;
                let content = params.content;
                content = Buffer.from(content, 'base64');
                if (typeof post_id !== 'undefined') {
                    let md = '/' + pathPrefix + post_id;
                    let fileOps = new FileOpsBase_1.FileOps(mountPath);
                    fileOps.write(md, content);
                    let dirCont = new FileOpsBase_1.Dirs(mountPath);
                    let substring = '/';
                    let checkDat = dirCont.getInDir('/' + pathPrefix).filter(file => file.endsWith('dat.yaml'));
                    if (checkDat.length > 0) {
                        const archivePath = '/' + pathPrefix + '/archive';
                        if (!fs.existsSync(mountPath + archivePath)) {
                            fs.mkdirSync(mountPath + archivePath);
                        }
                        let archiveFileOps = new FileOpsBase_1.FileOps(mountPath + archivePath);
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
                    res.json(resp);
                }
                else {
                    res.status(400);
                    resp.result = { error: 'no post_id' };
                    res.json(resp);
                }
            }
            else {
                return res.json(resp);
            }
        });
        appE.post("/post-build", (req, res) => {
            const method = req.fields.method;
            let resp = {};
            let params = JSON.parse(req.fields.params);
            if ('put' == method) {
                let post_id = params.post_id;
                let pathPrefix = params.pathPrefix;
                if (typeof post_id !== 'undefined') {
                    let runMbake = new Base_1.MBake();
                    let dirCont = new FileOpsBase_1.Dirs(mountPath);
                    let checkCsv = dirCont.getInDir('/' + pathPrefix).filter(file => file.endsWith('.csv'));
                    if (checkCsv.length > 0) {
                        let compileCsv = new FileOpsExtra_1.CSV2Json(mountPath + '/' + pathPrefix);
                        compileCsv.convert();
                    }
                    let checkDat_i = dirCont.getInDir('/' + pathPrefix).filter(file => file.endsWith('dat_i.yaml'));
                    if (checkDat_i.length > 0) {
                        runMbake.itemizeNBake(mountPath + '/' + pathPrefix, 3)
                            .then(function (response) {
                            resp.result = { data: 'OK' };
                            res.json(resp);
                        }, function (error) {
                            resp.result = { data: error };
                            res.json(resp);
                        });
                    }
                    else {
                        runMbake.compsNBake(mountPath, 3).then(function (response) {
                            resp.result = { data: 'OK' };
                            res.json(resp);
                        }, function (error) {
                            resp.result = { data: error };
                            res.json(resp);
                        });
                    }
                }
                else {
                    res.status(400);
                    resp.result = { error: 'no post_id' };
                    res.json(resp);
                }
            }
            else {
                return res.json(resp);
            }
        });
        appE.post("/new-post", (req, res) => {
            const method = req.fields.method;
            let resp = {};
            let params = JSON.parse(req.fields.params);
            if ('post' == method) {
                let post_id = params.post_id;
                let pathPrefix = params.pathPrefix;
                if (typeof post_id !== 'undefined'
                    && typeof pathPrefix !== 'undefined') {
                    let postPath = mountPath + '/' + pathPrefix;
                    let substring = '/';
                    let newPost = '';
                    if (pathPrefix.includes(substring)) {
                        pathPrefix = pathPrefix.substr(0, pathPrefix.indexOf('/'));
                        newPost = mountPath + '/' + pathPrefix + '/' + post_id;
                    }
                    else {
                        newPost = mountPath + '/' + post_id;
                    }
                    let fileOps = new FileOpsBase_1.FileOps('/');
                    fileOps.clone(postPath, newPost);
                    resp.result = { data: 'OK' };
                    res.json(resp);
                }
                else {
                    res.status(400);
                    resp.result = { error: 'error creating a post' };
                    res.json(resp);
                }
            }
            else {
                return res.json(resp);
            }
        });
        appE.post("/upload", (req, res) => {
            const method = req.fields.method;
            let resp = {};
            let params = JSON.parse(req.fields.params);
            if ('post' == method) {
                let uploadPath;
                let pathPrefix = params.pathPrefix;
                if (Object.keys(req.files).length == 0) {
                    res.status(400);
                    resp.result = { error: 'no file was uploaded' };
                    return res.json(resp);
                }
                let sampleFile = req.files.sampleFile;
                uploadPath = mountPath + '/' + pathPrefix + '/' + sampleFile.name;
                fs.rename(sampleFile.path, uploadPath, function (err) {
                    if (err)
                        throw err;
                    resp.result = { data: 'File uploaded!' };
                    res.json(resp);
                });
            }
            else {
                return res.json(resp);
            }
        });
        appE.post("/set-publish-date", (req, res) => {
            const method = req.fields.method;
            let resp = {};
            let params = JSON.parse(req.fields.params);
            if ('put' == method) {
                let post_id = params.post_id;
                let publish_date = params.publish_date;
                if (typeof post_id !== 'undefined') {
                    let datYaml = new FileOpsBase_1.Dat(mountPath + '/' + post_id);
                    datYaml.set('publishDate', publish_date);
                    datYaml.write();
                    let runMbake = new Base_1.MBake();
                    let postsFolder = post_id.substr(0, post_id.indexOf('/'));
                    let pro = runMbake.itemizeNBake(mountPath + '/' + postsFolder, 3);
                    resp.result = { data: 'OK' };
                    res.json(resp);
                }
                else {
                    res.status(400);
                    resp.result = { error: 'no post_id' };
                    res.json(resp);
                }
            }
            else {
                return res.json(resp);
            }
        });
        appE.post("/mbake-version", (req, res) => {
            const method = req.fields.method;
            let resp = {};
            if ('get' == method) {
                resp.result = Base_1.Ver.ver();
                res.json(resp);
            }
            else {
                return res.json(resp);
            }
        });
        appE.post('/resetPassword', (req, res) => {
            const method = req.fields.method;
            let params = JSON.parse(req.fields.params);
            let email = params.admin_email;
            let resp = {};
            if ('code' == method) {
                resp.result = {};
                try {
                    var code = adbDB.sendVcodeEditor(email)
                        .then(function (code) {
                        adbDB.getEmailJsSettings()
                            .then(settings => {
                            let setting = settings[0];
                            emailJs.send(email, setting.emailjsService_id, setting.emailjsTemplate_id, setting.emailjsUser_id, 'your code: ' + code);
                            resp.result = true;
                            return res.json(resp);
                        });
                    });
                }
                catch (err) {
                    return res.json(resp);
                }
            }
            else if ('reset-password' == method) {
                resp.result = {};
                adbDB.resetPasswordEditor(email, params.code, params.password)
                    .then(function (result) {
                    resp.result = result;
                    return res.json(resp);
                });
            }
            else {
                return res.json(resp);
            }
        });
        return appE;
    }
    ;
}
exports.EditorRoutes = EditorRoutes;
module.exports = {
    EditorRoutes
};
