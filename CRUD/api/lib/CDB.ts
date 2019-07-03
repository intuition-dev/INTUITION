
const sqlite3 = require('sqlite3').verbose()
import { BaseDB } from 'mbake/lib/BaseDB'
const logger = require('tracer').console()

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

      // In this case we are not using normal SQL, but FTS! Likely you should use regular SQL. You should use a regular SQL table if you will not need FTS
       CDB.db.exec(`CREATE VIRTUAL TABLE TOPIC using fts5(
         guid UNINDEXED
         ,name 
         ,topics 
         )`, function (err) { if (err)  console.log(err)
      })

      // insert 2 rows for test
      let guid = 'cd12'
      let name = 'victor'
      let topics = 'vic needs to do a code review of design; review other tasks in company; schedule vacation'
      await this.insert( guid, name, topics )
      await this.insert('abc', 'tom', 'oops, nothing to talk about')
      
   }//()

   async insert(guid, name, topics) {
      const stmt =  CDB.db.prepare(`INSERT INTO TOPIC(guid, name, topics) VALUES( ?, ?, ?)`)
      await this._run(stmt, guid, name, topics )
   }


   async selectGUID(sarg:number) {
      logger.trace(sarg)
      const qry =  CDB.db.prepare('SELECT rowid, * FROM TOPIC WHERE guid = ?') 
      const rows = await this._qry(qry, sarg)
      logger.trace(rows)
      return rows
   }//()


   async selectROWID(sarg:number) {
      logger.trace(sarg)
      const qry =  CDB.db.prepare('SELECT rowid, * FROM TOPIC WHERE rowid = ?') 
      const rows = await this._qry(qry, sarg)
      logger.trace(rows)
      return rows
   }//()

   async select(sarg) {
      logger.trace(sarg)
      const qry =  CDB.db.prepare('SELECT rowid, rank, * FROM TOPIC WHERE TOPIC MATCH ? ORDER BY rank') 
      const rows = await this._qry(qry, sarg)
      logger.trace(rows)
      return rows
   }//()

   async selectAll() {
      const qry =  CDB.db.prepare('SELECT rowid, * FROM TOPIC ') 
      const rows = await this._qry(qry)
      logger.trace(rows)
      return rows
   }//()

}//class

module.exports = {
   CDB
}
