
const bcrypt = require('bcryptjs') // to hash passwords
const fs = require('fs-extra')
const logger = require('tracer').console()

import { BaseDBL, iDBL } from 'mbake/lib/BaseDBL'
import { iAuth } from 'mbake/lib/Serv'

export class IDB extends BaseDBL implements iDBL {

    protected salt

    constructor(path, fn) {
        super(path, fn)
        logger.trace(path, fn)
    }

    async isSetupDone(): Promise<boolean> {
        try {
            await this._init() // do the init

            await this.getSalt()

            const qry = await this.db.prepare('SELECT * FROM CONFIG')// single row in table so no need for where 
            const rows = await this._qry(qry)
            logger.trace(rows)

            if (rows && rows.length) {
                return true
            }
            return false
        }
        catch (e) {
            logger.warn(e)
            return false
        }
    }//()


    protected async _init(): Promise<boolean> {
        this.con()

        // if db exists
        logger.trace(this.path, this.fn)

        const created: boolean = await this.tableExists('CONFIG')
        logger.trace('IDB tables exist', created)
        if (created) {
            return true
        }

        await this._run(this.db.prepare(`CREATE TABLE CONFIG ( emailjsService_id, emailjsTemplate_id, emailjsUser_id, pathToApp)`)) // single row in table
        await this._run(this.db.prepare(`CREATE TABLE SALT(salt)`))
        await this._run(this.db.prepare(`CREATE TABLE EDITORS(guid text, name, email, hashPass, last_login_gmt int, vcode)`))
        let salt = bcrypt.genSaltSync(10)
        const stmt = this.db.prepare(`INSERT INTO SALT(salt) VALUES( ?)`)
        await this._run(stmt, salt)
        await this.getSalt()
        console.log('all tables created')
        return true

    }

    async getSalt() {
        if (this.salt) return this.salt
        const qry = this.db.prepare('SELECT * FROM SALT')// single row in table so no need for where 
        const rows = await this._qry(qry)
        logger.trace(rows)
        const row = rows[0]
        this.salt = row.salt
        return this.salt
    }//()

    async updateConfig(emailjsService_id, emailjsTemplate_id, emailjsUser_id, pathToApp) {
        const stmt = this.db.prepare(`UPDATE CONFIG SET emailjsService_id=?, emailjsTemplate_id=?, emailjsUser_id=?, pathToApp=?`)// single row in table so no need for where
        const res = await this._run(stmt, emailjsService_id, emailjsTemplate_id, emailjsUser_id, pathToApp);
        return res;
    }

    async getConfig() {
        const qry = this.db.prepare(`SELECT * FROM CONFIG`)
        const rows = await this._qry(qry)
        if (rows && rows.length > 0) {
            const row = rows[0]
            return row
        } else {
            return false
        }
    }

    async setAppPath(pathToApp) {
        const stmt = this.db.prepare(`UPDATE CONFIG SET pathToApp=? `)
        const res = await this._run(stmt, pathToApp)
        return res
    }

    async getAppPath() {
        const config = await this.getConfig()
        if (!config) throw new Error('no pathToApp in DB')
        return config.pathToApp
    }

    getVcodeAdmin() {
        let vcode = Math.floor(1000 + Math.random() * 9000);

        const stmt = this.db.prepare(`UPDATE ADMIN SET vcode=?`)
        this._run(stmt, vcode)
        return vcode
    }//()
    getVcodeEditor(email) {
        let vcode = Math.floor(1000 + Math.random() * 9000);

        const stmt = this.db.prepare(`UPDATE EDITORS SET vcode=? WHERE email=?`)
        this._run(stmt, vcode, email)
        return vcode
    }//()

    async authEditor(email, password): Promise<boolean> {
        // password = Buffer.from(password).toString('base64');
        console.log("TCL: IDB -> password", password)
        const salt = await this.getSalt()
        const hashPassP = bcrypt.hashSync(password, salt)
        const qry = this.db.prepare('SELECT * FROM EDITORS where email =  ?')
        const rows = await this._qry(qry, email)
        console.log("TCL: IDB -> rows", rows)
        if (rows.length > 0) {
            const row = rows[0];
            const hashPassS = row.hashPass;
            return hashPassP == hashPassS;
        } else {
            return false;
        }
    }//()

    /**
     * @param guid You can user ToolBelt's getGUID on browser
     * You can set vcode with the vcode method
     */
    async addEditor(guid, name, email, password) {
        const salt = await this.getSalt()
        const hashPass = bcrypt.hashSync(password, salt)

        const stmt = this.db.prepare(`INSERT INTO EDITORS(guid, name, email, hashPass ) VALUES(?,?, ?,?)`)
        const res = await this._run(stmt, guid, name, email, hashPass)
        return res
    }//()

    /**
     * edit user
     * @param guid You can user ToolBelt's getGUID on browser
     */
    async editEditor(guid, name) {

        if (typeof name !== 'undefined' &&
            typeof guid !== 'undefined'
        ) {

            const stmt = this.db.prepare(`UPDATE editors SET name='${name}' WHERE guid='${guid}'`);
            const res = await this._run(stmt);

            if (res.length > 0) {
                return res;
            } else {
                console.log('res is empty: ', res);
                return false;
            }

        } else {
            console.log('failed to edit user');
        }

    };

    async getEditors() {
        const qry = this.db.prepare(`SELECT guid AS id, name, email FROM editors`)
        const res = await this._qry(qry)
        return res
    }

    async deleteEditor(guid) {
        const stmt = this.db.prepare(`DELETE FROM EDITORS WHERE guid='${guid}'`)
        const res = await this._run(stmt)
        return res
    }

    async resetPasswordAdminIfMatch(email, vcode, password) {
        // is there a row match?
        const qry = this.db.prepare(`SELECT COUNT(*) AS count FROM ADMIN where email=? and vcode=?`)
        const rows = await this._qry(qry, email, vcode)
        const row = rows[0]
        const count = row.count
        if (!(count == 0)) throw new Error('mismatch')

        const salt = await this.getSalt()
        const hashPass = bcrypt.hashSync(password, salt)
        const stmt = this.db.prepare(`UPDATE ADMIN SET hashPass=?, vcode=null where email=?`)
        this._run(stmt, hashPass, email)
        return 'OK'
    }//()

    async resetPasswordEditorIfMatch(email, vcode, password) {
        // is there a row match?
        const qry = this.db.prepare(`SELECT COUNT(*) AS count FROM EDITORS where email=? and vcode=${vcode}`)
        const rows = await this._qry(qry, email)
        const row = rows[0]
        const count = row.count
        if ((count == 0)) throw new Error('mismatch')

        const salt = await this.getSalt()
        const hashPass = bcrypt.hashSync(password, salt)
        const stmt = this.db.prepare(`UPDATE EDITORS SET hashPass=?, vcode=null WHERE email=?`)
        this._run(stmt, hashPass, email)
        return 'OK'
    }//()


}//()

// Auth section //////////////////////////////////////////////////////////////////
export class EditorAuthX implements iAuth {
    db: IDB
    constructor(db) {
        this.db = db
    }//()

    async auth(user: string, pswd: string, resp?: any, ctx?: any): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const ok = await this.db.authEditor(user, pswd)
            console.log('editor AUTH status: ', ok)
            if (ok) return resolve('OK')

            resolve('FAIL')
        })// pro
    }

    retErr(resp: any, msg: any) {
        console.log(msg)
        const ret: any = {} // new return
        ret.errorLevel = -1
        ret.errorMessage = msg
        resp.json(ret)
    }//()

}//class
