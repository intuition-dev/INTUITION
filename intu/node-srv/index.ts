#!/usr/bin/env node
// All rights reserved by MetaBake.org, licensed under LGPL 3.0

import { ADB } from './lib/ADB'

import { VersionNag } from 'mbake/lib/FileOpsExtra'
import { IntuApp } from './IntuSrv'

const ip = require('ip')
const ipAddres = ip.address()

const hostIP = 'http://' + ipAddres + ':'

// ///////////////////////////////////////////////////////

console.log("TCL: hostIP", hostIP)
const adbDB = new ADB()

VersionNag.isCurrent('intu', adbDB.veri() ).then(function(isCurrent_:boolean){
   try{
   if(!isCurrent_) 
      console.log('There is a newer version of MetaBake\'s intu(Intuition), please update.')
   else
      console.log('You have the current version of MetaBake\'s intu(Intuition)')
   } catch(err) {
      console.log(err)
   }
})// 


// ///////////////////////////////////////////////////////

const mainEApp = new IntuApp(adbDB)

mainEApp.start()
