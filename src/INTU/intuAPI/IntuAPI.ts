/**
 * 
 * All rights reserved by MetaBake (INTUITION.DEV), licensed under LGPL 3.0
 *
 */

declare let httpRPC: any

class IntuAPI {

   serviceRPC

   constructor() {
      var pro = window.location.protocol
      pro = pro.replace(':', '')
      var host = window.location.hostname
      var port = window.location.port

      this.serviceRPC = new httpRPC(pro, host, port)
      let email = window.sessionStorage.getItem('username');
      let pass = window.sessionStorage.getItem('password');
      if (email !== null && pass !== null) {
         this.serviceRPC.setUser(email, pass);
      }
   }//()

   /** editor users authentication
    * @param email user email, eg: 'example@example.com'
    * @param pass user password, eg: '123456'
    */
   checkEditor(email, pass) {
      let _this = this
      return this.serviceRPC.invoke('/api', 'editors', 'checkEditor', {
         editor_email: email,
         editor_pass: pass
      })
         .then(function (result) {
            console.log('check editor, result: ', result);
            if (result) {
               _this.serviceRPC.setUser(email, pass);
               return true
            } else {
               return false
            }
         })
   }


   getDirsList() {
      let email = window.sessionStorage.getItem('username');
      let pass = window.sessionStorage.getItem('password');
      return this.serviceRPC.invoke('/api', 'editors', 'getDirs', {
         editor_email: email,
         editor_pass: pass
      });
   }

   /**
    * get directories' subdirectories list
    * @param id path to post, eg: 'blog/post-2'
    */
   getSubDirsList(id) {
      let email = window.sessionStorage.getItem('username');
      let pass = window.sessionStorage.getItem('password');
      return this.serviceRPC.invoke('/api', 'editors', 'getFiles', {
         itemPath: id,
         editor_email: email,
         editor_pass: pass
      });
   }

   /**
    * get file content
    * @param id file name, eg: '/title.md'
    * @param pathPrefix path to file, eg: 'blog/post-4'
    */
   getFile(id, pathPrefix) {
      let email = window.sessionStorage.getItem('username');
      let pass = window.sessionStorage.getItem('password');
      return this.serviceRPC.invoke('/api', 'editors', 'getFileContent', {
         itemPath: id,
         file: pathPrefix,
         editor_email: email,
         editor_pass: pass
      });
   }

   /**
    * save file
    * @param id file name, eg: '/title.md'
    * @param md file content, eg: '###### Lorem ipsum dd dolor sit {.title}'
    * @param pathPrefix path to file, eg: 'blog/post-4'
    */
   saveFile(id, md, pathPrefix) {
      let email = window.sessionStorage.getItem('username');
      let pass = window.sessionStorage.getItem('password');
      return this.serviceRPC.invoke('/api', 'editors', 'saveFile', {
         itemPath: id,
         file: pathPrefix,
         content: btoa(md),
         editor_email: email,
         editor_pass: pass
      });
   }

   /**
    * run mbake to compile files
    * @param id file name, eg: '/title.md'
    * @param md file content, eg: '###### Lorem ipsum dd dolor sit {.title}'
    * @param pathPrefix path to file, eg: 'blog/post-4'
    */
   mbakeCompile(id, md, pathPrefix) {
      let email = window.sessionStorage.getItem('username');
      let pass = window.sessionStorage.getItem('password');
      return this.serviceRPC.invoke('/api', 'editors', 'compileCode', {
         itemPath: id,
         file: pathPrefix,
         content: btoa(md),
         editor_email: email,
         editor_pass: pass
      }).then(response => {
         return response;
      }).catch(error => {
         return error;
      });
   }

   /**
    * clone page
    * @param id new page folder name, eg: 'post-cpv'
    * @param pathPrefix path to file, eg: 'blog/post-4'
    */
   clonePage(id, pathPrefix) {
      let email = window.sessionStorage.getItem('username');
      let pass = window.sessionStorage.getItem('password');
      return this.serviceRPC.invoke('/api', 'editors', 'cloneItem', {
         newItemPath: id,
         itemPath: pathPrefix,
         editor_email: email,
         editor_pass: pass
      });
   }

   /**
    * set publishDate field to dat.yaml
    * @param publish_date epoch date format, eg: '1602288000'
    * @param pathPrefix post path file, eg: 'blog/post-4'
    */
   setPublishDate(publish_date, pathPrefix) {
      let email = window.sessionStorage.getItem('username');
      let pass = window.sessionStorage.getItem('password');
      return this.serviceRPC.invoke('/api', 'editors', 'setPublishDate', {
         publish_date: publish_date,
         itemPath: pathPrefix,
         editor_email: email,
         editor_pass: pass
      });
   }

