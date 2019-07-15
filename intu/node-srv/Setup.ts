
import { ADB } from './lib/ADB'
import { Email } from './lib/Email'
import { SetupRoutes } from './routes/setupRoutes';
import { IntuApp } from './IntuSrv'
var path = require('path');
const dbName = 'ADB.sqlite';
const pathToDb = path.join(__dirname, dbName);


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
      this.app.handleRRoute('setup', 'setup', sr.route.bind(sr) )

      // create db
      
      // open ../WWW/setup/

      let _this = this
      //check if the file of database exist
      if (this.db.checkDB(pathToDb)) {
         this.db.connectToDbOnPort(pathToDb)
         //    .then(function (port) {
         //       runAdmin(port)
         //    })/
         console.log('Db exist');
      } else {
         console.log('open db and run setup')
         //create db file
         this.db.connectToDb(pathToDb)
         // this.db.openDB(pathToDb, runSetup)
      }

   }

}//class