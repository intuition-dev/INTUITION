import { Download } from 'mbake/lib/FileOpsExtra'
import { Email } from '../Email'
import { BasePgRouter, iAuth } from 'mbake/lib/Serv'
import { ADB } from '../ADB'
import { Auth } from '../Auth'

var path = require('path')

export class AdminRoutes extends BasePgRouter {

   emailJs = new Email()

   adbDB: ADB;
   iauth: iAuth;

   appE

   constructor(appE, adbDB) {
      super();
      this.appE = appE
      this.adbDB = adbDB
      this.iauth = new Auth(appE, adbDB);
   }//()

   checkAdmin(resp, params, user, pswd) {

      return this.iauth.auth(user, pswd).then(auth => {
         console.log('auth admin: ', auth);

         if (auth === 'admin') {
   
            resp.result = true;
            return resp.json(resp);

         } else   this.retErr(resp,'')

      })
      
   }//()

   setupApp(resp, params, user, pswd) {
      return this.iauth.auth(user, pswd, resp).then(async auth => {
         if (auth === 'admin') {

            let item = params.item
   
            console.log('-------res.locals', resp.locals.email)
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
               let adminId = await this.adbDB.getAdminId(resp.locals.email)
               await this.adbDB.setAppPath(path.join(__dirname, '../' + setupItem), adminId[0].id)
                  .then(result => {
                     resp.result = true;
                     return resp.json(resp);
                  }).then(() => {

                     // run site
                     
                     this.appE// ...

                  });
            } catch (err) {
               console.log('setup-app: ', err);
            }

         } else   this.retErr(resp,'')

      })

   }//()
      
   getConfig(resp, params, user, pswd) {

         return this.iauth.auth(user, pswd, resp).then(async auth => {
            console.log('auth get-config: ', auth);
            if (auth === 'admin') {

               resp.result = {}
               try {
   
                  this.adbDB.getAdminId(user)

                     .then(adminId => {
                        this.adbDB.getConfigs(adminId[0].id)
                           .then(result => {
                              let temp = {}
                              temp['port'] = result.port
                              temp['pathToSite'] = result.pathToSite
                              resp.result = temp;
                              return resp.json(resp);
                           })
   
                     })
               } catch (err) {
                  
                  this.retErr(resp,'get-config')

               }

            } else             this.retErr(resp,'')

         })

      }//()
      
      updateConfig(resp, params, user, pswd) {

         return this.iauth.auth(user, pswd, resp).then(async auth => {
            if (auth === 'admin') {

               /**
                * Update configs happens on 'Save Settings' click, on the admin/settings
                * Writes the path of the folder to db and
                * the port of node where the app is running
                **/
      
               let path = params.path
               let port = params.port
      
               resp.result = {}
               try {
                  this.adbDB.getAdminId(user)
                     .then(adminId => {
                        //set new port and path to db
                        this.adbDB.updateConfig(path, port, adminId[0].id)
                           .then(result => {
                              console.log("TCL: AdminRoutes -> routes -> result", result)
                              let temp = {}
                              temp['port'] = port
                              temp['pathToSite'] = path
                              resp.result = temp;
                              resp.json(resp);
      
                           })
      
                     })
               } catch (err) {
                  this.retErr(resp, err)
               }
               
            } else       this.retErr(resp,'')

         })

      } 
      
      resetPasswordCode(resp, params, user, pswd) {

         let email = params.admin_email
         resp.result = {}

         try {
            var code = this.adbDB.setVcodeAdmin(email)
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
                        return resp.json(resp);
                     });
               })
         } catch (err) 
            this.retErr(resp, err)

         

      }//() 
      
      resetPassword(resp, params, user, pswd) {
         let email = params.admin_email
         resp.result = {}

         this.adbDB.resetPasswordAdmin(email, params.code, params.password)
            .then(result => {
               resp.result = result;
               return resp.json(resp);
            })

      }
      
      getEditors(resp, params, user, pswd) {

         console.log('admin get editors auth: ')
         return this.iauth.auth(user, pswd, resp).then(async auth => {
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
                     return resp.json(resp);
                  })
                  .catch(() => {
                     this.retErr(resp,'failed get editors data')

                  })

            } else this.retErr(resp,'')

         });

      } 
      
      addEditor(resp, params, user, pswd) {

         return this.iauth.auth(user, pswd, resp).then(async auth => {
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
                              this.adbDB.getAdminId(user)
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
                                          return resp.json(resp);
   
                                       })
   
                                 })
   
   
                           });
                     })

               } else   this.retErr(resp,'parameters missing')

      
            } else 

            this.retErr(resp,'')

         })


      }
      
      editEditor(resp, params, user, pswd) {

         return this.iauth.auth(user, pswd, resp).then(async auth => {
            if (auth === 'admin') {

               // edit user
               let name = params.name;
               let userId = params.uid;
               if (typeof name !== 'undefined' &&
                  typeof userId !== 'undefined'
               ) {
   
                  this.adbDB.updateEditor(name, userId)
                     .then(editorId => {
                        console.info("--editorId:", editorId)
                        let response = {
                           id: editorId
                        }
                        resp.result = response;
                        return resp.json(resp);
                     })
   
               } else    this.retErr(resp,'parameters missing')

            } else 
               this.retErr(resp,'')
            
         })

      }//() 
      
   deleteEditor(resp, params, user, pswd) {

      return this.iauth.auth(user, pswd, resp).then(async auth => {
         if (auth === 'admin') {

            let userId = params.uid;
            if (typeof userId !== 'undefined') {
               this.adbDB.deleteEditor(userId)
                  .then(editorId => {
                     console.info("--editor have been removed:", editorId)
                     resp.result = {};
                     resp.json(resp);
                  })
                  .catch(error => {
                     this.retErr(resp, error)
                  });
            } else 
               this.retErr(resp,'parameters missing')
   
         } else 
         
            this.retErr(resp,'')
         
      })

   }//()

}//class

