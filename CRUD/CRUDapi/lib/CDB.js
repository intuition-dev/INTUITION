"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite = require("sqlite");
const fs = require('fs-extra');
class CDB {
    static async con() {
        if (CDB.db) {
            console.log('connection exists');
            return;
        }
        CDB.db = await sqlite.open('./CDB.sqlite');
        CDB.db.pragma('cache_size = 32000');
        console.log(CDB.db.pragma('cache_size', { simple: true }));
    }
    static async initSchema() {
        if (!CDB.db) {
            console.log('no connection made');
            return;
        }
        await CDB.db.run(`CREATE VIRTUAL TABLE TOPICS USING fts4 (
          guid    VARCHAR(36) PRIMARY KEY NOT NULL
         , name   VARCHAR(60) NOT NULL 
         , topics VARCHAR(1024)
         , notindexed=guid
         , compress=zip, uncompress=unzip)
      )`);
        await CDB.db.run(`CREATE UNIQUE index 
         iname on TOPICS (name COLLATE NOCASE)
      )`);
        let guid = '123';
        let name = 'victor';
        let topics = 'needs to do a code review of design; review other tasks in company; schedule vacation';
        const stmt = await CDB.db.prepare(`INSERT INTO TOPICS(guid, name, topics) 
            VALUES( @guid, @name, @topics))`, function (err) {
            if (err) {
                console.log(err);
            }
        });
        await stmt.run({
            guid: guid,
            name: name,
            topics: topics
        });
        let sarg = 'vic';
        const qry = await CDB.db.prepare('SELECT * FROM TOPICS WHERE name MATCH @sarg');
        const results = qry.all({
            sarg: sarg
        });
        console.log(results);
    }
}
exports.CDB = CDB;
module.exports = {
    CDB
};
