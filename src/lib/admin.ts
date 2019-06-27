import { ExpressRPC } from 'mbake/lib/Serv';
import { Download } from 'mbake/lib/FileOpsExtra';
import { Email } from './Email';
import { Wa } from 'mbake/lib/Wa';

const fs = require('fs-extra')

var path = require('path');

export class AdminRoutes {

   appE
   constructor(appE) {
      this.appE = appE
   }

   routes(adbDB, host, appPort) {
      const emailJs = new Email();

      this.appE.appInst.use((request, response, next) => {
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

      this.appE.appInst.post('/checkAdmin', (req, res) => {
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

      /**
       * this one only downloads the site and write the path of it to the db
       * happens only on CLICK INSTALL button on the settings page at admin
       *  */
      this.appE.appInst.post('/setup-app', async (req, res) => {
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
                     await new Download('CMS', path.join(__dirname, '../')).autoUZ()
                     break;
                  case 'shop':
                     setupItem = 'e-com'
                     console.log("TCL: AdminRoutes -> routes -> setupItem", setupItem)

                     // const shippingRoutes = new ShippingRoutes();
                     // adminApp.use('/', shippingRoutes.routes(appPort))
                     await new Download('SHOP', path.join(__dirname, '../')).autoUZ()
                     break;
                  case 'website':
                     setupItem = 'website'
                     await new Download('website', path.join(__dirname, '../')).autoUZ()
                     break;
               }

               //write path of new folder to the db
               let adminId = await adbDB.getAdminId(res.locals.email)
               await adbDB.setupApp(path.join(__dirname, '../' + setupItem), adminId[0].id)
                  .then(function (result) {
                     resp.result = true;
                     return res.json(resp);
                  }).then(() => {
                     // run site
                     setTimeout(function() {
                        Wa.watch(path.join(__dirname, '../' + setupItem), 3000);
                     }, 10000);
                  });
            } catch (err) {
               // next(err);
            }
         } else {
            return res.json(resp);
         }
      })

      this.appE.appInst.post('/get-config', (req, res) => {
         const method = req.fields.method;
         let params = JSON.parse(req.fields.params)
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
                           temp['port'] = result.port
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

      /**
       * Update configs happens on 'Save Settings' click, on the admin/settings
       * Writes the path of the folder to db and
       * the port of node where the app is running
       **/
      this.appE.appInst.post('/update-config', (req, res) => {
         const method = req.fields.method;
         let params = JSON.parse(req.fields.params)

         let path = params.path
         let port = params.port
         let printfulApi = params.printfulApi

         let resp: any = {};

         if ('update-config' == method) {
            resp.result = {}
            try {
               adbDB.getAdminId(res.locals.email)
                  .then(function (adminId) {
                     //set new port and path to db
                     adbDB.updateConfig(path, port, printfulApi, adminId[0].id)
                        .then(function (result) {
                           console.log("TCL: AdminRoutes -> routes -> result", result)
                           let temp = {}
                           temp['port'] = port
                           temp['pathToSite'] = path
                           temp['printfulApi'] = printfulApi
                           resp.result = temp;
                           if (port != appPort) {
                              res.json(resp);
                              process.exit()
                           }
                           res.json(resp);

                        })

                  })
            } catch (err) {
               // next(err);
            }
         } else {
            return res.json(resp);
         }
      })

      this.appE.appInst.post('/resetPassword', (req, res) => {
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
                           console.info('code', code);
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
      this.appE.appInst.post("/editors", (req, res) => {
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
      this.appE.appInst.post("/editors-add", (req, res) => {
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
                           adbDB.getAdminId(res.locals.email)
                              .then(function (adminId) {
                                 adbDB.getConfigs(adminId[0].id)
                                    .then(function (result) {
                                       let port = result.port;
                                       let setting = settings[0];
                                       let link = 'http://localhost:' + port + '/editors/?email=' + encodeURIComponent(email);
                                       let msg = 'Hi, on this email was created editor account for WebAdmin. Please reset your password following this link: ' + link;

                                       emailJs.send(
                                          email,
                                          setting.emailjsService_id,
                                          setting.emailjsTemplate_id,
                                          setting.emailjsUser_id,
                                          msg
                                       )

                                       resp.result = response;
                                       return res.json(resp);

                                    })

                              })


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

      })

      // edit user
      this.appE.appInst.post("/editors-edit", (req, res) => {
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
      this.appE.appInst.post("/editors-delete", (req, res) => {
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

      return this.appE.appInst

   };
}

module.exports = {
   AdminRoutes
}