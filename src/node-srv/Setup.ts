
import { IDB } from './lib/IDB'
import { Email } from 'mbake/lib/Email'
import { SetupRoutes } from './routes/setupRoutes';
import { IntuApp } from './IntuApp'
var path = require('path');
const dbName = 'IDB.sqlite';


export class Setup {

   db: IDB
   app: IntuApp
   emailJs = new Email()

   constructor(db, app) {
      this.db = db
      this.app = app
   }

   setup() {
      console.log('ok setup:')

      const sr = new SetupRoutes(this.db)
      this.app.handleRRoute('setup', 'setup', sr.route.bind(sr) )

   }

}//class