#!/usr/bin/env node
// All rights reserved by MetaBake.org, licensed under LGPL 3.0

import { ADB } from './lib/ADB'

import { IntuApp } from './IntuSrv'

const ip = require('ip')
const ipAddres = ip.address()

const hostIP = 'http://' + ipAddres + ':'

// ///////////////////////////////////////////////////////

console.log("TCL: hostIP", hostIP)
const adbDB = new ADB()

// the only place there is DB new is here.
const mainEApp = new IntuApp(adbDB, ['*'])
mainEApp.start()
