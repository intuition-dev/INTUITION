
const sqlite3 = require('sqlite3').verbose()
import { BaseDB } from 'mbake/lib/BaseDB'

const fs = require('fs-extra')

/**
 * Example CRUD DB: to discuss topics
 */
export class CDB extends BaseDB { 

   static db

   /* if DB does not exists, create it */
   dbExists() {
      return fs.existsSync('./CDB.sqlite')
   }

   con() {
      if(CDB.db) {
         console.log('connection exists')
         return
      }
      console.log('new connection')
      CDB.db =  new sqlite3.Database('./CDB.sqlite')
   }
   
   async init() {
      if(this.dbExists())  {
         // if db exists, connect an exit
            this.con()
         return
      }//fi
      if(!(CDB.db)) {
         console.log('no connection made')
         this.con()
      }//fi

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
      await this._run(stmt, guid, name, topics )

      let sarg = 'victor' //searchable argument
      const qry =  CDB.db.prepare('SELECT * FROM TOPIC WHERE TOPIC MATCH ? ') 
      const rows = await this._qry(qry, sarg)
      console.log(rows)
      
   }//()

   insert(guid, name, topics) {
      const stmt =  CDB.db.prepare(`INSERT INTO TOPIC(guid, name, topics) VALUES( ?, ?, ?)`)
      this._run(stmt, guid, name, topics )
   }

   async select() {
      let sarg = 'victor' //searchable argument
      const qry =  CDB.db.prepare('SELECT * FROM TOPIC WHERE TOPIC MATCH ? ') 
      const rows = await this._qry(qry, sarg)
      return rows
   }//()

}//class

module.exports = {
   CDB
}
