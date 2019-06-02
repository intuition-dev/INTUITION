

import sqlite from 'sqlite'
import SQL from 'sql-template-strings';
import emailjs from 'emailjs-com'

// will need API

// guid for pk client side 
// eg: bcrypt randomBytes(16).toString("hex") or base64, or Math.random to make base64 char 16 times
// also to email a random # 

export class ADB {
   // emailjs is client side api
   db
   async createNewADBwSchema() { // the admin db is set to 'P@ssw0rd!' and you have to change it first time on DB create
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