   getINTUVersion() { }

   /**
    * editor send verification code
    * @param email editor user email, eg: 'example@example.com'
    */
   sendVcodEditor(email) {
      return this.serviceRPC.invoke('/api', 'editors', 'emailResetPasswordCode', { admin_email: email })
         .then(function () {
            return true;
         })
   }

   /**
    * editor reset password 
    * @param email admin user email, eg: 'example@example.com'
    * @param pass admin user password, eg: '123456'
    * @param code verification code, eg: '1234'
    */
   resetPassEditor(email, code, pass) {
      return this.serviceRPC.invoke('/api', 'editors', 'resetPasswordIfMatch', {
         admin_email: email,
         code: code,
         password: pass
      })
   }

   /**
    * admin authentication
    * @param email user email, eg: 'example@example.com'
    * @param pass user password, eg: '123456'
    */

   // rpc.invoke('api', 'pageOne', 'multiply', {a:5, b:2})
   checkAdmin(email, pass) {
      let _this = this
      return this.serviceRPC.invoke('/admin', 'admin', 'checkAdmin', {
         admin_email: email,
         admin_pass: pass
      })
         .then(function (result) {
            console.log("TCL: IntuAPI -> checkAdmin -> result", result)
            if (result == 'OK') {
               _this.serviceRPC.setUser(email, pass);
               return true
            } else {
               return false
            }
         })
   }

   /**
    * set up starter application type
    * @param item item, eg: 'blog'
    */
   setupApp(item) {
      let admin_email = window.sessionStorage.getItem('username');
      let admin_pass = window.sessionStorage.getItem('password');
      return this.serviceRPC.invoke('/api', 'admin', 'setup-app', {
         item: item,
         admin_email: admin_email,
         admin_pass: admin_pass
      });
   }

   getEditorsList() {
      let admin_email = window.sessionStorage.getItem('username');
      let admin_pass = window.sessionStorage.getItem('password');

      return this.serviceRPC.invoke('/admin', 'admin', 'getEditors', {
         admin_email: admin_email,
         admin_pass: admin_pass
      });
   }

   /**
    * add new user
    * @param name new user name, eg: 'Jane Doe'
    * @param email new user email, eg: 'example@example.com'
    * @param password new user password
    */
   addEditor(guid, name, email, password) {
      let admin_email = window.sessionStorage.getItem('username');
      let admin_pass = window.sessionStorage.getItem('password');
      return this.serviceRPC.invoke('/admin', 'admin', 'addEditor', {
         id: guid,
         name: name,
         email: email,
         password: password,
         admin_email: admin_email,
         admin_pass: admin_pass
      });
   }

   /**
    * edit user name
    * @param uid user id, eg: 'I3fE7p5NjtV1Y1m5pWBsZlyi4W62'
    * @param name user name, eg: 'Jane Doe'
    */
   editEditor(uid, name) {
      return this.serviceRPC.invoke('/admin', 'admin', 'editEditor', {
         name: name,
         uid: uid,
         admin_email: window.sessionStorage.getItem('username'),
         admin_pass: window.sessionStorage.getItem('password')
      });
   }

   /**
    * remove user 
    * @param uid user id, eg: 'I3fE7p5NjtV1Y1m5pWBsZlyi4W62'
    */
   deleteEditor(uid) {
      return this.serviceRPC.invoke('/admin', 'admin', 'deleteEditor', {
         uid: uid,
         admin_email: window.sessionStorage.getItem('username'),
         admin_pass: window.sessionStorage.getItem('password')
      });
   }

   getConfig() {
      let admin_email = window.sessionStorage.getItem('username');
      let admin_pass = window.sessionStorage.getItem('password');
      return this.serviceRPC.invoke('/admin', 'admin', 'getConfig', {
         admin_email: admin_email,
         admin_pass: admin_pass
      });
   }

   /**
    * 
    * 
    */
   updateConfig(emailjsService_id, emailjsTemplate_id, emailjsUser_id) {
      let admin_email = window.sessionStorage.getItem('username');
      let admin_pass = window.sessionStorage.getItem('password');
      return this.serviceRPC.invoke('/admin', 'admin', 'updateConfig', {
         admin_email: admin_email,
         admin_pass: admin_pass,
         emailjsService_id: emailjsService_id,
         emailjsTemplate_id: emailjsTemplate_id,
         emailjsUser_id: emailjsUser_id
      });
   }

}//class
