const sqlite3 = require('sqlite3').verbose()
const fs = require('fs-extra')

import { BaseDB } from 'mbake/lib/BaseDB'

export class SDB extends BaseDB {

    async init(): Promise<any> {
  
        if (!(this.db)) {
            console.log('no connection made')
            this.con()
        }//fi

        return Promise.all([
            this._run(this.db.prepare(`CREATE TABLE SESSIONS(sessionId, paymentIntent, address, items)`)), // single row in table
        ]).then(() => {
            console.log('all tables created')
        })
    }

    async saveSession(sessionId, paymentIntent, address, items): Promise<any> {
        const stmt2 = this.db.prepare(`INSERT INTO SESSIONS  (sessionId, paymentIntent, address, items) VALUES(?,?,?,?)`);
        this._run(stmt2, sessionId, paymentIntent, JSON.stringify(address), JSON.stringify(items));
    }

    async fetchSession(sessionId): Promise<any> {
        const stmt2 = this.db.prepare(`SELECT * FROM SESSIONS WHERE sessionId=?`);
        const rows = await this._qry(stmt2, sessionId);
        return rows[0];
    }

    async fetchPaymentIntent(paymentIntent): Promise<any> {
        const stmt2 = this.db.prepare(`SELECT * FROM SESSIONS WHERE paymentIntent=?`);
        const rows = await this._qry(stmt2, paymentIntent);
        return rows[0];
    }
}//class

module.exports = {
    SDB
}
