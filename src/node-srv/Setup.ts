
import { IDB } from './lib/IDB'
import { Email } from 'mbake/lib/Email'
import { SetupHandler } from './handlers/setupHandler';
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

      const sr = new SetupHandler(this.db)
      this.app.routeRPC2('/setup', 'setup', sr.handleRPC2.bind(sr))

   }

}//class