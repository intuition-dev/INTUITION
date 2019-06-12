#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Serv_1 = require("mbake/lib/Serv");
const editor_1 = require("./lib/editor");
const admin_1 = require("./lib/admin");
const ADB_1 = require("./lib/ADB");
const Email_1 = require("./lib/Email");
var path = require('path');
const fs = require('fs-extra');
const adbDB = new ADB_1.ADB();
const FileOpsExtra_1 = require("mbake/lib/FileOpsExtra");
const dbName = 'ADB.sqlite';
const pathToDb = path.join(__dirname, dbName);
const appPORT = '9081';
const mainApp = Serv_1.ExpressRPC.makeInstance(['http://localhost:' + appPORT]);
const opn = require("open");
const emailJs = new Email_1.Email();
FileOpsExtra_1.VersionNag.isCurrent().then(function (isCurrent_) {
    try {
        if (!isCurrent_)
            console.log('There is a newer version of mbake CLI, please update.');
        else
            console.log('You have the current version of mbake CLI');
    }
    catch (err) {
        console.log(err);
    }
});
try {
    if (adbDB.checkDB(pathToDb)) {
        console.log('run admin');
        servingFolders();
    }
    else {
        console.log('open db');
        fs.open(pathToDb, 'w', runSetup);
    }
}
catch (err) {
}
function runSetup() {
    mainApp.use('/setup', Serv_1.ExpressRPC.serveStatic(path.join(__dirname, 'setup')));
    servingFolders();
    opn('http://localhost:' + appPORT + '/setup');
}
function servingFolders() {
    adbDB.createNewADBwSchema(pathToDb);
    const editorRoutes = new editor_1.EditorRoutes();
    mainApp.use('/api/editors', editorRoutes.routes(adbDB));
    mainApp.use('/editors', Serv_1.ExpressRPC.serveStatic(path.join(__dirname, 'www')));
    const adminRoutes = new admin_1.AdminRoutes();
    mainApp.use('/api/admin', adminRoutes.routes(adbDB));
    mainApp.use('/admin', Serv_1.ExpressRPC.serveStatic(path.join(__dirname, 'wwwAdmin')));
}
mainApp.post("/setup", async (req, res) => {
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
            adbDB.addAdmin(email, password, emailjsService_id, emailjsTemplate_id, emailjsUser_id);
            console.info('db cretated  ...');
            let msg = 'Hi, your email and password are registered as login credentials for WebAdmin!';
            emailJs.send(email, emailjsService_id, emailjsTemplate_id, emailjsUser_id, msg);
            resp['result'] = 'OK';
            return res.json(resp);
        }
        catch (err) {
        }
    }
    else {
        return res.json(resp);
    }
});
mainApp.listen(appPORT, () => {
    console.log(`======================================================`);
    console.log(`App is running at http://localhost:${appPORT}/editors/`);
    console.log(`======================================================`);
});
