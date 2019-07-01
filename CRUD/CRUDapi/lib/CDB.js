"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite3 = require('sqlite3').verbose();
const BaseDB_1 = require("mbake/lib/BaseDB");
const logger = require('tracer').console();
const fs = require('fs-extra');
class CDB extends BaseDB_1.BaseDB {
    dbExists() {
        return fs.existsSync('./CDB.sqlite');
    }
    con() {
        if (CDB.db) {
            console.log('connection exists');
            return;
        }
        console.log('new connection');
        CDB.db = new sqlite3.Database('./CDB.sqlite');
    }
    async init() {
        if (this.dbExists()) {
            this.con();
            return;
        }
        if (!(CDB.db)) {
            console.log('no connection made');
            this.con();
        }
        CDB.db.exec(`DROP TABLE IF EXISTS TOPIC`);
        CDB.db.exec(`CREATE VIRTUAL TABLE TOPIC using fts5(
         guid UNINDEXED
         ,name 
         ,topics 
         )`, function (err) {
            if (err)
                console.log(err);
        });
        let guid = 'cd12';
        let name = 'victor';
        let topics = 'vic needs to do a code review of design; review other tasks in company; schedule vacation';
        await this.insert(guid, name, topics);
        await this.insert('abc', 'tom', 'oops, nothing to talk about');
    }
    insert(guid, name, topics) {
        const stmt = CDB.db.prepare(`INSERT INTO TOPIC(guid, name, topics) VALUES( ?, ?, ?)`);
        this._run(stmt, guid, name, topics);
    }
    async select(sarg) {
        logger.trace(sarg);
        const qry = CDB.db.prepare('SELECT rowid, rank, * FROM TOPIC WHERE TOPIC MATCH ? ORDER BY rank');
        const rows = await this._qry(qry, sarg);
        logger.trace(rows);
        return rows;
    }
    async selectAll() {
        const qry = CDB.db.prepare('SELECT rowid, * FROM TOPIC ');
        const rows = await this._qry(qry);
        logger.trace(rows);
        return rows;
    }
}
exports.CDB = CDB;
module.exports = {
    CDB
};
