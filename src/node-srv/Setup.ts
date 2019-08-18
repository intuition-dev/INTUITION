
import { IDB } from './lib/IDB'
import { Email } from 'mbake/lib/Email'
import { SetupRoutes } from './routes/setupRoutes';
import { IntuApp } from './IntuApp'


export class Setup {

   db: IDB
   app: IntuApp
   emailJs = new Email()

   constructor(db, app) {
      this.db = db
      this.app = app
   }

   setup() {

      const sr = new SetupRoutes(this.db)
      this.app.handleRRoute('setup', 'setup', sr.route.bind(sr) )

   }

}//class