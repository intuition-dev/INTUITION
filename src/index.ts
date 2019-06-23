#!/usr/bin/env node
// All rights reserved by MetaBake.org, licensed under LGPL 3.0

import { ExpressRPC } from 'mbake/lib/Serv';
import { EditorRoutes } from './lib/editor';
import { AdminRoutes } from './lib/admin';
import { ADB, Veri } from './lib/ADB';
import { Email } from './lib/Email';
import { Wa } from 'mbake/lib/Wa';
import { VersionNag } from 'mbake/lib/FileOpsExtra'

var ip = require('ip')
var ipAddres = ip.address()

const hostIP = 'http://' + ipAddres + ':'
console.log("TCL: hostIP", hostIP)

var path = require('path');
const fs = require('fs-extra')
const yaml = require('js-yaml');
let config = yaml.load(fs.readFileSync(__dirname + '/config.yaml'));
// //////////////

const adbDB = new ADB()

import opn = require('open')
const emailJs = new Email();

const dbName = 'ADB.sqlite'
const pathToDb = path.join(__dirname, dbName)

//try catch of init setup vs running app
try {
   let _this = this
   //check if the file of database exist
   if (adbDB.checkDB(pathToDb)) {
      adbDB.connectToDbOnPort(pathToDb)
         .then(function (port) {
            runAdmin(port)
         })
   } else {
      console.log('open db and run setup')
      //create db file
      adbDB.openDB(pathToDb, runSetup)
   }
} catch (err) {
}

function runSetup() {
   const port = '9081' //init port
   adbDB.connectToDb(pathToDb) //connect to db
   const host = [hostIP + port, config.cors]

   const mainApp = ExpressRPC.makeInstance(host);
   mainApp.post("/setup", async (req, res) => {
      const method = req.fields.method;
      let params = JSON.parse(req.fields.params)

      let email = params.email
      let password = params.password
      let emailjsService_id = params.emailjsService_id
      let emailjsTemplate_id = params.emailjsTemplate_id
      let emailjsUser_id = params.emailjsUser_id

      let resp: any = {}; // new response that will be set via the specific method passed
      if ('setup' == method) {
         resp.result = {}
         // res.send(resp)
         try {
            console.info('setup called ...');
            adbDB.addAdmin(email, password, emailjsService_id, emailjsTemplate_id, emailjsUser_id, '9081');
            console.info('db cretated  ...');
            let msg = 'Hi, your email and password are registered as login credentials for WebAdmin!';
            emailJs.send(email, emailjsService_id, emailjsTemplate_id, emailjsUser_id, msg);
            resp['result'] = 'OK'
            return res.json(resp)

         } catch (err) {
            // next(err);
         }
      } else {
         return res.json(resp);
      }
   })

   mainAppsetup(mainApp, port)
}

function runAdmin(port) {
   const host = [hostIP + port, config.cors]
   const mainApp = ExpressRPC.makeInstance(host);
   mainAppsetup(mainApp, port)
}

function mainAppsetup(mainApp, port) {
   const editorRoutes = new EditorRoutes();
   const adminRoutes = new AdminRoutes();
   const host = [hostIP + port, config.cors]

   mainApp.use('/api/editors', editorRoutes.routes(adbDB, host));
   mainApp.use('/api/admin', adminRoutes.routes(adbDB, host, port));

   mainApp.use('/', ExpressRPC.serveStatic(path.join(__dirname, '/')));

   //shipping stuff
   mainApp.use('/api/shipping/:name', function (req, res, next) {
      var shipping = require('./lib/shipping');
      var name = req.params.name;
      console.log("TCL: mainAppsetup -> name", name)
      shipping.init(mainApp, name, adbDB);
      next()
   });


   mainApp.listen(port, () => {
      console.log(`======================================================`);
      console.log(`App is running at http://localhost:${port}/editors/`);
      console.log(`======================================================`);
   })

   runMBake()
}

function runMBake() {
   if (typeof adbDB.db !== 'undefined') {
      // run site with mbake
      adbDB
         .getSitePath()
         .then(path => Wa.watch(path[0].pathToSite, 3000));
   }
}

VersionNag.isCurrent('intu', Veri.ver() ).then(function(isCurrent_:boolean){
   try{
   if(!isCurrent_) 
      console.log('There is a newer version of mbake CLI, please update.')
   else
      console.log('You have the current version of mbake CLI')
   } catch(err) {
      console.log(err)
   }
})// 
