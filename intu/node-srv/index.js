#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ADB_1 = require("./lib/ADB");
const FileOpsExtra_1 = require("mbake/lib/FileOpsExtra");
const IntuSrv_1 = require("./IntuSrv");
const ip = require('ip');
const ipAddres = ip.address();
const hostIP = 'http://' + ipAddres + ':';
console.log("TCL: hostIP", hostIP);
const adbDB = new ADB_1.ADB();
FileOpsExtra_1.VersionNag.isCurrent('intu', adbDB.veri()).then(function (isCurrent_) {
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
const mainEApp = new IntuSrv_1.IntuApp(adbDB);
mainEApp.start();
