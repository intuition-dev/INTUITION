
import { Email } from 'mbake/lib/Email';
import { BaseRPCMethodHandler } from 'mbake/lib/Serv'
import { IDB, EditorAuthX } from '../lib/IDB';
import { FileMethods } from 'mbake/lib/FileOpsExtra'
import { FileOps } from 'mbake/lib/FileOpsBase'
import { AppLogic } from '../lib/AppLogic';

const fs = require('fs-extra')

export class EditorHandler extends BaseRPCMethodHandler {
   emailJs = new Email()

   db: IDB;
   auth: EditorAuthX

   fm = new FileMethods()

   appLogic = new AppLogic()

   constructor(IDB) {
      super()
      this.db = IDB
      this.auth = new EditorAuthX(IDB)
   }

   async checkEditor(resp, params) {
      let pswd = Buffer.from(params.editor_pass).toString('base64');
      
      let auth = await this.auth.auth(params.editor_email,pswd,resp)
      if(auth != 'OK') return

      this.ret(resp, 'OK', null, null)
   }//()

   async emailResetPasswordCode(resp, params, email, pswd) {
      const config:any = await this.db.getConfig()
      let emailjsService_id   = config.emailjsService_id
      let emailjsTemplate_id  = config.emailjsTemplate_id
      let emailjsUser_id      = config.emailjsUser_id
      
      let code = this.db.getVcodeEditor(params.admin_email)
      
      let msg = 'Enter your code at http://bla.bla ' + code // TODO use IDB template email to CRUD w/ {{code}}

      email = Buffer.from(params.admin_email).toString('base64');
      this.emailJs.send(email, emailjsService_id, emailjsTemplate_id, emailjsUser_id, msg) 
      
      this.ret(resp, 'OK', null, null)
   }//() 
      
   async resetPasswordIfMatch(resp, params, email, password) {
      const result = await this.db.resetPasswordEditorIfMatch(params.admin_email, params.code, params.password)
      this.ret(resp, result, null, null)

   }//()

   async getDirs(resp, params, user, pswd) {
      user = Buffer.from(user, 'base64').toString();
      let auth = await this.auth.auth(user,pswd,resp)
      if(auth != 'OK') return

      const appPath = await this.db.getAppPath()

      const dirs = this.fm.getDirs(appPath)
      this.ret(resp, dirs, null, null)
   }//()
   
   async getFiles(resp, params, user, pswd) {
      user = Buffer.from(user, 'base64').toString();
      let auth = await this.auth.auth(user,pswd,resp)
      if(auth != 'OK') return

      let itemPath = '/' + params.itemPath
      const appPath = await this.db.getAppPath()
      const files = this.fm.getFiles(appPath, itemPath)
      this.ret(resp, files, null, null)
   }//files
   
   async getFileContent(resp, params, user, pswd) { 
         user = Buffer.from(user, 'base64').toString();
         let auth = await this.auth.auth(user,pswd,resp)
         if(auth != 'OK') return
         let itemPath = '/' + params.file
         let file = params.itemPath
         const appPath = await this.db.getAppPath()
         let fileName = appPath + itemPath + file

         const THIZ = this
         fs.readFile(fileName, 'utf8', (err, data) => {
            if (err) {
               THIZ.retErr(resp, err, null, null)
               return
            }
            THIZ.ret(resp,data, null, null)
         })
   }//() 
   
   async saveFile(resp, params, user, pswd) { 
      // save and add archived files
      user = Buffer.from(user, 'base64').toString();
      let auth = await this.auth.auth(user,pswd,resp)
      if(auth != 'OK') return

      let substring = '/';
      let itemPath = '/' + params.file
      let file = params.itemPath
      const appPath = await this.db.getAppPath()
      let fileName =  itemPath + file;
      let content = params.content;
      content = Buffer.from(content, 'base64');
      
      //back up old
      if (fileName.includes(substring)) {
         let fileName2 = fileName.substr(fileName.lastIndexOf('/'));
         this.appLogic.archive(appPath, itemPath, fileName2);
      } else {
         this.appLogic.archive(appPath, itemPath, fileName)
      }

      const fileOps = new FileOps(appPath)
      // done saving
      fileOps.write(fileName, content)
      this.ret(resp,'OK', null, null)

   }//()

   /**
   It is not relay async, it returns than compiles/bakes
   */
   async compileCode(resp, params, user, pswd) {
      user = Buffer.from(user, 'base64').toString();
      let auth = await this.auth.auth(user,pswd,resp)
      if(auth != 'OK') return

      let itemPath = '/' + params.file
      let file = params.itemPath
      const appPath = await this.db.getAppPath()
      let fileName =  itemPath + file
      this.ret(resp,'OK', null, null)

      this.appLogic.autoBake(appPath, itemPath, fileName) 
   }//()
   
   async cloneItem(resp, params, user, pswd) {
      user = Buffer.from(user, 'base64').toString();
      let auth = await this.auth.auth(user,pswd,resp)
      if(auth != 'OK') return

      let itemPath = '/' + params.itemPath
      let newItemPath = '/' + params.newItemPath
      const appPath = await this.db.getAppPath()

      await this.appLogic.clone(appPath, itemPath, newItemPath) 
      this.ret(resp,'OK', null, null)
   } //()
   
   /**
    * Publish Date is an INT, linux time GMT
    */
   async setPublishDate(resp, params, user, pswd) {
      user = Buffer.from(user, 'base64').toString();
      let auth = await this.auth.auth(user,pswd,resp)
      if(auth != 'OK') return

      let itemPath = '/' + params.itemPath
      const appPath = await this.db.getAppPath()
      let publish_date:number = params.publish_date
      this.appLogic.setPublishDate(appPath, itemPath, publish_date) 

      this.ret(resp,'OK', null, null)
   }//()

}//


module.exports = {
   EditorHandler
}