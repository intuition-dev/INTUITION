import { Email } from '../lib/Email'
import { BasePgRouter } from 'mbake/lib/Serv'
import { ADB, AdminAuth } from '../lib/ADB'

var path = require('path')

export class AdminRoutes extends BasePgRouter {

   emailJs = new Email()

   adbDB: ADB;
   
   auth: AdminAuth

   constructor(adbDB) {
      super();
      this.adbDB = adbDB
      this.auth = new AdminAuth(adbDB)

   }//()

   async checkAdmin(resp, params, user, pswd) {
      let auth = await this.auth.auth(user,pswd,resp)
      if(auth != 'OK') return

      this.ret(resp, 'OK')
   }//()


   async getConfig(resp, params, user, pswd) {
      let auth = await this.auth.auth(user,pswd,resp)
      if(auth != 'OK') return

      this.ret(resp, this.adbDB.getConfig())
      }//()
      
   async updateConfig(resp, params, user, pswd) {
      let auth = await this.auth.auth(user,pswd,resp)
      if(auth != 'OK') return

      console.log(params)
      
      let emailjsService_id   = params.emailjsService_id
      let emailjsTemplate_id  = params.emailjsTemplate_id
      let emailjsUser_id      = params.emailjsUser_id
      let pathToApp           = params.pathToApp
      let port                = params.port

      this.adbDB.updateConfig(emailjsService_id, emailjsTemplate_id, emailjsUser_id, pathToApp, port)
  
      this.ret(resp,'OK')
   } 
      
   emailResetPasswordCode(resp, params, email, pswd) {
      const config:any = this.adbDB.getConfig()
      let emailjsService_id   = config.emailjsService_id
      let emailjsTemplate_id  = config.emailjsTemplate_id
      let emailjsUser_id      = config.emailjsUser_id
   
      let code = this.adbDB.getVcodeAdmin()
      let msg = 'Enter your code at http://bla.bla'  + code
      this.emailJs.send(email, emailjsService_id, emailjsTemplate_id, emailjsUser_id, msg) 
      
      this.ret(resp, 'OK')
   }//() 
      
   resetPasswordIfMatch(resp, params, email, password) {
   
      this.adbDB.resetPasswordAdminIfMatch(email, params.code, params.password)

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

