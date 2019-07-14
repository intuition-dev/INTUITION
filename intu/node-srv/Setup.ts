
import { ADB } from './lib/ADB'
import { Email } from './lib/Email'
import { SetupRoutes } from './routes/setupRoutes';
import { IntuApp } from './IntuSrv'


export class Setup {

   db: ADB
   app: IntuApp
   emailJs = new Email()

   constructor(db, app) {
      this.db = db
      this.app = app
   }

   setup() {
      console.log('ok setup:')

      const sr = new SetupRoutes(this.db)
      this.app.handleRRoute('setup', 'setup', sr.route )

      // create db
      
      // open ../WWW/setup/

   }

}//class