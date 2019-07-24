import { Email } from '../lib/Email'
import { BasePgRouter } from 'mbake/lib/Serv'
import { ADB, AdminAuth } from '../lib/ADB'

export class AdminRoutes extends BasePgRouter {

   emailJs = new Email()
   adbDB: ADB;
   auth: AdminAuth

   constructor(adbDB) {
      super();
      this.adbDB = adbDB
      this.auth = new AdminAuth(adbDB)

   }//()

   async checkAdmin(resp, params) {
      let user = Buffer.from(params.admin_email).toString('base64');
      let pswd = Buffer.from(params.admin_pass).toString('base64');

      let auth = await this.auth.auth(user,pswd,resp)
      if(auth != 'OK') this.ret(resp, 'FAIL')

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
      let msg = 'Enter your code at http://bla.bla'   + code // TODO use ADB template email to CRUD w/ {{code}}
      this.emailJs.send(email, emailjsService_id, emailjsTemplate_id, emailjsUser_id, msg) 
      
      this.ret(resp, 'OK')
   }//() 
      
   async resetPasswordIfMatch(resp, params, email, password) {
      const result = await this.adbDB.resetPasswordAdminIfMatch(email, params.code, params.password)
      this.ret(resp, result)

   }//()
   
   async getEditors(resp, params, user, pswd) {
      let auth = await this.auth.auth(user,pswd,resp)
      if(auth != 'OK') return

      let EditorsJson = await this.adbDB.getEditors()
      this.ret(resp, EditorsJson)
   } 
      
   /**
    *  Needs a guid sent by browsers. There is a getGUID() in toolbelt
    */
   async addEditor(resp, params, user, pswd) {
      let auth = await this.auth.auth(user,pswd,resp)
      if(auth != 'OK') return

      let guid = params.id;
      let email = params.email;
      let name = params.name;
      let password = params.password;

      await this.adbDB.addEditor(guid, name, email, password) 
      this.ret(resp,'OK')
   }//()

   /**
    *  edit user
    */
   async editEditor(resp, params, user, pswd) {
      let auth = await this.auth.auth(user,pswd,resp)
      if(auth != 'OK') return

      let guid = params.uid;
      let name = params.name;
      let data = await this.adbDB.editEditor(guid, name); 

      this.ret(resp, data);
   }
 
   async deleteEditor(resp, params, user, pswd) {
      let auth = await this.auth.auth(user,pswd,resp)
      if(auth != 'OK') return

      let guid = params.uid;
      await this.adbDB.deleteEditor(guid) 

      this.ret(resp,'OK')
   }//()

}//class

