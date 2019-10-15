#!/usr/bin/env node
// All rights reserved by INTUITION.DEV | Cekvenich, licensed under LGPL 3.0

import commandLineArgs = require('command-line-args')
import { IDB } from './lib/IDB'
import { Download } from 'mbake/lib/FileOpsExtra';
import { IntuApp } from './IntuApp'
import { AppLogic } from './lib/AppLogic';
import { Util } from './lib/AppLogic';

const logger = require('tracer').console()

const optionDefinitions = [
    { name: 'intu', defaultOption: true },
    { name: 'help', alias: 'h', type: Boolean },
    { name: 'version', alias: 'v', type: Boolean },
    { name: 'CRUD', alias: 'c', type: Boolean },
    { name: 'CMS', alias: 's', type: Boolean },
]

const yaml = require("js-yaml")
const fs = require("fs")

const argsParsed = commandLineArgs(optionDefinitions)
console.log(argsParsed)

const cwd: string = process.cwd()

function unzipCMS() {
    new Download('CMS', cwd).autoUZ()
    console.info('Extracted an example CMS')
}
function unzipC() {
    new Download('CRUD', cwd).autoUZ()
    console.info('Extracted an example CRUD app')
}

async function runISrv() {
    const ip = require('ip')
    const ipAddres = ip.address()

    const hostIP = 'http://' + ipAddres + ':'

    console.log("TCL: hostIP", hostIP)

    // the only place there is DB new is here.
    const idb = new IDB(process.cwd(), '/IDB.sqlite')

    //creating/checking intu-config.file
    const path_config = process.cwd() + '/intu-config.yaml'
    let configIntu;
    try {
        if (!fs.existsSync(path_config)) {
            console.log('not exists')
            let conf = {
                port: 9081,
                secret: '123456',
                path: process.cwd()
            }
            await fs.writeFileSync(path_config, yaml.safeDump(conf), 'utf8', (err) => {
                if (err) {
                    console.log(err);
                }
            })
            console.log('not exists')
            configIntu = await yaml.safeLoad(fs.readFileSync(path_config, 'utf8'))
        } else {
            console.log('exists')
            configIntu = await yaml.safeLoad(fs.readFileSync(path_config, 'utf8'))
        }
    } catch (err) {
        console.log('cant read the config file', err)
    }

    const mainEApp = new IntuApp(idb, ['*'], configIntu)

    let intuPath = Util.appPath + '/INTU'
    logger.trace(intuPath)

    const setupDone = await idb.isSetupDone()
    logger.trace(setupDone)

    console.log("TCL: runISrv -> setupDone", setupDone)
    if (setupDone) {
        logger.trace('normal')
        // 1 and 2
        await mainEApp.run(intuPath)

        // #3 app get the port from config
        const port: number = await configIntu.port
        const appPath: string = await configIntu.path
        console.log("TCL: runISrv -> appPath", appPath)
        mainEApp.serveStatic(appPath, null, null)
        mainEApp.listen(port)
    } else {
        logger.trace('run setup')
        // 1 and 2
        await mainEApp.run(intuPath)

        // #3 app
        const port: number = configIntu.port
        mainEApp.serveStatic(Util.appPath + '/ROOT', null, null)
        mainEApp.listen(port)
    }//fi

}//()


function help() {
    console.info()
    console.info('intu version: ' + AppLogic.veri())
    console.info()
    console.info('Usage:')
    console.info(' To run:                                                intu')
    console.info(' and then open a browser on the specified port. There is small app inROOT')
    console.info()

    console.info('  For starter CRUD app:                                  intu -c')
    console.info('  For an example of an e-commerce (shop and ship) app:   intu -s')

}//()

// start: /////////////////////////////////////////////////////////////////////////////////////
if (argsParsed.CRUD)
    unzipC()
else if (argsParsed.help)
    help()
else if (argsParsed.version)
    help()
else if (argsParsed.CMS)
    unzipCMS()
else
    runISrv()


