
import { BaseRPCMethodHandler } from 'mbake/lib/Serv'

import { Email } from 'mbake/lib/Email'
import { IDB } from '../lib/IDB'

export class SetupHandler extends BaseRPCMethodHandler {

    db: IDB
    emailJs = new Email()
    
    constructor(db) {
    super()
       this.db = db
    }
    
    
    // this could be moved to admin routes, and we remove setup routes
    async setup(resp, params) {
        let email = Buffer.from(params.email).toString('base64')
        let password = Buffer.from(params.password).toString('base64')

        let emailjsService_id = params.emailjsService_id
        let emailjsTemplate_id = params.emailjsTemplate_id
        let emailjsUser_id = params.emailjsUser_id        
        
        try {
            console.info('setup called ...');
            this.db.setAdmin(email, password, emailjsService_id, emailjsTemplate_id, emailjsUser_id, 9081)
            console.info('db created  ...');
            let msg = 'Hi, your email and password are registered as login credentials for WebAdmin!';
            this.emailJs.send(email, emailjsService_id, emailjsTemplate_id, emailjsUser_id, msg);
        
            this.ret(resp, 'OK', null, null)
        } catch (err) {

            console.warn(err)
            this.retErr(resp, err, null, null)
        }
     
    
    }//()

  
}