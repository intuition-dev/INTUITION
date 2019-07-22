#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ADB_1 = require("./lib/ADB");
const IntuSrv_1 = require("./IntuSrv");
const ip = require('ip');
const ipAddres = ip.address();
const hostIP = 'http://' + ipAddres + ':';
console.log("TCL: hostIP", hostIP);
const adbDB = new ADB_1.ADB();
const mainEApp = new IntuSrv_1.IntuApp(adbDB, ['*']);
mainEApp.start();
