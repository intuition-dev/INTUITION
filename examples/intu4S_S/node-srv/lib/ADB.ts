const sqlite3 = require('sqlite3').verbose()
const fs = require('fs-extra')

import { BaseDB } from 'mbake/lib/BaseDB'

export class IDB extends BaseDB {

    static get appPath(): string {
        let appPath: string = require('require-main-filename')()
        let i: number = appPath.lastIndexOf('/')
        console.log('***', i, appPath)
        i = appPath.lastIndexOf('/')
        appPath = appPath.substr(0, i)
        i = appPath.lastIndexOf('/')
        appPath = appPath.substr(0, i)

        console.log('***', appPath)
        return appPath
    }

    protected static db

    dbExists() {
        return fs.existsSync(IDB.appPath + '/IDB.sqlite')
    }

    con() {
        if (IDB.db) {
            console.log('connection exists')
            return
        }
        IDB.db = new sqlite3.Database(IDB.appPath + '/IDB.sqlite')
        console.log('new connection', IDB.appPath + '/IDB.sqlite')
    }//()

    async init(): Promise<any> {
        if (this.dbExists()) {
            // if db exists, connect an exit
            this.con()
            return
        }//fi
        if (!(IDB.db)) {
            console.log('no connection made')
            this.con()
        }//fi

        return Promise.all([
            this._run(IDB.db.prepare(`CREATE TABLE SESSIONS(sessionId, paymentIntent, address, items)`)), // single row in table
        ]).then(() => {
            console.log('all tables created')
        })
    }

    async saveSession(sessionId, paymentIntent, address, items): Promise<any> {
        const stmt2 = IDB.db.prepare(`INSERT INTO SESSIONS  (sessionId, paymentIntent, address, items) VALUES(?,?,?,?)`);
        this._run(stmt2, sessionId, paymentIntent, JSON.stringify(address), JSON.stringify(items));
    }

    async fetchSession(sessionId): Promise<any> {
        const stmt2 = IDB.db.prepare(`SELECT * FROM SESSIONS WHERE sessionId=?`);
        const rows = await this._qry(stmt2, sessionId);
        return rows[0];
    }

    async fetchPaymentIntent(paymentIntent): Promise<any> {
        const stmt2 = IDB.db.prepare(`SELECT * FROM SESSIONS WHERE paymentIntent=?`);
        const rows = await this._qry(stmt2, paymentIntent);
        return rows[0];
    }
}//class

module.exports = {
    IDB
}
