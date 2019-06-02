

import sqlite from 'sqlite'
import SQL from 'sql-template-strings';

export class ADB {
   // emailjs is client side api
   db
   async createNewADBwSchema() {
      const dbPro = sqlite.open('./db/ADB.sqlite')
      this.db = await dbPro
      this.db.configure('busyTimeout', 2*1000)

   }

   isUserAuth(userEmail, pswd) {
      // run some code and:
      return 'editor'
   }


}

module.exports = {
   ADB
}
