import { MBake, Ver } from 'mbake/lib/Base';

import { Dat, FileOps, Dirs } from 'mbake/lib/FileOpsBase'
import { CSV2Json } from 'mbake/lib/FileOpsExtra';
import { Email } from '../Email';
import { BasePgRouter, ExpressRPC, iAuth } from 'mbake/lib/Serv'
import { ADB } from '../ADB';
import { Auth } from '../Auth';
import { FileMethods } from 'mbake/lib/FileOpsExtra'

const fs = require('fs-extra')
const path = require('path')

export class EditorRoutes extends BasePgRouter {

   emailJs = new Email()

   appE: ExpressRPC
   adbDB: ADB;
   iauth: iAuth;
   fileMethod: FileMethods;

   constructor(appE, adbDB) {
      super();
      this.appE = appE
      this.adbDB = adbDB
      this.iauth = new Auth(appE, adbDB);
      this.fileMethod = new FileMethods();
   }

   ROUTES = (req, res, ) => {

      let mountPath = '';

      const user = req.fields.user
      const pswd = req.fields.pswd

      const method = req.fields.method
      const params = JSON.parse(req.fields.params)
      const resp: any = {}

      console.log('method ---------> ', method);

      if (method === 'reset-password-code') {
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
                        return res.json(resp);
                     });
               })
         } catch (err) {
            return res.json(resp);
         }

      } else if (method === 'reset-password') {
         resp.result = {};
         let email = params.admin_email;

         return this.adbDB.resetPasswordEditor(email, params.code, params.password)
            .then(result => {
               resp.result = result;
               return res.json(resp);
            })
      } else if (method === 'check-editor') {
         let user = Buffer.from(params.editor_email).toString('base64');
         let pswd = Buffer.from(params.editor_pass).toString('base64');

         return this.iauth.auth(user, pswd, res).then(auth => {
            if (auth === 'admin' || auth === 'editor') {

               resp.result = true;
               return res.json(resp);

            } else {
               resp.errorLevel = -1
               resp.errorMessage = 'mismatch'
               res.json(resp)
            }

         });

      } else if (method === 'get-items') { // get dirs list

         return this.iauth.auth(user, pswd, res).then(auth => {
            if (auth === 'admin' || auth === 'editor') {

               mountPath = res.locals.mountPath;
               resp.result = this.fileMethod.getDirs(mountPath);
               res.json(resp);
               
            } else {
               resp.errorLevel = -1
               resp.errorMessage = 'mismatch'
               res.json(resp)
            }
         });


      } else if (method === 'get-files') { // get sub files in directory

         return this.iauth.auth(user, pswd, res).then(auth => {
            if (auth === 'admin' || auth === 'editor') {

               mountPath = res.locals.mountPath;
               let post_id = '/' + params.post_id;
               
               if (typeof post_id !== 'undefined') {
                  
                  resp.result = this.fileMethod.getFiles(mountPath, post_id);
                  res.json(resp);

               } else {
                  res.status(400);
                  resp.result = { error: 'no post_id' };
                  res.json(resp);
               }

            } else {
               resp.errorLevel = -1
               resp.errorMessage = 'mismatch'
               res.json(resp)
            }
         });

      } else if (method === 'get-file-content') { // get .md/.yaml/.csv/.pug/.css file 

         return this.iauth.auth(user, pswd, res).then(auth => {
            if (auth === 'admin' || auth === 'editor') {

               mountPath = res.locals.mountPath;
               let post_id = params.post_id;
               let pathPrefix = params.pathPrefix;

               if (typeof post_id !== 'undefined') {

                  let md = mountPath + '/' + pathPrefix + post_id;
                  let original_post_id = post_id.replace(/\.+\d+$/, "");
                  let fileExt = path.extname(original_post_id);

                  if (fs.existsSync(md) && (fileExt === '.md' || fileExt === '.yaml' || fileExt === '.csv' || fileExt === '.pug' || fileExt === '.css')) {
                     fs.readFile(md, 'utf8', (err, data) => {
                        if (err) throw err;
                        resp.result = data;
                        res.json(resp);
                     });
                  } else {
                     throw "Unknown file type!"
                  }
               } else {
                  res.status(400);
                  resp.result = { error: 'no post_id' };
                  res.json(resp);
               }

            } else {
               resp.errorLevel = -1
               resp.errorMessage = 'mismatch'
               res.json(resp)
            }
         });

      } else if (method === 'save-file') { // update .md/.yaml/.csv/.pug/.css file and add archived files

         return this.iauth.auth(user, pswd, res).then(auth => {
            if (auth === 'admin' || auth === 'editor') {

               mountPath = res.locals.mountPath;
               let post_id = params.post_id;
               let pathPrefix = params.pathPrefix;
               let content = params.content;
               content = Buffer.from(content, 'base64');

               if (typeof post_id !== 'undefined') {

                  let md = '/' + pathPrefix + post_id;

                  let fileOps = new FileOps(mountPath);
                  fileOps.write(md, content);

                  let dirCont = new Dirs(mountPath);
                  let substring = '/';

                  // add /archive
                  let checkDat = dirCont.getInDir('/' + pathPrefix).filter(file => file.endsWith('dat.yaml'));
                  if (checkDat.length > 0) {
                     const archivePath = '/' + pathPrefix + '/archive';
                     if (!fs.existsSync(mountPath + archivePath)) {
                        fs.mkdirSync(mountPath + archivePath);
                     }

                     let archiveFileOps = new FileOps(mountPath + archivePath);

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
                  res.json(resp);

               } else {
                  res.status(400);
                  resp.result = { error: 'no post_id' };
                  res.json(resp);
               }
            } else {
               resp.errorLevel = -1
               resp.errorMessage = 'mismatch'
               res.json(resp)
            }
         });

      } else if (method === 'compile-code') { // build/compile mbake

         return this.iauth.auth(user, pswd, res).then(auth => {
            if (auth === 'admin' || auth === 'editor') {

               mountPath = res.locals.mountPath;
               let post_id = params.post_id;
               let pathPrefix = params.pathPrefix;

               if (typeof post_id !== 'undefined') {

                  let runMbake = new MBake();
                  let dirCont = new Dirs(mountPath);

                  let checkCsv = dirCont.getInDir('/' + pathPrefix).filter(file => file.endsWith('.csv'));
                  if (checkCsv.length > 0) {
                     let compileCsv = new CSV2Json(mountPath + '/' + pathPrefix);
                     compileCsv.convert();
                  }

                  let checkDat_i = dirCont.getInDir('/' + pathPrefix).filter(file => file.endsWith('dat_i.yaml'));

                  //need to check what type of file is currently saving and run function based on it, eg: itemizeNbake, or comps
                  if (checkDat_i.length > 0) {
                     // this is for yaml
                     runMbake.itemizeNBake(mountPath + '/' + pathPrefix, 3)
                        .then(response => {
                              resp.result = { data: 'OK' };
                              res.json(resp);
                           }, error => {
                              resp.result = { data: error };
                              res.json(resp);
                           })
                  } else {
                     // TODO: When do we to do components? Why not just bake? md right.
                     runMbake.compsNBake(mountPath, 3).then(response => {
                        resp.result = { data: 'OK' };
                        res.json(resp);
                     }, error => {
                        resp.result = { data: error };
                        res.json(resp);
                     })
                  }

               } else {
                  res.status(400);
                  resp.result = { error: 'no post_id' };
                  res.json(resp);
               }

            } else {
               resp.errorLevel = -1
               resp.errorMessage = 'mismatch'
               res.json(resp)
            }
         });

      } else if (method === 'clone-page') { //clone page

         return this.iauth.auth(user, pswd, res).then(auth => {
            if (auth === 'admin' || auth === 'editor') {

               mountPath = res.locals.mountPath;
               let post_id = params.post_id;
               let pathPrefix = params.pathPrefix;

               if (typeof post_id !== 'undefined'
                  && typeof pathPrefix !== 'undefined'
               ) {
                  // create new post folder
                  let postPath = mountPath + '/' + pathPrefix;
                  let substring = '/';
                  let newPost = '';
                  if (pathPrefix.includes(substring)) {
                     pathPrefix = pathPrefix.substr(0, pathPrefix.indexOf('/'));
                     newPost = mountPath + '/' + pathPrefix + '/' + post_id;
                  } else {
                     newPost = mountPath + '/' + post_id;
                  }
                  let fileOps = new FileOps('/');
                  fileOps.clone(postPath, newPost);

                  resp.result = { data: 'OK' };
                  res.json(resp);
               } else {
                  res.status(400);
                  resp.result = { error: 'error creating a post' };
                  res.json(resp);
               }

            } else {
               resp.errorLevel = -1
               resp.errorMessage = 'mismatch'
               res.json(resp)
            }
         });

      } else if (method === 'upload') { // file upload

         return this.iauth.auth(user, pswd, res).then(auth => {
            if (auth === 'admin' || auth === 'editor') {

               mountPath = res.locals.mountPath;
               let uploadPath;
               let pathPrefix = params.pathPrefix;

               if (Object.keys(req.files).length == 0) {
                  res.status(400);
                  resp.result = { error: 'no file was uploaded' };
                  return res.json(resp);
               }

               // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
               let sampleFile = req.files.sampleFile;
               uploadPath = mountPath + '/' + pathPrefix + '/' + sampleFile.name;

               // console.log('UPLOAD', uploadPath, sampleFile.path);
               fs.rename(sampleFile.path, uploadPath, err => {
                  if (err) throw err;

                  resp.result = { data: 'File uploaded!' };
                  res.json(resp);
               });

            } else {
               resp.errorLevel = -1
               resp.errorMessage = 'mismatch'
               res.json(resp)
            }
         });

      } else if (method === 'set-publish-date') { // set publish date

         return this.iauth.auth(user, pswd, res).then(auth => {
            if (auth === 'admin' || auth === 'editor') {
               
               mountPath = res.locals.mountPath;
               let post_id = params.post_id;
               let publish_date = params.publish_date;
               if (typeof post_id !== 'undefined') {
                  let datYaml = new Dat(mountPath + '/' + post_id);
                  datYaml.set('publishDate', publish_date);
                  datYaml.write();
                  let runMbake = new MBake();
                  let postsFolder = post_id.substr(0, post_id.indexOf('/'));
                  let pro: Promise<string> = runMbake.itemizeNBake(mountPath + '/' + postsFolder, 3);
                  resp.result = { data: 'OK' };
                  res.json(resp);
               } else {
                  res.status(400);
                  resp.result = { error: 'no post_id' };
                  res.json(resp);
               }

            } else {
               resp.errorLevel = -1
               resp.errorMessage = 'mismatch'
               res.json(resp)
            }
         });

      } else if (method === 'mbake-version') {

         resp.result = Ver.ver();
         res.json(resp);

      };

      resp.errorLevel = -1;
      resp.errorMessage = 'mismatch';
      res.json(resp);
   }

}

module.exports = {
   EditorRoutes
}
