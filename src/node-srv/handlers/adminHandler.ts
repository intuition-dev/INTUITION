import { Email } from 'mbake/lib/Email'
import { BaseRPCMethodHandler } from 'mbake/lib/Serv'
import { IDB } from '../lib/IDB'

export class AdminHandler extends BaseRPCMethodHandler {

   emailJs = new Email()
   IDB: IDB
   configIntu

   constructor(IDB, configIntu) {
      super()
      this.IDB = IDB
      this.configIntu = configIntu

   }//()

   auth(login, pass) {
      const user = 'admin'
      const pswd = this.configIntu.secret
      if (login == user && pass == pswd) {
         return 'OK'
      }
      return 'FAIL'
   }

   async checkAdmin(resp, params, ent, user, pswd, token) {
      let auth = await this.auth(params.admin_email, params.admin_pass)

      if (auth != 'OK') {
         this.ret(resp, 'FAIL', null, null)
      } else {
         this.ret(resp, 'OK', null, null)
      }

   }//()


   async getConfig(resp, params, ent, user, pswd, token) {

      let auth = await this.auth(params.admin_email, params.admin_pass)

      if (auth != 'OK') return

      let data = await this.IDB.getConfig();

      this.ret(resp, data, null, null)
   }//()

   async updateConfig(resp, params, ent, user, pswd, token) {

      let auth = await this.auth(params.admin_email, params.admin_pass)
      if (auth != 'OK') return

      let emailjsService_id = params.emailjsService_id
      let emailjsTemplate_id = params.emailjsTemplate_id
      let emailjsUser_id = params.emailjsUser_id

      let res =  this.IDB.updateConfig(emailjsService_id, emailjsTemplate_id, emailjsUser_id);
      console.log("TCL: AdminHandler -> updateConfig -> res", res)
      if (res) {
         let data = [];
         data.push({
            emailjsService_id: emailjsService_id,
            emailjsTemplate_id: emailjsTemplate_id,
            emailjsUser_id: emailjsUser_id,
         });
         this.ret(resp, data, null, null)
      }
   }

   async resetPasswordIfMatch(resp, params, ent, email, password) {
      let adminEmail = Buffer.from(params.admin_email).toString('base64');
      let newPassword = Buffer.from(params.password).toString('base64');
      const result = await this.IDB.resetPasswordAdminIfMatch(adminEmail, params.code, newPassword);
      this.ret(resp, result, null, null)

   }//()

   async getEditors(resp, params, ent, user, pswd, token) {


      let auth = await this.auth(params.admin_email, params.admin_pass)
      if (auth != 'OK') return

      let editors = this.IDB.getEditorsAll()
      this.ret(resp, editors, null, null)
   }

   /**
    *  Needs a guid sent by browsers. There is a getGUID() in toolbelt
    */
   async addEditor(resp, params, ent, user, pswd, token) {
      let auth = await this.auth(params.admin_email, params.admin_pass)
      if (auth != 'OK') return

      let guid = params.id;
      let email = params.email;
      let name = params.name;
      let password = params.password;

      await this.IDB.addEditor(guid, name, email, password)
      this.ret(resp, 'OK', null, null)
   }//()

   /**
    *  edit user
    */
   async editEditor(resp, params, ent, user, pswd, token) {
      let auth = await this.auth(params.admin_email, params.admin_pass)
      if (auth != 'OK') return

      let guid = params.uid;
      let name = params.name;
      let data = await this.IDB.editEditor(guid, name);

      this.ret(resp, data, null, null)
   }

   async deleteEditor(resp, params, ent, user, pswd, token) {
      let auth = await this.auth(params.admin_email, params.admin_pass)
      if (auth != 'OK') return

      let guid = params.uid;
      await this.IDB.deleteEditor(guid)

      this.ret(resp, 'OK', null, null)
   }//()

}//class

