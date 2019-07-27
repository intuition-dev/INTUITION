#!/usr/bin/env node
// All rights reserved by MetaBake.org | Cekvenich, licensed under LGPL 3.0

import commandLineArgs = require('command-line-args')
import { ADB } from './lib/ADB'
import { Download } from 'mbake/lib/FileOpsExtra';
import { IntuApp } from './IntuSrv'

const optionDefinitions = [
    { name: 'intu', defaultOption: true },
    { name: 'help', alias: 'h', type: Boolean },
    { name: 'CRUD', alias: 'c', type: Boolean },
    { name: 'ShopShip', alias: 's', type: Boolean },
]

const argsParsed = commandLineArgs(optionDefinitions)
console.log(argsParsed)

const cwd: string = process.cwd()

function unzipSS() {
    new Download('intu4SS', cwd).autoUZ()
    console.info('Extracted a starter Ship and Shop app')
 }
function unzipC() {
    new Download('CRUD', cwd).autoUZ()
    console.info('Extracted a starter CRUD app')
}
function runISrv() {
    const ip = require('ip')
    const ipAddres = ip.address()

    const hostIP = 'http://' + ipAddres + ':'

    console.log("TCL: hostIP", hostIP)
    const adbDB = new ADB()

    // the only place there is DB new is here.
    const mainEApp = new IntuApp(adbDB, '../WWW', ['*'])
    mainEApp.start()
}//()

function help() {
    console.info()
    console.info('intu version: ' + ADB.veri())
    console.info()
    console.info('Usage:')
    console.info('  To run:                                                intu')
    console.info('  For starter CRUD app:                                  intu -c')
    console.info('  For an example of an e-commerce (shop and ship) app:   intu -s')
 
}

 // start: /////////////////////////////////////////////////////////////////////////////////////
if (argsParsed.CRUD)
    unzipC()
else if (argsParsed.help)
    help()
else if (argsParsed.ShopShip) 
    unzipSS()
else
    runISrv()


