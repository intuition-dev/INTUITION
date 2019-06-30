"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite3 = require('sqlite3').verbose();
const BaseDB_1 = require("mbake/lib/BaseDB");
class CDB extends BaseDB_1.BaseDB {
    static con() {
        if (CDB.db) {
            console.log('connection exists');
            return;
        }
        console.log('new connection');
        CDB.db = new sqlite3.Database('./CDB.sqlite');
    }
    static async initSchema() {
        if (!(CDB.db)) {
            console.log('no connection made');
            CDB.con();
        }
        CDB.db.exec(`DROP TABLE IF EXISTS TOPIC`);
        CDB.db.exec(`CREATE VIRTUAL TABLE TOPIC using fts5(
         guid ,
         name ,
         topics 
         )`, function (err) {
            if (err)
                console.log(err);
        });
        let guid = '123';
        let name = 'victor';
        let topics = 'vic needs to do a code review of design; review other tasks in company; schedule vacation';
        const stmt = CDB.db.prepare(`INSERT INTO TOPIC(guid, name, topics) VALUES( ?, ?, ?)`);
        await this.run(stmt, guid, name, topics);
        let sarg = 'victor';
        const qry = CDB.db.prepare('SELECT * FROM TOPIC WHERE TOPIC MATCH ? ');
        const rows = await this.qry(qry, sarg);
        console.log(rows);
    }
}
exports.CDB = CDB;
module.exports = {
    CDB
};
