
import { ADB } from './lib/ADB'
import { Email } from './lib/Email'

export class Setup {

adbDB: ADB
emailJs = new Email()


constructor(db) {
   this.adbDB = db
}

setup() { 
    
    const port = '9081' //init port
    this.adbDB.con() //connect to db
    let host// = [hostIP + port, config.cors]
  
 }//()

route(req, res) {
   const method = req.fields.method;
   let params = JSON.parse(req.fields.params)

   let email = params.email
   let password = params.password
   let emailjsService_id = params.emailjsService_id
   let emailjsTemplate_id = params.emailjsTemplate_id
   let emailjsUser_id = params.emailjsUser_id

   let resp: any = {}; // new response that will be set via the specific method passed
   if ('setup' == method) {
      resp.result = {}
      // res.send(resp)
      try {
         console.info('setup called ...');
         this.adbDB.setAdmin(email, password, emailjsService_id, emailjsTemplate_id, emailjsUser_id, 9081)
         console.info('db created  ...');
         let msg = 'Hi, your email and password are registered as login credentials for WebAdmin!';
         this.emailJs.send(email, emailjsService_id, emailjsTemplate_id, emailjsUser_id, msg);
         resp['result'] = 'OK'
         return res.json(resp)

      } catch (err) {
         console.warn(err)
         // next(err);
      }
   } else {
      return res.json(resp);
   }

}//()

}