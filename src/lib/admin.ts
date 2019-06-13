import { ExpressRPC } from 'mbake/lib/Serv';
import { Download } from 'mbake/lib/FileOpsExtra';
import { Email } from './Email';

var path = require('path');

export class AdminRoutes {
   routes(adbDB) {
      const emailJs = new Email();
      const bodyParser = require("body-parser");

      const adminApp = ExpressRPC.makeInstance(['http://localhost:9081']);
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
                     setupItem = 'shop'
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
      adminApp.post('/get-configs', (req, res) => {
         const method = req.fields.method;
         let params = JSON.parse(req.fields.params)
         let item = params.item

         let resp: any = {};
         if ('get-configs' == method) {
            resp.result = {}
            try {
               var setupItem = ''

               adbDB.getAdminId(res.locals.email)
                  .then(function (adminId) {
                     adbDB.getConfigs(adminId[0].id)
                        .then(function (result) {
                           console.log("TCL: AdminRoutes -> routes -> result", result)
                           resp.result = result;
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

      // // add user
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