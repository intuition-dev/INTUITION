#!/usr/bin/env node
// All rights reserved by INTUITION.DEV |  Cekvenich, licensed under LGPL 3.0

import commandLineArgs = require('command-line-args')
import { IDB } from './lib/IDB'
import { DownloadC } from 'mbake/lib/FileOpsExtra';
import { IntuApp } from './IntuApp'
import { BusLogic } from './lib/BusLogic';
import { Util } from './lib/BusLogic';

const bunyan = require('bunyan')
const bformat = require('bunyan-format2')
const formatOut = bformat({ outputMode: 'short' })
const log = bunyan.createLogger({ src: true, stream: formatOut, name: "main start" })

const optionDefinitions = [
    { name: 'intu', defaultOption: true },
    { name: 'help', alias: 'h', type: Boolean },
    { name: 'version', alias: 'v', type: Boolean },
    { name: 'CRUD', alias: 'c', type: Boolean },
    { name: 'CMS', alias: 's', type: Boolean },
]

const yaml = require("js-yaml")
const fs = require("fs-extra")

const argsParsed = commandLineArgs(optionDefinitions)
log.info(argsParsed)

const cwd: string = process.cwd()

function unzipCMS() {
    new DownloadC('CMS', cwd).autoUZ()
    console.info('Extracted an example CMS')
}
function unzipC() {
    new DownloadC('CRUD', cwd).autoUZ()
    console.info('Extracted an example CRUD app')
}

async function runInSrv() {
    const ip = require('ip')
    const ipAddres = ip.address()

    const hostIP = 'http://' + ipAddres + ':'

    log.info("TCL: hostIP", hostIP)

    // the only place there is DB new is here.
    const idb = new IDB(process.cwd(), '/IDB.sqlite')

    //creating/checking intu-config.file
    const path_config = process.cwd() + '/intu-config.yaml'
    let configIntu;
    try {
        if (!fs.existsSync(path_config)) {
            log.info('not exists')
            let conf = {
                port: 9081,
                secret: '123456',
                path: process.cwd() + '/ROOT'
            }
            await fs.writeFileSync(path_config, yaml.safeDump(conf), 'utf8', (err) => {
                if (err) {
                    log.info(err);
                }
            })
            log.info('not exists')
            configIntu = await yaml.safeLoad(fs.readFileSync(path_config, 'utf8'))
        } else {
            log.info('exists')
            configIntu = await yaml.safeLoad(fs.readFileSync(path_config, 'utf8'))
        }
    } catch (err) {
        log.info('cant read the config file', err)
    }
    const port: number = await configIntu.port
    const path: string = await configIntu.path

    // now start node
    const mainEApp = new IntuApp(idb, ['*'], configIntu)

    let intuPath = Util.appPath + '/INTU'
    log.info(intuPath)

    const setupDone = await idb.setupIfNeeded()
    log.info('setup', setupDone)

    log.info("TCL: runISrv -> setupDone", setupDone)
    log.info('normal')
    // api and intu is here
    mainEApp.start(intuPath)

    // app 
    log.info("TCL: runISrv -> path", path)
    mainEApp.serveStatic(path, 60 * 60 * 1 + 1, 60 * 60 * 1)
    mainEApp.listen(port)

}//()


function help() {
    console.info()
    console.info('intu version: ' + BusLogic.veri())
    console.info()
    console.info('Usage:')
    console.info(' To run:                                                intu')
    console.info(' and then open a browser on the specified port. There is small app in ROOT')
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
    runInSrv()


