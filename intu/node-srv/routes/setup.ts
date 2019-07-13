
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


    setupApp(resp, params, user, pswd) {
        return this.iauth.auth(user, pswd, resp).then(async auth => {
           if (auth === 'admin') {
  
              let item = params.item
     
              console.log('-------res.locals', resp.locals.email)
              /**
               * this one only downloads the site and write the path of it to the db
               * happens only on CLICK INSTALL button on the settings page at admin
               *  */
              try {
                 var setupItem = ''
                 switch (item) {
                    case 'blog':
                       setupItem = 'CMS'
                       await new Download('CMS', path.join(__dirname, '../')).autoUZ()
                       break;
                    case 'shop':
                       setupItem = 'e-com'
                       console.log("TCL: AdminRoutes -> routes -> setupItem", setupItem)
  
                       // const shippingRoutes = new ShippingRoutes();
                       // adminApp.use('/', shippingRoutes.routes(appPort))
                       await new Download('SHOP', path.join(__dirname, '../')).autoUZ()
                       break;
                    case 'website':
                       setupItem = 'website'
                       await new Download('website', path.join(__dirname, '../')).autoUZ()
                       break;
                 }
  
                 //write path of new folder to the db
                 await this.adbDB.setAppPath(path.join(__dirname, '../' + setupItem))
                    
                    
              } catch (err) {
                 console.log('setup-app: ', err);
              }
  
           } else   this.retErr(resp,'')
  
        })
  
}