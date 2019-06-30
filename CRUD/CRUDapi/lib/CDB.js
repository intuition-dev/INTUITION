"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sqlite3 = require('sqlite3').verbose();
class CDB {
    static con() {
        if (CDB.db) {
            console.log('connection exists');
            return;
        }
        console.log('new connection');
        CDB.db = new sqlite3.Database('./CDB.sqlite');
    }
    static initSchema() {
        if (!(CDB.db)) {
            console.log('no connection made');
            CDB.con();
        }
        CDB.db.exec(`DROP TABLE IF EXISTS TOPIC`);
        CDB.db.exec(`CREATE VIRTUAL TABLE TOPIC using fts4(
         guid varchar(36),
         name varchar(60),
         topics varchar(928)
         )`, function (err) {
            if (err)
                console.log(err);
        });
        let guid = '123';
        let name = 'victor';
        let topics = 'vic needs to do a code review of design; review other tasks in company; schedule vacation';
        const pro1 = CDB.prep();
        pro1.then(function (stmt) {
            stmt.run(guid, name, topics, function (err) {
                if (err)
                    console.log(err);
                else
                    console.log('ok2');
            });
        });
        let sarg = 'vic';
        const qry = CDB.db.prepare('SELECT * FROM TOPIC WHERE name MATCH ?');
        qry.all(sarg, function (err, rows) {
            console.log(rows);
        });
    }
    static prep() {
        return new Promise(function (resolve, reject) {
            const stmt = CDB.db.prepare(`INSERT INTO TOPIC(guid, name, topics) 
               VALUES( ?, ?, ?)`, function (err) {
                if (err)
                    reject(err);
                else
                    resolve(stmt);
            });
        });
    }
}
exports.CDB = CDB;
module.exports = {
    CDB
};
