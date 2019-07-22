#!/usr/bin/env node
// All rights reserved by MetaBake.org | Cekvenich, licensed under LGPL 3.0

import commandLineArgs = require('command-line-args')
import AdmZip = require('adm-zip')
import { ADB } from './lib/ADB'

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
    let src: string = __dirname + '/PGap.zip'
    let zip = new AdmZip(src)
    zip.extractAllTo(cwd, /*overwrite*/true)
    console.info('Extracting a starter Phonegap app to ./PG')
 }
function unzipC() {
    let src: string = __dirname + '/PGap.zip'
    let zip = new AdmZip(src)
    zip.extractAllTo(cwd, /*overwrite*/true)
    console.info('Extracting a starter Phonegap app to ./PG')
}
function run() {

}
function help() {
    console.info()
    console.info('intu version: ' + ADB.veri())
    console.info()
    console.info('Usage:')
    console.info('  To process any_dir Pug to html recursively:                 mbake .')
 
}

 // start: /////////////////////////////////////////////////////////////////////////////////////
if (argsParsed.CRUD)
    unzipC()
else if (argsParsed.ShopShip) 
    unzipSS()
else
    run()


