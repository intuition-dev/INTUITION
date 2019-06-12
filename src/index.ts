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

import { VersionNag  } from 'mbake/lib/FileOpsExtra'

const dbName = 'ADB.sqlite'
const pathToDb = path.join(__dirname,dbName)

const appPORT = '9081';
const mainApp = ExpressRPC.makeInstance(['http://localhost:'+appPORT]);

import opn = require('open')
const emailJs = new Email();

VersionNag.isCurrent().then(function(isCurrent_:boolean){
   try{
   if(!isCurrent_) 
      console.log('There is a newer version of mbake CLI, please update.')
   else
      console.log('You have the current version of mbake CLI')
   } catch(err) {
      console.log(err)
   }
})// 

try {
   if (adbDB.checkDB(pathToDb)) {//if db exist
      console.log('run admin')
      servingFolders()
      // opn('http://localhost:' + appPORT+'/admin')
   } else {
      console.log('open db')
      fs.open(pathToDb, 'w', runSetup);
   }
} catch (err) {
}


function runSetup() {
   mainApp.use('/setup', ExpressRPC.serveStatic(path.join(__dirname,'setup')));
   servingFolders()
   opn('http://localhost:' + appPORT+'/setup')
}

function servingFolders(){
      /*
      * E D I T O R S
      */
     adbDB.createNewADBwSchema(pathToDb)
     const editorRoutes = new EditorRoutes();
     mainApp.use('/api/editors', editorRoutes.routes(adbDB));
     mainApp.use('/editors', ExpressRPC.serveStatic(path.join(__dirname,'www')));


     // Wa.watch('/Users/liza/work/mbakeCLI/CMS', 9082);

     /*
     * A D M I N
     */

     const adminRoutes = new AdminRoutes();
     mainApp.use('/api/admin', adminRoutes.routes(adbDB));
     mainApp.use('/admin', ExpressRPC.serveStatic(path.join(__dirname, 'wwwAdmin')));
}

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
         adbDB.addAdmin(email, password, emailjsService_id, emailjsTemplate_id, emailjsUser_id);
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

mainApp.listen(appPORT, () => {

   console.log(`======================================================`);
   console.log(`App is running at http://localhost:${appPORT}/editors/`);
   console.log(`======================================================`);
})
