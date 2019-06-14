import { ExpressRPC } from 'mbake/lib/Serv';
import { Download } from 'mbake/lib/FileOpsExtra';
import { Email } from './Email';

import { MBake, Ver } from 'mbake/lib/Base';
import { Dat, FileOps, Dirs } from 'mbake/lib/FileOpsBase'

const fs = require('fs-extra')

var path = require('path');
var config = JSON.parse(fs.readFileSync('./config.json'))
var appPort = config.port


let runMbake = new MBake();
let dirCont = new Dirs(__dirname);

export class AdminRoutes {
   routes(adbDB) {
      const emailJs = new Email();
      const bodyParser = require("body-parser");

      const adminApp = ExpressRPC.makeInstance(['http://localhost:' + appPort]);
      adminApp.use(bodyParser.json());

      adminApp.use((request, response, next) => {
         if (request.path === '/resetPassword') {
            next();
         }

         const params = JSON.parse(request.fields.params)
         const resp: any = {}

         let email = params.admin_email
         let password = params.admin_pass

         return adbDB.validateEmail(email, password)
            .then(function (pass) {
               resp.result = {}
               if (pass) {
                  response.locals.email = email
                  return next()
               } else {
                  resp.errorLevel = -1
                  resp.result = false
                  return response.json(resp)
               }
            }).catch(function (error) {
               resp.errorLevel = -1
               resp.errorMessage = error
               resp.result = false
               return response.json(resp)
            });
      });

      adminApp.post('/checkAdmin', (req, res) => {
         const method = req.fields.method;
         let params = JSON.parse(req.fields.params)
         let email = params.admin_email
         let password = params.admin_pass

         let resp: any = {};

         if ('check-admin' == method) {
            resp.result = {}
            try {
               // var pass = adbDB.validateEmail(email, password)
               resp.result = true
               return res.json(resp)

            } catch (err) {
               // next(err);
            }
         } else {
            return res.json(resp);
         }
      });

      adminApp.post('/setup-app', async (req, res) => {
         const method = req.fields.method;
         let params = JSON.parse(req.fields.params)
         let item = params.item

         let resp: any = {};

         console.log('-------res.locals', res.locals.email)
         if ('setup-app' == method) {
            resp.result = {}
            try {
               var setupItem = ''
               switch (item) {
                  case 'blog':
                     setupItem = 'CMS'
                     await new Download('CMS', path.join(__dirname, '../')).autoZ()
                     break;
                  case 'shop':
                     setupItem = 'e-com'
                     await new Download('SHOP', path.join(__dirname, '../')).autoZ()
                     break;
                  case 'website':
                     setupItem = 'website'
                     await new Download('website', path.join(__dirname, '../')).autoZ()
                     break;
               }

               let adminId = await adbDB.getAdminId(res.locals.email)
               await adbDB.setupApp(path.join(__dirname, '../' + setupItem), adminId[0].id)
                  .then(function (result) {
                     console.log("TCL: AdminRoutes -> routes -> result", result)
                     resp.result = true;
                     return res.json(resp);
                  })
            } catch (err) {
               // next(err);
            }
         } else {
            return res.json(resp);
         }
      })

      adminApp.post('/get-config', (req, res) => {
         const method = req.fields.method;
         let params = JSON.parse(req.fields.params)

         var config = JSON.parse(fs.readFileSync('./config.json'))
         console.log("TCL: AdminRoutes -> routes -> config", config)

         let item = params.item

         let resp: any = {};
         if ('get-config' == method) {
            resp.result = {}
            try {
               var setupItem = ''

               adbDB.getAdminId(res.locals.email)
                  .then(function (adminId) {
                     adbDB.getConfigs(adminId[0].id)
                        .then(function (result) {
                           let temp = {}
                           temp['port'] = config.port
                           temp['pathToSite'] = result.pathToSite
                           resp.result = temp;
                           return res.json(resp);
                        })

                  })
            } catch (err) {
               // next(err);
            }
         } else {
            return res.json(resp);
         }
      })

      adminApp.post('/save-config', (req, res) => {
         const method = req.fields.method;
         let params = JSON.parse(req.fields.params)

         var config = JSON.parse(fs.readFileSync('./config.json'))

         let path = params.path
         let port = params.port

         let resp: any = {};

         if ('save-config' == method) {
            resp.result = {}
            try {

               let temp_port = JSON.stringify({
                  port: port
               })
               console.log("TCL: AdminRoutes -> routes -> temp_port", temp_port)

               fs.writeFile('./config.json', temp_port, 'utf8');
               fs.writeFile('./GLO.yaml', "PORT: " + port, 'utf8');

               adbDB.getAdminId(res.locals.email)
                  .then(function (adminId) {
                     adbDB.setupApp(path, adminId[0].id)
                        .then(function (result) {
                           let temp = {}
                           temp['port'] = config.port
                           temp['pathToSite'] = result.pathToSite
                           resp.result = temp;

                           runMbake.bake(path.join(__dirname, '/admin'), 3)
                              .then(function (response) {
                                 resp.result = { data: 'OK' };
                                 // res.json(resp);

                                 res.json(resp);
                                 process.exit();
                              }, function (error) {
                                 resp.result = { data: error };
                                 res.json(resp);
                              })
                        })

                  })
            } catch (err) {
               // next(err);
            }
         } else {
            return res.json(resp);
         }
      })

      process.on('exit', function () {
         adbDB.close();
      })

      adminApp.post('/resetPassword', (req, res) => {
         const method = req.fields.method;
         let params = JSON.parse(req.fields.params)
         let email = params.admin_email
         let resp: any = {};

         if ('code' == method) {
            resp.result = {}
            // res.send(resp)

            try {
               var code = adbDB.sendVcode(email)
                  .then(function (code) {
                     adbDB.getEmailJsSettings()
                        .then(settings => {
                           let setting = settings[0];
                           emailJs.send(
                              email,
                              setting.emailjsService_id,
                              setting.emailjsTemplate_id,
                              setting.emailjsUser_id,
                              'your code: ' + code
                           )
                           resp.result = true;
                           return res.json(resp);
                        });
                  })
            } catch (err) {
               // next(err);
            }

         } else if ('reset-password' == method) {
            resp.result = {}

            adbDB.resetPassword(email, params.code, params.password)
               .then(function (result) {
                  resp.result = result;
                  return res.json(resp);
               })
         } else {
            return res.json(resp);
         }
      })

      // get users
      adminApp.post("/editors", (req, res) => {
         const method = req.fields.method;
         let resp: any = {}; // new response that will be set via the specific method passed

         if ('get' == method) {

            adbDB.getEditors()
               .then(function (editors) {
                  console.info("--editors:", editors)
                  let data = []
                  editors.map(function (editor) {
                     data.push({
                        id: editor.id,
                        email: editor.email,
                        name: editor.name
                     });
                  })
                  resp.result = data;
                  return res.json(resp);
               })
         } else {

            return res.json(resp);

         }

      });

      // add user
      adminApp.post("/editors-add", (req, res) => {
         const method = req.fields.method;
         let resp: any = {}; // new response that will be set via the specific method passed
         let params = JSON.parse(req.fields.params);

         if ('post' == method) {

            let email = params.email;
            let name = params.name;
            let password = params.password;
            if (typeof email !== 'undefined' &&
               typeof name !== 'undefined' &&
               typeof password !== 'undefined'
            ) {

               adbDB.addEditor(email, name, password)
                  .then(function (editorId) {
                     let response = {
                        id: editorId
                     }
                     adbDB.getEmailJsSettings()
                        .then(settings => {
                           let setting = settings[0];
                           //TODO: port hardcoded
                           let msg = 'Hi, on this email was created editor account for WebAdmin. Please reset your password following this link: http://localhost:9081/editors/?email=' + email;

                           emailJs.send(
                              email,
                              setting.emailjsService_id,
                              setting.emailjsTemplate_id,
                              setting.emailjsUser_id,
                              msg
                           )
      
                           resp.result = response;
                           return res.json(resp);
                          
                        });
                  })
            } else {
               res.status(400);
               resp.result = { error: 'parameters missing' };
               res.json(resp);
            }

         } else {

            return res.json(resp);

         }

      });

      // // edit user
      adminApp.post("/editors-edit", (req, res) => {
         const method = req.fields.method;
         let resp: any = {}; // new response that will be set via the specific method passed
         let params = JSON.parse(req.fields.params);

         if ('put' == method) {

            let name = params.name;
            let userId = params.uid;
            if (typeof name !== 'undefined' &&
               typeof userId !== 'undefined'
            ) {

               adbDB.editEditor(name, userId)
                  .then(function (editorId) {
                     console.info("--editorId:", editorId)
                     let response = {
                        id: editorId
                     }
                     resp.result = response;
                     return res.json(resp);
                  })

               // firebaseAdmin.get().auth().updateUser(userId, {
               //    displayName: name
               // }).then(function (userRecord) { // send response to client
               //    // See the UserRecord reference doc for the contents of userRecord.
               //    let response = {
               //       id: userRecord.uid
               //    }
               //    resp.result = response;
               //    res.json(resp);
               // }).catch(function (error) {
               //    res.status(400);
               //    resp.result = { error: error.message };
               //    res.json(resp);
               // });
            } else {
               res.status(400);
               resp.result = { error: 'parameters missing' };
               res.json(resp);
            }

         } else {

            return res.json(resp);

         }

      });

      // // delete user
      adminApp.post("/editors-delete", (req, res) => {
         const method = req.fields.method;
         let resp: any = {}; // new response that will be set via the specific method passed
         let params = JSON.parse(req.fields.params);

         if ('delete' == method) {
            let userId = params.uid;
            if (typeof userId !== 'undefined') {
               adbDB.deleteEditor(userId)
                  .then(function (editorId) {
                     console.info("--editor have been removed:", editorId)
                     resp.result = {};
                     res.json(resp);
                  })
                  .catch(function (error) {
                     res.status(400);
                     resp.result = { error: error.message };
                     res.json(resp);
                  });
            } else {
               res.status(400);
               resp.result = { error: 'parameters missing' };
               res.json(resp);
            }

         } else {

            return res.json(resp);

         }

      });

      return adminApp;

   };
}

module.exports = {
   AdminRoutes
}