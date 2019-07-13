
import { Email } from '../lib/Email';
import { BasePgRouter } from 'mbake/lib/Serv'
import { ADB, EditorAuth } from '../lib/ADB';
import { FileMethods } from 'mbake/lib/FileOpsExtra'
import { FileOps, Dirs } from 'mbake/lib/FileOpsBase'
import { AppLogic } from '../lib/AppLogic';

const fs = require('fs-extra')
const path = require('path')

export class EditorRoutes extends BasePgRouter {
   emailJs = new Email()

   adbDB: ADB;
   auth: EditorAuth;

   fm = new FileMethods()

   appLogic = new AppLogic()

   constructor(adbDB) {
      super();
      this.adbDB = adbDB
      this.auth = new EditorAuth(adbDB)
   }

   async checkEditor(resp, params, user, pswd) {
      let auth = await this.auth.auth(user,pswd,resp)
      if(auth != 'OK') return

      this.ret(resp, 'OK')
   }//()

   emailResetPasswordCode(resp, params, email, pswd) {
      const config:any = this.adbDB.getConfig()
      let emailjsService_id   = config.emailjsService_id
      let emailjsTemplate_id  = config.emailjsTemplate_id
      let emailjsUser_id      = config.emailjsUser_id
   
      let code = this.adbDB.getVcodeEditor(email)
      let msg = 'Enter your code at http://bla.bla' + code // TODO use ADB template email to CRUD w/ {{code}}
      this.emailJs.send(email, emailjsService_id, emailjsTemplate_id, emailjsUser_id, msg) 
      
      this.ret(resp, 'OK')
   }//() 
      
   async resetPasswordIfMatch(resp, params, email, password) {
      const result = await this.adbDB.resetPasswordEditorIfMatch(email, params.code, params.password)
      this.ret(resp, result)

   }//()

   async getDirs(resp, params, user, pswd) {
      let auth = await this.auth.auth(user,pswd,resp)
      if(auth != 'OK') return

      const appPath = await this.adbDB.getAppPath()

      const dirs = this.fm.getDirs(appPath)
      this.ret(resp, dirs)
   }//()
   
   async getFiles(resp, params, user, pswd) {
      let auth = await this.auth.auth(user,pswd,resp)
      if(auth != 'OK') return

      let itemPath = '/' + params.itemPath
      const appPath = await this.adbDB.getAppPath()

      const files = this.fm.getFiles(appPath, itemPath)
      this.ret(resp, files)
   }//files
   
   async getFileContent(resp, params, user, pswd) { 
         let auth = await this.auth.auth(user,pswd,resp)
         if(auth != 'OK') return

         let itemPath = '/' + params.itemPath
         let file = '/' + params.file
         const appPath = await this.adbDB.getAppPath()
         let fileName = appPath + itemPath + file

         const THIZ = this
         fs.readFile(fileName, 'utf8', (err, data) => {
            if (err) {
               THIZ.retErr(resp, err)
               return
            }
            THIZ.ret(resp,data)
         })
   }//() 
   
   async saveFile(resp, params, user, pswd) { 
      // save and add archived files
      let auth = await this.auth.auth(user,pswd,resp)
      if(auth != 'OK') return

      let itemPath = '/' + params.itemPath
      let file = '/' + params.file
      const appPath = await this.adbDB.getAppPath()
      let fileName =  itemPath + file
      let content = params.content;
      content = Buffer.from(content, 'base64');

      const fileOps = new FileOps(appPath)
      fileOps.write(fileName, content)

      this.ret(resp,'OK')

      this.appLogic.archive(itemPath, fileName) // TODO
           
   } 
   
   compileCode(resp, params, user, pswd) {

      return this.iauth.auth(user, pswd, resp).then(auth => {
         if (auth === 'admin' || auth === 'editor') {

            let post_id = params.post_id;
            let pathPrefix = params.pathPrefix;

            if (typeof post_id !== 'undefined') {

               let runMbake = new MBake()
               let dirCont = new Dirs(this.mountPath);

               let checkDat_i = dirCont.getInDir('/' + pathPrefix).filter(file => file.endsWith('dat_i.yaml'));

               //need to check what type of file is currently saving and run function based on it, eg: itemizeNbake, or comps
               if (checkDat_i.length > 0) {
                  // this is for yaml
                  runMbake.itemizeNBake(this.mountPath + '/' + pathPrefix, 3)
                     .then(response => {
                           resp.result = { data: 'OK' };
                           resp.json(resp);
                        }, error => {
                           resp.result = { data: error };
                           resp.json(resp);
                        })
               } else {
                  // TODO: When do we to do components? Why not just bake? md right.
                  runMbake.compsNBake(this.mountPath, 3).then(response => {
                     resp.result = { data: 'OK' };
                     resp.json(resp);
                  }, error => {
                     resp.result = { data: error };
                     resp.json(resp);
                  })
               }

            } else  this.retErr(resp,'no post id')

         } else  this.retErr(resp,'')

      })

   }//()
   
   clonePage(resp, params, user, pswd) {

      return this.iauth.auth(user, pswd, resp).then(auth => {
         if (auth === 'admin' || auth === 'editor') {

            let post_id = params.post_id;
            let pathPrefix = params.pathPrefix;

            if (typeof post_id !== 'undefined'
               && typeof pathPrefix !== 'undefined'
            ) {
               // create new post folder
               let postPath = this.mountPath + '/' + pathPrefix;
               let substring = '/';
               let newPost = '';
               if (pathPrefix.includes(substring)) {
                  pathPrefix = pathPrefix.substr(0, pathPrefix.indexOf('/'));
                  newPost = this.mountPath + '/' + pathPrefix + '/' + post_id;
               } else {
                  newPost = this.mountPath + '/' + post_id;
               }
               let fileOps = new FileOps('/');
               fileOps.clone(postPath, newPost);

               resp.result = { data: 'OK' };
               resp.json(resp);
            } else 
               this.retErr(resp,'error creating a post')

         } else this.retErr(resp,'')
      });
   } //()
   
   setPublishDate(resp, params, user, pswd) {
      return this.iauth.auth(user, pswd, resp).then(auth => {
         if (auth === 'admin' || auth === 'editor') {
            
            let post_id = params.post_id;
            let publish_date = params.publish_date;
            if (typeof post_id !== 'undefined') {
               let datYaml = new Dat(this.mountPath + '/' + post_id);
               datYaml.set('publishDate', publish_date);
               datYaml.write();
               let runMbake = new MBake();
               let postsFolder = post_id.substr(0, post_id.indexOf('/'));
               let pro: Promise<string> = runMbake.itemizeNBake(this.mountPath + '/' + postsFolder, 3);
               resp.result = { data: 'OK' };
               resp.json(resp);
            } else 
               this.retErr(resp,'no post id')

         } else 
            this.retErr(resp,'')
         
      })

   }//()


}//

module.exports = {
   EditorRoutes
}
