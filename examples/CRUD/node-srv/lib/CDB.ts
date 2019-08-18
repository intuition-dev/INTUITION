
import { BaseDB } from 'mbake/lib/BaseDB'
const logger = require('tracer').console()


/**
 * Example CRUD DB: to discuss topics
 */
export class CDB extends BaseDB { // FTS support


   
   async init() {
      console.log('init')
      if(this.dbExists())  {
         // if db exists, connect an exit
            this.con()
         return
      }//fi
      if(!(this.db)) {
         console.log('no connection made')
         this.con()
      }//fi

      // In this case we are not using normal SQL, but FTS! Likely you should use regular SQL. You should use a regular SQL table if you will not need FTS
      const tstmt =  this.db.prepare(`CREATE VIRTUAL TABLE TOPIC using fts5(
         guid UNINDEXED
         ,name 
         ,topics 
         )`, function (err) { if (err)  console.log(err)
      })
      await this._run(tstmt)

      // insert 2 rows for test
      let guid = 'cd12'
      let name = 'victor'
      let topics = 'vic needs to do a code review of design; review other tasks in company; schedule vacation'
      await this.insert( guid, name, topics )
      await this.insert('abc', 'tom', 'oops, nothing to talk about')
      
   }//()

   async insert(guid, name, topics) {
      const stmt =  this.db.prepare(`INSERT INTO TOPIC(guid, name, topics) VALUES( ?, ?, ?)`)
      await this._run(stmt, guid, name, topics )
   }

   async selectGUID(sarg:number) {
      logger.trace(sarg)
      const qry =  this.db.prepare('SELECT rowid, * FROM TOPIC WHERE guid = ?') 
      const rows = await this._qry(qry, sarg)
      logger.trace(rows)
      return rows
   }//()

   async selectROWID(sarg:number) {
      logger.trace(sarg)
      const qry =  this.db.prepare('SELECT rowid, * FROM TOPIC WHERE rowid = ?') 
      const rows = await this._qry(qry, sarg)
      logger.trace(rows)
      return rows
   }//()

   async select(sarg) {
      logger.trace(sarg)
      const qry =  this.db.prepare('SELECT rowid, rank, * FROM TOPIC WHERE TOPIC MATCH ? ORDER BY rank') 
      const rows = await this._qry(qry, sarg)
      logger.trace(rows)
      return rows
   }//()

   async selectAll() {
      const qry =  this.db.prepare('SELECT rowid, * FROM TOPIC ') 
      const rows = await this._qry(qry)
      logger.trace(rows)
      return rows
   }//()

}//class

module.exports = {
   CDB
}
