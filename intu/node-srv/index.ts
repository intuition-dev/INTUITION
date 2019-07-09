#!/usr/bin/env node
// All rights reserved by MetaBake.org, licensed under LGPL 3.0

import { ADB, Veri } from './lib/ADB'

import { VersionNag } from 'mbake/lib/FileOpsExtra'
import { IntuApp } from './lib/IntuApp';
import { Setup } from './lib/Setup';

VersionNag.isCurrent('intu', Veri.ver() ).then(function(isCurrent_:boolean){
   try{
   if(!isCurrent_) 
      console.log('There is a newer version of MetaBake\'s intu(Intuition), please update.')
   else
      console.log('You have the current version of MetaBake\'s intu(Intuition)')
   } catch(err) {
      console.log(err)
   }
})// 

const ip = require('ip')
const ipAddres = ip.address()

const hostIP = 'http://' + ipAddres + ':'
console.log("TCL: hostIP", hostIP)

const path = require('path');

// ///////////////////////////////////////////////////////

const adbDB = new ADB()
const dbName = 'ADB.sqlite'
const pathToDb = path.join(__dirname, dbName)

const mainEApp = new IntuApp(adbDB)

try {
   //check if the file of the database exist
   if (adbDB.dbExists(pathToDb)) {
      console.log('run')
      adbDB.getPort(pathToDb)
         .then(function (port) {
            mainEApp.run(port)
         })
   } else {
      console.log('open db and run setup')
      //create db file
      const setup = new Setup(pathToDb)
      setup.setup(pathToDb)
   }
} catch (err) {
   console.warn(err)
}

