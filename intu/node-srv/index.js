#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ADB_1 = require("./lib/ADB");
const FileOpsExtra_1 = require("mbake/lib/FileOpsExtra");
const IntuApp_1 = require("./lib/IntuApp");
const Setup_1 = require("./lib/Setup");
FileOpsExtra_1.VersionNag.isCurrent('intu', ADB_1.Veri.ver()).then(function (isCurrent_) {
    try {
        if (!isCurrent_)
            console.log('There is a newer version of MetaBake\'s intu(Intuition), please update.');
        else
            console.log('You have the current version of MetaBake\'s intu(Intuition)');
    }
    catch (err) {
        console.log(err);
    }
});
const ip = require('ip');
const ipAddres = ip.address();
const hostIP = 'http://' + ipAddres + ':';
console.log("TCL: hostIP", hostIP);
const path = require('path');
const fs = require('fs-extra');
const yaml = require('js-yaml');
const adbDB = new ADB_1.ADB();
const dbName = 'ADB.sqlite';
const pathToDb = path.join(__dirname, dbName);
const mainEApp = new IntuApp_1.IntuApp(adbDB);
try {
    if (adbDB.dbExists(pathToDb)) {
        adbDB.getPort(pathToDb)
            .then(function (port) {
            mainEApp.run(port);
        });
    }
    else {
        console.log('open db and run setup');
        const setup = new Setup_1.Setup(pathToDb);
        setup.setup(pathToDb);
    }
}
catch (err) {
    console.warn(err);
}
mainEApp.appInst.get('/monitor', (req, res) => {
    adbDB.monitor()
        .then(res1 => {
        return res.send('OK');
    }).catch(error => {
        console.info('monitor error: ', error);
        res.status(400);
        return res.send = (error);
    });
});
