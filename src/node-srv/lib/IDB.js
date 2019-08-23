"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require('bcryptjs');
const fs = require('fs-extra');
const logger = require('tracer').console();
const BaseDB_1 = require("mbake/lib/BaseDB");
class IDB extends BaseDB_1.BaseDB {
    constructor(path, fn) {
        super(path, fn);
        logger.trace(path, fn);
    }
    async isSetupDone() {
        try {
            await this._init();
            await this.getSalt();
            const qry = await this.db.prepare('SELECT * FROM CONFIG');
            const rows = await this._qry(qry);
            logger.trace(rows);
            if (rows && rows.length) {
                return true;
            }
            return false;
        }
        catch (e) {
            logger.warn(e);
            return false;
        }
    }
    async tableExists(tab) {
        try {
            this.con();
            const qry = this.db.prepare("SELECT name FROM sqlite_master WHERE type=\'table\' AND name= ?", tab);
            const rows = await this._qry(qry);
            logger.trace('exits?', rows);
            const row = rows[0];
            if (row.name == tab)
                return true;
            return false;
        }
        catch (err) {
            return false;
        }
    }
    async _init() {
        this.con();
        logger.trace(this.path, this.fn);
        if (!this.dbExists())
            return false;
        const created = await this.tableExists('CONFIG');
        logger.trace('IDB tables exist', created);
        if (created) {
            return true;
        }
        await this._run(this.db.prepare(`CREATE TABLE ADMIN  (email, hashPass, vcode)`));
        await this._run(this.db.prepare(`CREATE TABLE CONFIG ( emailjsService_id, emailjsTemplate_id, emailjsUser_id, pathToApp, port int)`));
        await this._run(this.db.prepare(`CREATE TABLE SALT(salt)`));
        await this._run(this.db.prepare(`CREATE TABLE EDITORS(guid text, name, email, hashPass, last_login_gmt int, vcode)`));
        let salt = bcrypt.genSaltSync(10);
        const stmt = this.db.prepare(`INSERT INTO SALT(salt) VALUES( ?)`);
        await this._run(stmt, salt);
        await this.getSalt();
        console.log('all tables created');
        return true;
    }
    async getSalt() {
        if (this.salt)
            return this.salt;
        const qry = this.db.prepare('SELECT * FROM SALT');
        const rows = await this._qry(qry);
        logger.trace(rows);
        const row = rows[0];
        this.salt = row.salt;
        return this.salt;
    }
    async setAdmin(email, password, emailjsService_id, emailjsTemplate_id, emailjsUser_id, port) {
        const salt = await this.getSalt();
        const hashPass = bcrypt.hashSync(password, salt);
        const stmt1 = this.db.prepare(`INSERT INTO ADMIN(email, hashPass) VALUES(?,?)`);
        this._run(stmt1, email, hashPass);
        const appPath = await fs.realpath(__dirname + '/../../ROOT');
        logger.trace(appPath);
        const stmt2 = this.db.prepare(`INSERT INTO CONFIG(pathToApp, emailjsService_id, emailjsTemplate_id, emailjsUser_id, port) VALUES('` + appPath + `',?,?,?,?)`);
        this._run(stmt2, emailjsService_id, emailjsTemplate_id, emailjsUser_id, port);
    }
    async updateConfig(emailjsService_id, emailjsTemplate_id, emailjsUser_id, pathToApp, port) {
        const stmt = this.db.prepare(`UPDATE CONFIG SET emailjsService_id=?, emailjsTemplate_id=?, emailjsUser_id=?, pathToApp=?, port=?`);
        const res = await this._run(stmt, emailjsService_id, emailjsTemplate_id, emailjsUser_id, pathToApp, port);
        return res;
    }
    async getConfig() {
        const qry = this.db.prepare(`SELECT * FROM CONFIG`);
        const rows = await this._qry(qry);
        if (rows && rows.length > 0) {
            const row = rows[0];
            return row;
        }
        else {
            return false;
        }
    }
    async setAppPath(pathToApp) {
        const stmt = this.db.prepare(`UPDATE CONFIG SET pathToApp=? `);
        const res = await this._run(stmt, pathToApp);
        return res;
    }
    async getAppPath() {
        const config = await this.getConfig();
        if (!config)
            throw new Error('no pathToApp in DB');
        return config.pathToApp;
    }
    async getPort() {
        const qry = this.db.prepare('SELECT * FROM CONFIG');
        const rows = await this._qry(qry);
        const row = rows[0];
        return row.port;
    }
    getVcodeAdmin() {
        let vcode = Math.floor(1000 + Math.random() * 9000);
        const stmt = this.db.prepare(`UPDATE ADMIN SET vcode=?`);
        this._run(stmt, vcode);
        return vcode;
    }
    getVcodeEditor(email) {
        let vcode = Math.floor(1000 + Math.random() * 9000);
        const stmt = this.db.prepare(`UPDATE EDITORS SET vcode=? WHERE email=?`);
        this._run(stmt, vcode, email);
        return vcode;
    }
    async authEditor(email, password) {
        password = Buffer.from(password, 'base64').toString();
        const salt = await this.getSalt();
        const hashPassP = bcrypt.hashSync(password, salt);
        const qry = this.db.prepare('SELECT * FROM EDITORS where email =  ?');
        const rows = await this._qry(qry, email);
        if (rows.length > 0) {
            const row = rows[0];
            const hashPassS = row.hashPass;
            return hashPassP == hashPassS;
        }
        else {
            return false;
        }
    }
    async authAdmin(email, password) {
        const salt = await this.getSalt();
        const hashPassP = bcrypt.hashSync(password, salt);
        const qry = this.db.prepare('SELECT * FROM ADMIN where email = ?');
        const rows = await this._qry(qry, email);
        console.log('AUTH ROWS', rows);
        if (rows.length > 0) {
            const row = rows[0];
            const hashPassS = row.hashPass;
            return hashPassP == hashPassS;
        }
        else {
            return false;
        }
    }
    async addEditor(guid, name, email, password) {
        const salt = await this.getSalt();
        const hashPass = bcrypt.hashSync(password, salt);
        const stmt = this.db.prepare(`INSERT INTO EDITORS(guid, name, email, hashPass ) VALUES(?,?, ?,?)`);
        const res = await this._run(stmt, guid, name, email, hashPass);
        return res;
    }
    async editEditor(guid, name) {
        if (typeof name !== 'undefined' &&
            typeof guid !== 'undefined') {
            const stmt = this.db.prepare(`UPDATE editors SET name='${name}' WHERE guid='${guid}'`);
            const res = await this._run(stmt);
            if (res.length > 0) {
                return res;
            }
            else {
                console.log('res is empty: ', res);
                return false;
            }
        }
        else {
            console.log('failed to edit user');
        }
    }
    ;
    async getEditors() {
        const qry = this.db.prepare(`SELECT guid AS id, name, email FROM editors`);
        const res = await this._qry(qry);
        return res;
    }
    async deleteEditor(guid) {
        const stmt = this.db.prepare(`DELETE FROM EDITORS WHERE guid='${guid}'`);
        const res = await this._run(stmt);
        return res;
    }
    async monitor() {
        const qry = this.db.prepare(`SELECT COUNT(*) AS count FROM ADMIN`);
        const rows = await this._qry(qry);
        return rows[0];
    }
    async resetPasswordAdminIfMatch(email, vcode, password) {
        const qry = this.db.prepare(`SELECT COUNT(*) AS count FROM ADMIN where email=? and vcode=?`);
        const rows = await this._qry(qry, email, vcode);
        const row = rows[0];
        const count = row.count;
        if (!(count == 0))
            throw new Error('mismatch');
        const salt = await this.getSalt();
        const hashPass = bcrypt.hashSync(password, salt);
        const stmt = this.db.prepare(`UPDATE ADMIN SET hashPass=?, vcode=null where email=?`);
        this._run(stmt, hashPass, email);
        return 'OK';
    }
    async resetPasswordEditorIfMatch(email, vcode, password) {
        const qry = this.db.prepare(`SELECT COUNT(*) AS count FROM EDITORS where email=? and vcode=${vcode}`);
        const rows = await this._qry(qry, email);
        const row = rows[0];
        const count = row.count;
        if ((count == 0))
            throw new Error('mismatch');
        const salt = await this.getSalt();
        const hashPass = bcrypt.hashSync(password, salt);
        const stmt = this.db.prepare(`UPDATE EDITORS SET hashPass=?, vcode=null WHERE email=?`);
        this._run(stmt, hashPass, email);
        return 'OK';
    }
}
exports.IDB = IDB;
class EditorAuthX {
    constructor(db) {
        this.db = db;
    }
    async auth(user, pswd, resp, ctx) {
        return new Promise(async (resolve, reject) => {
            const ok = await this.db.authEditor(user, pswd);
            if (ok)
                return resolve('OK');
            resolve('FAIL');
        });
    }
    retErr(resp, msg) {
        console.log(msg);
        const ret = {};
        ret.errorLevel = -1;
        ret.errorMessage = msg;
        resp.json(ret);
    }
}
exports.EditorAuthX = EditorAuthX;
class AdminAuthX {
    constructor(db) {
        this.db = db;
    }
    async auth(user, pswd, resp, ctx) {
        return new Promise(async (resolve, reject) => {
            console.log('AdminAuthX user, pswd -----> ', user, pswd);
            const ok = await this.db.authAdmin(user, pswd);
            console.log('AUTH OK', ok);
            if (ok)
                return resolve('OK');
            resolve('FAIL');
        });
    }
    retErr(resp, msg) {
        console.log(msg);
        const ret = {};
        ret.errorLevel = -1;
        ret.errorMessage = msg;
        resp.json(ret);
    }
}
exports.AdminAuthX = AdminAuthX;
module.exports = {
    IDB, EditorAuthX, AdminAuthX
};
