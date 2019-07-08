import { Download } from 'mbake/lib/FileOpsExtra'
import { Email } from '../Email'
import { BasePgRouter, iAuth } from 'mbake/lib/Serv'
import { ADB } from '../ADB'
import { Auth } from '../Auth'

const fs = require('fs-extra')
var path = require('path');

export class AdminRoutes extends BasePgRouter {

   emailJs = new Email()

   adbDB: ADB;
   iauth: iAuth;

   constructor(appE, adbDB) {
      super();
      this.adbDB = adbDB
      this.iauth = new Auth(appE, adbDB);
   }

   ROUTES = async(req, res) => {
      console.log('req')

      const user = req.fields.user
      const pswd = req.fields.pswd

      const method = req.fields.method
      const params = JSON.parse(req.fields.params)
      const resp: any = {}
      console.log('admin method: ', '"'+method+'"')

      if (method === 'check-admin') {

         let user = Buffer.from(params.admin_email).toString('base64');
         let pswd = Buffer.from(params.admin_pass).toString('base64');

         return this.iauth.auth(user, pswd, res).then(auth => {
            console.log('auth admin: ', auth);
            if (auth === 'admin') {
      
               resp.result = true;
               return res.json(resp);

            } else {
               resp.errorLevel = -1
               resp.errorMessage = 'mismatch'
               res.json(resp)
            }
         });
      }
      else if ('setup-app' === method) {
         return this.iauth.auth(user, pswd, res).then(async auth => {
            if (auth === 'admin') {

               let item = params.item
      
               console.log('-------res.locals', res.locals.email)
               /**
                * this one only downloads the site and write the path of it to the db
                * happens only on CLICK INSTALL button on the settings page at admin
                *  */
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
                  let adminId = await this.adbDB.getAdminId(res.locals.email)
                  await this.adbDB.setupApp(path.join(__dirname, '../' + setupItem), adminId[0].id)
                     .then(result => {
                        resp.result = true;
                        return res.json(resp);
                     }).then(() => {
                        // run site
                        // setTimeout(function () {
                        //    Wa.watch(path.join(__dirname, '../' + setupItem), 3000);
                        // }, 10000);
                     });
               } catch (err) {
                  console.log('setup-app: ', err);
               }

            } else {
               resp.errorLevel = -1
               resp.errorMessage = 'mismatch'
               res.json(resp)
            }
         });

      } else if (method === "get-config") {

         return this.iauth.auth(user, pswd, res).then(async auth => {
            console.log('auth get-config: ', auth);
            if (auth === 'admin') {

               let item = params.item
               resp.result = {}
               try {
                  var setupItem = ''
   
                  this.adbDB.getAdminId(res.locals.email)
                     .then(adminId => {
                        this.adbDB.getConfigs(adminId[0].id)
                           .then(result => {
                              let temp = {}
                              temp['port'] = result.port
                              temp['pathToSite'] = result.pathToSite
                              resp.result = temp;
                              return res.json(resp);
                           })
   
                     })
               } catch (err) {
                  console.log('get-config: ', err);
               }

            } else {
               resp.errorLevel = -1
               resp.errorMessage = 'mismatch'
               res.json(resp)
            }
         });

      } else if (method === "update-config") {

         return this.iauth.auth(user, pswd, res).then(async auth => {
            if (auth === 'admin') {

               /**
                * Update configs happens on 'Save Settings' click, on the admin/settings
                * Writes the path of the folder to db and
                * the port of node where the app is running
                **/
      
               let path = params.path
               let port = params.port
               let printfulApi = params.printfulApi
      
               resp.result = {}
               try {
                  this.adbDB.getAdminId(res.locals.email)
                     .then(adminId => {
                        //set new port and path to db
                        this.adbDB.updateConfig(path, port, printfulApi, adminId[0].id)
                           .then(result => {
                              console.log("TCL: AdminRoutes -> routes -> result", result)
                              let temp = {}
                              temp['port'] = port
                              temp['pathToSite'] = path
                              temp['printfulApi'] = printfulApi
                              resp.result = temp;
                              res.json(resp);
      
                           })
      
                     })
               } catch (err) {
                  console.log('update-config: ', err);
               }
               
            } else {
               resp.errorLevel = -1
               resp.errorMessage = 'mismatch'
               res.json(resp)
            }
         });

      } else if (method === "resetPassword-code") {

         let email = params.admin_email
         resp.result = {}

         try {
            var code = this.adbDB.sendVcode(email)
               .then(code => {
                  this.adbDB.getEmailJsSettings()
                     .then(settings => {
                        let setting = settings[0];
                        this.emailJs.send(
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
            console.log('resetPassword-code: ', err);
         }

      } else if ('reset-password' == method) {
         let email = params.admin_email
         resp.result = {}

         this.adbDB.resetPassword(email, params.code, params.password)
            .then(result => {
               resp.result = result;
               return res.json(resp);
            })

      } else if (method === "get-editors") {

         console.log('admin get editors auth: ')
         return this.iauth.auth(user, pswd, res).then(async auth => {
            if (auth === 'admin') {
      
               this.adbDB.getEditors()
                  .then(editors => {
                     console.info("--editors:", editors)
                     let data = []
                     editors.map(editor => {
                        data.push({
                           id: editor.id,
                           email: editor.email,
                           name: editor.name
                        });
                     })
                     console.log('get editors data -------------> ', data);
                     resp.result = data;
                     return res.json(resp);
                  })
                  .catch(() => {
                     console.log('failed get editors data');
                  });

            } else {
               resp.errorLevel = -1
               resp.errorMessage = 'mismatch'
               res.json(resp)
            }
         });

      } else if (method === "add-editor") {

         return this.iauth.auth(user, pswd, res).then(async auth => {
            if (auth === 'admin') {

               let email = params.email;
               let name = params.name;
               let password = params.password;
               if (typeof email !== 'undefined' &&
                  typeof name !== 'undefined' &&
                  typeof password !== 'undefined'
               ) {
   
                  this.adbDB.addEditor(email, name, password)
                     .then(editorId => {
                        let response = {
                           id: editorId
                        }
                        this.adbDB.getEmailJsSettings()
                           .then(settings => {
                              this.adbDB.getAdminId(res.locals.email)
                                 .then(adminId => {
                                    this.adbDB.getConfigs(adminId[0].id)
                                       .then(result => {
                                          let port = result.port;
                                          let setting = settings[0];
                                          // email a link to localhost. Really?
                                          let link = 'http://localhost:' + port + '/editors/?email=' + encodeURIComponent(email);
                                          let msg = 'Hi, on this email was created editor account for WebAdmin. Please reset your password following this link: ' + link;
   
                                          this.emailJs.send(
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
               resp.errorLevel = -1
               resp.errorMessage = 'mismatch'
               res.json(resp)
            }
         });


      } else if (method === "edit-editor") {

         return this.iauth.auth(user, pswd, res).then(async auth => {
            if (auth === 'admin') {

               // edit user
               let name = params.name;
               let userId = params.uid;
               if (typeof name !== 'undefined' &&
                  typeof userId !== 'undefined'
               ) {
   
                  this.adbDB.editEditor(name, userId)
                     .then(editorId => {
                        console.info("--editorId:", editorId)
                        let response = {
                           id: editorId
                        }
                        resp.result = response;
                        return res.json(resp);
                     })
   
               } else {
                  console.log('failed to edit user');
                  res.status(400);
                  resp.result = { error: 'parameters missing' };
                  res.json(resp);
               }
      
            } else {
               resp.errorLevel = -1
               resp.errorMessage = 'mismatch'
               res.json(resp)
            }
         });

      } else if (method === "delete-editor") {

         return this.iauth.auth(user, pswd, res).then(async auth => {
            if (auth === 'admin') {

               let userId = params.uid;
               if (typeof userId !== 'undefined') {
                  this.adbDB.deleteEditor(userId)
                     .then(editorId => {
                        console.info("--editor have been removed:", editorId)
                        resp.result = {};
                        res.json(resp);
                     })
                     .catch(error => {
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
               resp.errorLevel = -1
               resp.errorMessage = 'mismatch'
               res.json(resp)
            }
         });


      }

   }
}
