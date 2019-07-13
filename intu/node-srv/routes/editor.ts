import { MBake } from 'mbake/lib/Base';

import { Email } from '../lib/Email';
import { BasePgRouter } from 'mbake/lib/Serv'
import { ADB, EditorAuth } from '../lib/ADB';
import { FileMethods } from 'mbake/lib/FileOpsExtra'
import { FileOps, Dirs, Dat } from 'mbake/lib/FileOpsBase'

const fs = require('fs-extra')
const path = require('path')

export class EditorRoutes extends BasePgRouter {
   emailJs = new Email()

   adbDB: ADB;
   auth: EditorAuth;

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
   

   
   getItems(resp, params, user, pswd) {

      return this.iauth.auth(user, pswd, resp).then(auth => {
         if (auth === 'admin' || auth === 'editor') {

            resp.result = this.fileMethod.getDirs(this.mountPath)
            resp.json(resp);
            
         } else  this.retErr(resp,'')
      })


   } 
   
   getFiles(resp, params, user, pswd) {

      return this.iauth.auth(user, pswd, resp).then(auth => {
         if (auth === 'admin' || auth === 'editor') {

            let post_id = '/' + params.post_id;
            
            if (typeof post_id !== 'undefined') {
               
               resp.result = this.fileMethod.getFiles(this.mountPath, post_id);
               resp.json(resp);

            } else  this.retErr(resp,'no post id')

         } else  this.retErr(resp,'')
      })

   }
   
   getFileContent(resp, params, user, pswd) { 

      return this.iauth.auth(user, pswd, resp).then(auth => {
         if (auth === 'admin' || auth === 'editor') {

            let post_id = params.post_id;
            let pathPrefix = params.pathPrefix;

            if (typeof post_id !== 'undefined') {

               let md = this.mountPath + '/' + pathPrefix + post_id;
               let original_post_id = post_id.replace(/\.+\d+$/, "");
               let fileExt = path.extname(original_post_id);

               if (fs.existsSync(md) && (fileExt === '.md' || fileExt === '.yaml' || fileExt === '.csv' || fileExt === '.pug' || fileExt === '.css')) {
                  fs.readFile(md, 'utf8', (err, data) => {
                     if (err) throw err;
                     resp.result = data;
                     resp.json(resp);
                  });
               } else {
                  throw "Unknown file type!"
               }
            } else  this.retErr(resp,'no post id')
         } else  this.retErr(resp,'')

      })

   } 
   
   saveFile(resp, params, user, pswd) { 
      // update .md/.yaml/.csv/.pug/.css file and add archived files

      return this.iauth.auth(user, pswd, resp).then(auth => {
         if (auth === 'admin' || auth === 'editor') {

            let post_id = params.post_id;
            let pathPrefix = params.pathPrefix;
            let content = params.content;
            content = Buffer.from(content, 'base64');

            if (typeof post_id !== 'undefined') {

               let md = '/' + pathPrefix + post_id;

               let fileOps = new FileOps(this.mountPath);
               fileOps.write(md, content);

               let dirCont = new Dirs(this.mountPath);
               let substring = '/';

               // add /archive
               let checkDat = dirCont.getInDir('/' + pathPrefix).filter(file => file.endsWith('dat.yaml'));
               if (checkDat.length > 0) {
                  const archivePath = '/' + pathPrefix + '/archive';
                  if (!fs.existsSync(this.mountPath + archivePath)) {
                     fs.mkdirSync(this.mountPath + archivePath);
                  }

                  let archiveFileOps = new FileOps(this.mountPath + archivePath);

                  let extension = path.extname(post_id);
                  let fileName = path.basename(post_id, extension);
                  let count = archiveFileOps.count(path.basename(post_id));
                  let archiveFileName = '/' + fileName + extension + '.' + count;
                  archiveFileOps.write(archiveFileName, content);
               }

               if (pathPrefix.includes(substring)) {
                  pathPrefix = pathPrefix.substr(0, pathPrefix.indexOf('/'));
               }

               resp.result = { data: 'OK' };
               resp.json(resp);

            } else this.retErr(resp,'no post id')
         } else   this.retErr(resp,'')
      })

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
