/**
 * 
 * All rights reserved by MetaBake (MetaBake.org), licensed under LGPL 3.0
 *
 */

/**
 * CRUD users for admin app and files operations for editor app
 */
class IntuAPI {

   /**
    * @param apiProtocol api protocol (eg: http)
    * @param apiHost api host (eg: 0.0.0.0)
    * @param apiPort api port (eg: 9081)
    */
   constructor() {
      console.log("TCL: IntuAPI -> constructor -> apiPort", apiPort)
      this.serviceRPC = new httpRPC(apiProtocol, apiHost, typeof apiPort != 'undefined' ? apiPort : "");
   }

   /**
    ********************* EDITOR APP REQUESTS ************************
    */

   /** editor users authentication
    * @param email user email, eg: 'example@example.com'
    * @param pass user password, eg: '123456'
    */
   checkEditor(email, pass) {
      let _this = this
      return this.serviceRPC.invoke('api', 'editors', 'check-editor', {
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

   /**
    * get list of directories
    * @param email user email, eg: 'example@example.com'
    * @param pass user password, eg: '123456'
    */
   getDirsList() {
      let email = window.sessionStorage.getItem('username');
      let pass = window.sessionStorage.getItem('password');
      return this.serviceRPC.invoke('api', 'editors', 'get-items', {
         editor_email: email,
         editor_pass: pass
      });
   }

   /**
    * get directories' subdirectories list
    * @param id path to post, eg: 'blog/post-2'
    * @param email user email, eg: 'example@example.com'
    * @param pass user password, eg: '123456'
    */
   getSubDirsList(id) {
      let email = window.sessionStorage.getItem('username');
      let pass = window.sessionStorage.getItem('password');
      return this.serviceRPC.invoke('api', 'editors' , 'get-files', {
         post_id: id,
         editor_email: email,
         editor_pass: pass
      });
   }

   /**
    * get file content
    * @param id file name, eg: '/title.md'
    * @param pathPrefix path to file, eg: 'blog/post-4'
    * @param email user email, eg: 'example@example.com'
    * @param pass user password, eg: '123456'
    */
   getFile(id, pathPrefix) {
      let email = window.sessionStorage.getItem('username');
      let pass = window.sessionStorage.getItem('password');
      return this.serviceRPC.invoke('api', 'editors', 'get-file-content', {
         post_id: id,
         pathPrefix: pathPrefix,
         editor_email: email,
         editor_pass: pass
      });
   }

   /**
    * save file
    * @param id file name, eg: '/title.md'
    * @param md file content, eg: '###### Lorem ipsum dd dolor sit {.title}'
    * @param pathPrefix path to file, eg: 'blog/post-4'
    * @param email user email, eg: 'example@example.com'
    * @param pass user password, eg: '123456'
    */
   saveFile(id, md, pathPrefix) {
      let email = window.sessionStorage.getItem('username');
      let pass = window.sessionStorage.getItem('password');
      return this.serviceRPC.invoke('api', 'editors', 'save-file', {
         post_id: id,
         pathPrefix: pathPrefix,
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
    * @param email user email, eg: 'example@example.com'
    * @param pass user password, eg: '123456'
    */
   mbakeCompile(id, md, pathPrefix) {
      let email = window.sessionStorage.getItem('username');
      let pass = window.sessionStorage.getItem('password');
      return this.serviceRPC.invoke('api', 'editors', 'compile-code', {
         post_id: id,
         pathPrefix: pathPrefix,
         content: btoa(md),
         editor_email: email,
         editor_pass: pass
      }).then(function (response) {
         return response;
      }).catch(function (error) {
         return error;
      });
   }

   /**
    * clone page
    * @param id new page folder name, eg: 'post-cpv'
    * @param pathPrefix path to file, eg: 'blog/post-4'
    * @param email user email, eg: 'example@example.com'
    * @param pass user password, eg: '123456'
    */
   clonePage(id, pathPrefix) {
      let email = window.sessionStorage.getItem('username');
      let pass = window.sessionStorage.getItem('password');
      return this.serviceRPC.invoke('api', 'editors', 'clone-page', {
         post_id: id,
         pathPrefix: pathPrefix,
         editor_email: email,
         editor_pass: pass
      });
   }

   /**
    * file upload
    * @param data FormData
    * @param pathPrefix path to file, eg: 'blog/post-4'
    * @param email user email, eg: 'example@example.com'
    * @param pass user password, eg: '123456'
    */
   upload(data, pathPrefix) {
      let email = window.sessionStorage.getItem('username');
      let pass = window.sessionStorage.getItem('password');
      return this.serviceRPC.invoke('api', 'editors', 'upload', {
         pathPrefix: pathPrefix,
         editor_email: email,
         editor_pass: pass
      }, data.get('sampleFile'))
         .then(function (response) {
            console.info(response);
         })
         .catch(function (error) {
            console.info(error);
         });
   }

   /**
    * set publishDate field to dat.yaml
    * @param publish_date epoch date format, eg: '1602288000'
    * @param pathPrefix post path file, eg: 'blog/post-4'
    * @param email user email, eg: 'example@example.com'
    * @param pass user password, eg: '123456'
    */
   setPublishDate(publish_date, pathPrefix) {
      let email = window.sessionStorage.getItem('username');
      let pass = window.sessionStorage.getItem('password');
      return this.serviceRPC.invoke('api', 'editors', 'set-publish-date', {
         publish_date: publish_date,
         post_id: pathPrefix,
         editor_email: email,
         editor_pass: pass
      });
   }

   /**
    * get mbake version
    * @param email user email, eg: 'example@example.com'
    * @param pass user password, eg: '123456'
    */
   getMbakeVersion() {
      let email = window.sessionStorage.getItem('username');
      let pass = window.sessionStorage.getItem('password');
      return this.serviceRPC.invoke('api', 'editors',  'mbake-version', {
            editor_email: email,
            editor_pass: pass
         })
         .then(function (response) {
            console.info('Base.js mbake version:', response);
         });
   }

   /**
    * editor send verification code
    * @param email editor user email, eg: 'example@example.com'
    */
   sendVcodEditor(email) {
      return this.serviceRPC.invoke('api', 'editors', 'reset-password-code', { admin_email: email })
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
      return this.serviceRPC.invoke('api', 'editors', 'reset-password', {
         admin_email: email,
         code: code,
         password: pass
      })
   }


   /**
    ********************* ADMIN APP REQUESTS ************************
    */

   /**
    * admin authentication
    * @param email user email, eg: 'example@example.com'
    * @param pass user password, eg: '123456'
    */
   checkAdmin(email, pass) {
      let _this = this
      return this.serviceRPC.invoke('api','admin',  'checkAdmin', {
         admin_email: email,
         admin_pass: pass
      })
         .then(function (result) {
            console.info("--result:", result)
            if (result) {
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
    * @param admin_email admin user email, eg: 'example@example.com'
    * @param admin_pass admin user password, eg: '123456'
    */
   setupApp(item) {
      let admin_email = window.sessionStorage.getItem('username');
      let admin_pass = window.sessionStorage.getItem('password');
      return this.serviceRPC.invoke('api', 'admin', 'setup-app', {
         item: item,
         admin_email: admin_email,
         admin_pass: admin_pass
      });
   }

   /**
    * get data for editors table
    * @param admin_email admin user email, eg: 'example@example.com'
    * @param admin_pass admin user password, eg: '123456'
    */
   getEditorsList() {
      let admin_email = window.sessionStorage.getItem('username');
      let admin_pass = window.sessionStorage.getItem('password');
      console.info("--admin_email:", admin_email)
      return this.serviceRPC.invoke('api', 'admin', 'editors', {
         admin_email: admin_email,
         admin_pass: admin_pass
      });
   }

   /**
    * add new user
    * @param name new user name, eg: 'Jane Doe'
    * @param email new user email, eg: 'example@example.com'
    * @param password new user password, eg: 'dfgsdgdsfg' 
    * @param admin_email admin user email, eg: 'example@example.com'
    * @param admin_pass admin user password, eg: '123456'
    */
   addEditor(name, email, password) {
      let admin_email = window.sessionStorage.getItem('username');
      let admin_pass = window.sessionStorage.getItem('password');
      return this.serviceRPC.invoke('api', 'admin', 'editors-add', {
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
    * @param admin_email admin user email, eg: 'example@example.com'
    * @param admin_pass admin user password, eg: '123456'
    */
   editEditor(uid, name) {
      return this.serviceRPC.invoke('api', 'admin', 'editors-edit', {
         name: name,
         uid: uid,
         admin_email: window.sessionStorage.getItem('username'),
         admin_pass: window.sessionStorage.getItem('password')
      });
   }

   /**
    * remove user 
    * @param uid user id, eg: 'I3fE7p5NjtV1Y1m5pWBsZlyi4W62'
    * @param admin_email admin user email, eg: 'example@example.com'
    * @param admin_pass admin user password, eg: '123456'
    */
   deleteEditor(uid) {
      return this.serviceRPC.invoke('api', 'admin', 'editors-delete', {
         uid: uid,
         admin_email: window.sessionStorage.getItem('username'),
         admin_pass: window.sessionStorage.getItem('password')
      });
   }

   /**
    * admin send verification code 
    * @param email admin user email, eg: 'example@example.com'
    */
   sendVcode(email) {
      return this.serviceRPC.invoke('api', 'admin', 'resetPassword-code', { admin_email: email })
         .then(function () {
            return true;
         })
   }

   /**
    * admin reset password 
    * @param email admin user email, eg: 'example@example.com'
    * @param pass admin user password, eg: '123456'
    * @param code verification code, eg: '1234'
    */
   resetPass(email, code, pass) {
      return this.serviceRPC.invoke('admin', 'admin', 'reset-password', {
         admin_email: email,
         code: code,
         password: pass
      })
   }

   /**
    * get config files 
    * @param admin_email admin user email, eg: 'example@example.com'
    * @param admin_pass admin user password, eg: '123456'
    */
   getConfig() {
      let admin_email = window.sessionStorage.getItem('username');
      let admin_pass = window.sessionStorage.getItem('password');
      return this.serviceRPC.invoke('api', 'admin', 'get-config', {
         admin_email: admin_email,
         admin_pass: admin_pass
      });
   }

   /**
    * update config files 
    * @param admin_email admin user email, eg: 'example@example.com'
    * @param admin_pass admin user password, eg: '123456'
    */
   updateConfig(port, path, printfulApi) {
      let admin_email = window.sessionStorage.getItem('username');
      let admin_pass = window.sessionStorage.getItem('password');
      return this.serviceRPC.invoke('api', 'admin', 'update-config', {
         admin_email: admin_email,
         admin_pass: admin_pass,
         port: port,
         path: path,
         printfulApi: printfulApi.length ? printfulApi : ''
      });
   }

   createConfig(serialised) {

      var email = serialised.filter(email => email.name == 'email')[0].value
      var password = serialised.filter(password => password.name == 'password')[0].value
      var emailjsService_id = serialised.filter(emailjsService_id => emailjsService_id.name == 'service_id')[0].value
      var emailjsTemplate_id = serialised.filter(emailjsTemplate_id => emailjsTemplate_id.name == 'template_id')[0].value
      var emailjsUser_id = serialised.filter(emailjsUser_id => emailjsUser_id.name == 'user_id')[0].value
      return this.serviceRPC.invoke('setup', 'setup', 'setup', {
            email: email,
            password: password,
            emailjsService_id: emailjsService_id,
            emailjsTemplate_id: emailjsTemplate_id,
            emailjsUser_id: emailjsUser_id,
         })
         .then((result) => {
            console.info('test api: ', result);
            return result;
         }).catch((error) => {
            console.info("--error:", error)
         })
   }

}
