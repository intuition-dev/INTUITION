import { MBake } from 'mbake/lib/Base';

import { Email } from '../lib/Email';
import { BasePgRouter, iAuth } from 'mbake/lib/Serv'
import { ADB } from '../lib/ADB';
import { EditorAuth } from '../lib/EditorAuth';
import { FileMethods } from 'mbake/lib/FileOpsExtra'
import { FileOps, Dirs, Dat } from 'mbake/lib/FileOpsBase'


const fs = require('fs-extra')
const path = require('path')

export class EditorRoutes extends BasePgRouter {

   emailJs = new Email()

   adbDB: ADB;
   iauth: iAuth;
   fileMethod: FileMethods

   mountPath


   constructor(adbDB) {
      super();
      this.adbDB = adbDB
      this.iauth = new EditorAuth(adbDB)
      this.fileMethod = new FileMethods();
   }


   resetPasswordCode(resp, params, user, pswd) {
      let email = params.admin_email;
      resp.result = {};

      try {
         return this.adbDB.setVcodeEditor(email)
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
                     resp.result = true;
                     return resp.json(resp);
                  });
            })
      } catch (err) {
         this.retErr(resp, err)
      }

   }//()
      
   resetPassword(resp, params, user, pswd) {
      resp.result = {};
      let email = params.admin_email;

      return this.adbDB.resetPasswordEditor(email, params.code, params.password)
         .then(result => {
            resp.result = result;
            return resp.json(resp);
         })
   } 
      
   checkEditor(resp, params, user, pswd) {

      return this.iauth.auth(user, pswd, resp).then(auth => {
         if (auth === 'admin' || auth === 'editor') {

            resp.result = true;
            return resp.json(resp);

         } else  this.retErr(resp,'no post id')

      })

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

      } 
      
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

      } 
      
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
            
         });

      }
      
      mbakeVersion(resp, params, user, pswd) {

         let result = this.adbDB.veri()
         this.ret(resp, result)
         
      }//()


}//

module.exports = {
   EditorRoutes
}
