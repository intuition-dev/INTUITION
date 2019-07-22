#!/usr/bin/env node
// All rights reserved by MetaBake.org | Cekvenich, licensed under LGPL 3.0

import commandLineArgs = require('command-line-args')
import { ADB } from './lib/ADB'
import { Download } from 'mbake/lib/FileOpsExtra';

const optionDefinitions = [
    { name: 'intu', defaultOption: true },
    { name: 'help', alias: 'h', type: Boolean },
    { name: 'CRUD', alias: 'c', type: Boolean },
    { name: 'ShopShip', alias: 's', type: Boolean },
]

const argsParsed = commandLineArgs(optionDefinitions)
let arg: string = argsParsed.mbake

const cwd: string = process.cwd()

function unzipSS() {
    new Download('intu4SS', cwd).auto()
    console.info('Extracted a starter Ship and Shop app')
 }
function unzipC() {
    new Download('CRUD', cwd).auto()
    console.info('Extracted a starter CRUD app')
}
function run() {

}
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
if (argsParsed.help)
    help()
else if (argsParsed.ShopShip) 
    unzipSS()
else
    run()


