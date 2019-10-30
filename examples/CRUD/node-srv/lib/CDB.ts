
import { BaseDB, iDB } from 'mbake/lib/BaseDB'
const bunyan = require('bunyan')
const bformat = require('bunyan-format')  
const formatOut = bformat({ outputMode: 'short' })
const log = bunyan.createLogger({src: true, stream: formatOut, name: "class name"})

/**
 * Example CRUD DB: to discuss topics
 */
export class CDB extends BaseDB implements iDB { // FTS support

   constructor(path, fn) {
      super(path, fn)
      this.con()
   }

   async isSetupDone():Promise<boolean> {
      this.con()

      console.log('init')
      let exists = await this.tableExists('TOPIC')

      if(exists)  {
            log.info('exists')
         return
      }//fi


      log.info('new')
      this.con()
  
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
      log.info('###############################################################################################################')
   
   }//()

   
   async insert(guid, name, topics) {
      const stmt =  this.db.prepare(`INSERT INTO TOPIC(guid, name, topics) VALUES( ?, ?, ?)`)
      await this._run(stmt, guid, name, topics )
   }

   async selectGUID(sarg:number) {
      log.info(sarg)
      const qry =  this.db.prepare('SELECT rowid, * FROM TOPIC WHERE guid = ?') 
      const rows = await this._qry(qry, sarg)
      log.info(rows)
      return rows
   }//()

   async selectROWID(sarg:number) {
      log.info(sarg)
      const qry =  this.db.prepare('SELECT rowid, * FROM TOPIC WHERE rowid = ?') 
      const rows = await this._qry(qry, sarg)
      log.info(rows)
      return rows
   }//()

   async select(sarg) {
      log.info(sarg)
      const qry =  this.db.prepare('SELECT rowid, rank, * FROM TOPIC WHERE TOPIC MATCH ? ORDER BY rank') 
      const rows = await this._qry(qry, sarg)
      log.info(rows)
      return rows
   }//()

   async selectAll() {
      const qry =  this.db.prepare('SELECT rowid, * FROM TOPIC ') 
      const rows = await this._qry(qry)
      log.info(rows)
      return rows
   }//()

}//class

module.exports = {
   CDB
}
