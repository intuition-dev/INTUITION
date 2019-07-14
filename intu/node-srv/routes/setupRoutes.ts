
import { BasePgRouter, ExpressRPC, iAuth } from 'mbake/lib/Serv'

import { Email } from '../lib/Email'
import { ADB } from '../lib/ADB'

export class SetupRoutes extends BasePgRouter {

    adbDB: ADB
    emailJs = new Email()
    
    constructor(db) {
        super()
       this.adbDB = db
    }

    setup(resp, params, email, password) {

    
       let emailjsService_id = params.emailjsService_id
       let emailjsTemplate_id = params.emailjsTemplate_id
       let emailjsUser_id = params.emailjsUser_id
    
 
          try {
             console.info('setup called ...');
             this.adbDB.setAdmin(email, password, emailjsService_id, emailjsTemplate_id, emailjsUser_id, 9081)
             console.info('db created  ...');
             let msg = 'Hi, your email and password are registered as login credentials for WebAdmin!';
             this.emailJs.send(email, emailjsService_id, emailjsTemplate_id, emailjsUser_id, msg);
          
             this.ret(resp, 'OK')
          } catch (err) {

            console.warn(err)
            this.retErr(resp, err)
        }
     
    
    }//()

  
}