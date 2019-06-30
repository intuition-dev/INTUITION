
const sqlite3 = require('sqlite3').verbose()

import { BaseDB } from 'mbake/lib/BaseDB'

// const fs = require('fs-extra')

/**
 * Example DB: to discuss topics
 */
export class CDB extends BaseDB { 

   static db

   static  con() {
      if(CDB.db) {
         console.log('connection exists')
         return
      }

      console.log('new connection')
      CDB.db =  new sqlite3.Database('./CDB.sqlite')
   }
   
   static  async initSchema() {
      if(!(CDB.db)) {
         console.log('no connection made')
         CDB.con()
      }

      CDB.db.exec(`DROP TABLE IF EXISTS TOPIC`)

      // FTS
       CDB.db.exec(`CREATE VIRTUAL TABLE TOPIC using fts5(
         guid 
         ,name 
         ,topics 
         )`, function (err) { if (err)  console.log(err)
      })

      // insert one row for test
      let guid = '123'
      let name = 'victor'
      let topics = 'vic needs to do a code review of design; review other tasks in company; schedule vacation'

      const stmt =  CDB.db.prepare(`INSERT INTO TOPIC(guid, name, topics) VALUES( ?, ?, ?)`)
      await this.run(stmt, guid, name, topics )

      let sarg = 'victor' //searchable argument
      const qry =  CDB.db.prepare('SELECT * FROM TOPIC WHERE TOPIC MATCH ? ') 
      const rows = await this.qry(qry, sarg)
      console.log(rows)
      
   }//()


}//()

module.exports = {
   CDB
}
