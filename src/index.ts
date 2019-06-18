#!/usr/bin/env node
// All rights reserved by MetaBake.org, licensed under LGPL 3.0

import { ExpressRPC } from 'mbake/lib/Serv';
import { EditorRoutes } from './lib/editor';
import { AdminRoutes } from './lib/admin';
import { ADB } from './lib/ADB';
import { Email } from './lib/Email';
var path = require('path');
const fs = require('fs-extra')
const adbDB = new ADB()

import { VersionNag } from 'mbake/lib/FileOpsExtra'

import opn = require('open')
const emailJs = new Email();

const dbName = 'ADB.sqlite'
const pathToDb = path.join(__dirname, dbName)

//mbake versionning check
VersionNag.isCurrent().then(function (isCurrent_: boolean) {
   try {
      if (!isCurrent_)
         console.log('There is a newer version of mbake CLI, please update.')
      else
         console.log('You have the current version of mbake CLI')
   } catch (err) {
      console.log(err)
   }
})// 


//try catch of init setup vs running app
try {
   let _this = this
   //check if the file of database exist
   if (adbDB.checkDB(pathToDb)) {
      console.log('run admin')
      adbDB.connectToDbOnPort(pathToDb)
         .then(function (port) {
            runAdmin(port)
         })
      // adbDB.getPort(runAdmin)
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

   const mainApp = ExpressRPC.makeInstance(['http://localhost:' + port]);
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

   opn('http://localhost:' + port + '/setup')
}

function runAdmin(port) {

   const mainApp = ExpressRPC.makeInstance(['http://localhost:' + port]);
   mainAppsetup(mainApp, port)
}


function mainAppsetup(mainApp, port) {
   const editorRoutes = new EditorRoutes();
   const adminRoutes = new AdminRoutes();

   mainApp.use('/api/editors', editorRoutes.routes(adbDB));
   mainApp.use('/api/admin', adminRoutes.routes(adbDB));

   mainApp.use('/', ExpressRPC.serveStatic(path.join(__dirname, '/')));

   mainApp.listen(port, () => {

      console.log(`======================================================`);
      console.log(`App is running at http://localhost:${port}/editors/`);
      console.log(`======================================================`);
   })
}