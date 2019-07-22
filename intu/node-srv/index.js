#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ADB_1 = require("./lib/ADB");
var IntuSrv_1 = require("./IntuSrv");
var ip = require('ip');
var ipAddres = ip.address();
var hostIP = 'http://' + ipAddres + ':';
console.log("TCL: hostIP", hostIP);
var adbDB = new ADB_1.ADB();
var mainEApp = new IntuSrv_1.IntuApp(adbDB, ['*']);
mainEApp.start();
