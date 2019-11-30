
import { Email } from 'mbake/lib/Email';
import { BaseRPCMethodHandler } from 'http-rpc/node-srv/lib/Serv'

// import { BaseRPCMethodHandler } from '../Serv'
import { IDB, EditorAuthX } from '../lib/IDB';
import { FileMethods } from 'mbake/lib/FileOpsExtra'
import { FileOps } from 'mbake/lib/FileOpsBase'
import { AppLogic } from '../lib/AppLogic';

const bunyan = require('bunyan')
const bformat = require('bunyan-format2')  
const formatOut = bformat({ outputMode: 'short' })
const log = bunyan.createLogger({src: true, stream: formatOut, name: "editor"})

const fs = require('fs-extra')

export class EditorHandler extends BaseRPCMethodHandler {
   emailJs = new Email()

   db: IDB;
   auth: EditorAuthX

   configIntu
   fm = new FileMethods()

   appLogic = new AppLogic()

   constructor(IDB, configIntu) {
      super(1)
      this.db = IDB
      this.auth = new EditorAuthX(IDB)
      this.configIntu = configIntu
   }

   async checkEditor(params) {

      let auth = await this.auth.auth(params.editor_email, params.editor_pass)
      if (auth != 'OK') return

      return 'OK'
   }//()

   async emailResetPasswordCode(params) {

      const config: any = await this.db.getConfig()
      let emailjsService_id = config.emailjsService_id
      let emailjsTemplate_id = config.emailjsTemplate_id
      let emailjsUser_id = config.emailjsUser_id

      let code = this.db.makeVcodeEditor(params.admin_email)

      // Nat
      let msg = 'Enter your code at http://bla.bla ' + code // TODO use IDB template email to CRUD w/ {{code}}

      let email = Buffer.from(params.admin_email).toString('base64');
      this.emailJs.send(email, emailjsService_id, emailjsTemplate_id, emailjsUser_id, msg)

      return 'OK'
   }//() 

   async resetPasswordIfMatch(params, email, password) {
      const result = await this.db.resetPasswordEditorIfMatch(params.admin_email, params.code, params.password)
      return result

   }//()

   async getDirs(params) {
      log.info("TCL: EditorHandler -> getDirs -> user")
      log.info("TCL: EditorHandler -> getDirs -> params", params)
      // user = Buffer.from(params.editor_email).toString('base64');
      // log.info("TCL: EditorHandler -> getDirs -> user", user)
      // pswd = Buffer.from(params.editor_pass).toString('base64');
      // log.info("TCL: EditorHandler -> getDirs -> pswd", pswd)
      let auth = await this.auth.auth(params.editor_email, params.editor_pass)
      log.info("TCL: EditorHandler -> getDirs -> auth", auth)
      if (auth != 'OK') return

      const appPath = this.configIntu.path

      const dirs = this.fm.getDirs(appPath)
      return dirs
   }//()

   async getFiles(params) {
   
      // user = Buffer.from(user, 'base64').toString();
      let auth = await this.auth.auth(params.editor_email, params.editor_pass)
      if (auth != 'OK') return

      let itemPath = '/' + params.itemPath
      const appPath = this.configIntu.path
      const files = this.fm.getFiles(appPath, itemPath)
      return  files
   }//files

   async getFileContent(params) {
      // user = Buffer.from(user, 'base64').toString();
      let auth = await this.auth.auth(params.editor_email, params.editor_pass)
      if (auth != 'OK') return
      let itemPath = '/' + params.file
      let file = params.itemPath
      const appPath = this.configIntu.path
      let fileName = appPath + itemPath + file

      log.info(fileName)

      fs.readFile(fileName, 'utf8', (err, data) => {
         if (err) {
            log.error(err)
            throw err
         }
         log.info(data)
         return data
      })
   }//() 

   async saveFile(params) {
      // save and add archived files
      //user = Buffer.from(user, 'base64').toString();
      let auth = await this.auth.auth(params.editor_email, params.editor_pass)
      if (auth != 'OK') return

      let substring = '/';
      let itemPath = '/' + params.file
      let file = params.itemPath
      const appPath = this.configIntu.path
      let fileName = itemPath + file;
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
      return  'OK'
   }//()

   /**
   It is not relay async, it returns than compiles/bakes
   */
   async compileCode(params) {
      //user = Buffer.from(user, 'base64').toString();
      let auth = await this.auth.auth(params.editor_email, params.editor_pass)
      if (auth != 'OK') return

      let itemPath = '/' + params.file
      let file = params.itemPath
      const appPath = this.configIntu.path
      let fileName = itemPath + file
      this.appLogic.autoBake(appPath, itemPath, fileName)

      return 'OK'

   }//()

   async cloneItem(params) {
      //user = Buffer.from(user, 'base64').toString();
      let auth = await this.auth.auth(params.editor_email, params.editor_pass)
      if (auth != 'OK') return

      let itemPath = '/' + params.itemPath
      let newItemPath = '/' + params.newItemPath
      const appPath = this.configIntu.path

      await this.appLogic.clone(appPath, itemPath, newItemPath)
      return 'OK'
   } //()

   /**
    * Publish Date is an INT, linux time GMT
    */
   async setPublishDate(params) {
      //user = Buffer.from(user, 'base64').toString();
      let auth = await this.auth.auth(params.editor_email, params.editor_pass)
      if (auth != 'OK') return

      let itemPath = '/' + params.itemPath
      const appPath = this.configIntu.path
      let publish_date: number = params.publish_date
      this.appLogic.setPublishDate(appPath, itemPath, publish_date)

      return 'OK'
   }//()

}//


module.exports = {
   EditorHandler
}
