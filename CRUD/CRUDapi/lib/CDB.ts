
var sqlite3 = require('sqlite3').verbose()

// const fs = require('fs-extra')

/**
 * Example DB: to discuss topics
 */
export class CDB { 

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
       CDB.db.exec(`CREATE VIRTUAL TABLE TOPIC using fts4(
         guid varchar(36),
         name varchar(60),
         topics varchar(928)
         )`, function (err) { if (err)  console.log(err)
      })

      // insert one row for test
      let guid = '123'
      let name = 'victor'
      let topics = 'vic needs to do a code review of design; review other tasks in company; schedule vacation'

      const stmt =  await CDB.prep(`INSERT INTO TOPIC(guid, name, topics) VALUES( ?, ?, ?)`)
      await CDB.run(stmt, guid, name, topics )
      
      let sarg = 'vic' //searchable argument
      const qry =  CDB.db.prepare('SELECT * FROM TOPIC WHERE name MATCH ?')

      qry.all(sarg, function(err, rows){
         console.log(rows)
      })

   }//()

   // ////////////////////////////////
   static run(stmt, ...args):Promise<any> {
      return new Promise( function (resolve, reject) {
         stmt.run( args
            , function (err) {
               if (err) console.log(err)
               else console.log('ok2')
            })
      })
   }//()


   static prep(sql):Promise<any> {
      return new Promise( function (resolve, reject) {
         const stmt =  CDB.db.prepare( sql, function (err) {
            if (err) reject(err)
            else resolve(stmt)
         }) 
      })//pro
   }//()


}//()

module.exports = {
   CDB
}
