#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Serv_1 = require("mbake/lib/Serv");
const editor_1 = require("./lib/editor");
const admin_1 = require("./lib/admin");
const ADB_1 = require("./lib/ADB");
const Email_1 = require("./lib/Email");
const Wa_1 = require("mbake/lib/Wa");
const FileOpsExtra_1 = require("mbake/lib/FileOpsExtra");
var ip = require('ip');
var ipAddres = ip.address();
const hostIP = 'http://' + ipAddres + ':';
console.log("TCL: hostIP", hostIP);
var path = require('path');
const fs = require('fs-extra');
const yaml = require('js-yaml');
let config = yaml.load(fs.readFileSync(__dirname + '/config.yaml'));
const adbDB = new ADB_1.ADB();
const emailJs = new Email_1.Email();
const dbName = 'ADB.sqlite';
const pathToDb = path.join(__dirname, dbName);
try {
    let _this = this;
    if (adbDB.checkDB(pathToDb)) {
        adbDB.connectToDbOnPort(pathToDb)
            .then(function (port) {
            runAdmin(port);
        });
    }
    else {
        console.log('open db and run setup');
        adbDB.openDB(pathToDb, runSetup);
    }
}
catch (err) {
    console.warn(err);
}
function runSetup() {
    const port = '9081';
    adbDB.connectToDb(pathToDb);
    const host = [hostIP + port, config.cors];
    const mainEApp = new Serv_1.ExpressRPC();
    mainEApp.makeInstance(host);
    mainEApp.appInst.post("/setup", async (req, res) => {
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
                adbDB.addAdmin(email, password, emailjsService_id, emailjsTemplate_id, emailjsUser_id, '9081');
                console.info('db cretated  ...');
                let msg = 'Hi, your email and password are registered as login credentials for WebAdmin!';
                emailJs.send(email, emailjsService_id, emailjsTemplate_id, emailjsUser_id, msg);
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
    });
    mainAppsetup(mainEApp, port);
}
function runAdmin(port) {
    const host = [hostIP + port, config.cors];
    const mainEApp = new Serv_1.ExpressRPC();
    mainEApp.makeInstance(host);
    mainAppsetup(mainEApp, port);
}
function mainAppsetup(mainEApp, port) {
    const editorRoutes = new editor_1.EditorRoutes();
    const adminRoutes = new admin_1.AdminRoutes(mainEApp);
    const host = [hostIP + port, config.cors];
    mainEApp.appInst.use('/api/editors', editorRoutes.routes(adbDB, host));
    mainEApp.appInst.use('/', mainEApp.serveStatic(path.join(__dirname, '/')));
    mainEApp.appInst.listen(port, () => {
        console.log(`======================================================`);
        console.log(`App is running at http://localhost:${port}/editors/`);
        console.log(`======================================================`);
    });
    runMBake();
    mainEApp.appInst.get('/monitor', (req, res) => {
        adbDB.monitor()
            .then(res1 => {
            return res.send('OK');
        }).catch(error => {
            console.info('errow', error);
            res.status(400);
            return res.send = (error);
        });
    });
}
function runMBake() {
    if (typeof adbDB.db !== 'undefined') {
        adbDB
            .getSitePath()
            .then(path => Wa_1.Wa.watch(path[0].pathToSite, 3000));
    }
}
FileOpsExtra_1.VersionNag.isCurrent('intu', ADB_1.Veri.ver()).then(function (isCurrent_) {
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
