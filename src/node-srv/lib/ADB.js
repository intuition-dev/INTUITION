"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const fs = require('fs-extra');
const BaseDB_1 = require("mbake/lib/BaseDB");
class ADB extends BaseDB_1.BaseDB {
    static veri() {
        return 'v0.98.2';
    }
    dbExists() {
        return fs.existsSync('./ADB.sqlite');
    }
    con() {
        if (ADB.db) {
            console.log('connection exists');
            return;
        }
        console.log('new connection');
        ADB.db = new sqlite3.Database('./ADB.sqlite');
    }
    async init() {
        if (this.dbExists()) {
            this.con();
            return;
        }
        if (!(ADB.db)) {
            console.log('no connection made');
            this.con();
        }
        return Promise.all([
            this._run(ADB.db.prepare(`CREATE TABLE ADMIN  (email, hashPass, vcode)`)),
            this._run(ADB.db.prepare(`CREATE TABLE CONFIG ( emailjsService_id, emailjsTemplate_id, emailjsUser_id, pathToApp, port int)`)),
            this._run(ADB.db.prepare(`CREATE TABLE SALT(salt)`)),
            this._run(ADB.db.prepare(`CREATE TABLE EDITORS(guid text, name, email, hashPass, last_login_gmt int, vcode)`)),
        ]).then(() => {
            console.log('all tables created');
            let salt = bcrypt.genSaltSync(10);
            const stmt = ADB.db.prepare(`INSERT INTO SALT(salt) VALUES( ?)`);
            return this._run(stmt, salt);
        });
    }
    async getSalt() {
        if (ADB.salt)
            return ADB.salt;
        console.log('ADB', ADB);
        const qry = ADB.db.prepare('SELECT * FROM SALT');
        const rows = await this._qry(qry);
        const row = rows[0];
        ADB.salt = row.salt;
        return ADB.salt;
    }
    async setAdmin(email, password, emailjsService_id, emailjsTemplate_id, emailjsUser_id, port) {
        const salt = await this.getSalt();
        const hashPass = bcrypt.hashSync(password, salt);
        const stmt1 = ADB.db.prepare(`INSERT INTO ADMIN(email, hashPass) VALUES(?,?)`);
        this._run(stmt1, email, hashPass);
        const appPath = await fs.realpath(__dirname + '/../../WWW/ROOT/exApp1');
        const stmt2 = ADB.db.prepare(`INSERT INTO CONFIG(pathToApp, emailjsService_id, emailjsTemplate_id, emailjsUser_id, port) VALUES('` + appPath + `',?,?,?,?)`);
        this._run(stmt2, emailjsService_id, emailjsTemplate_id, emailjsUser_id, port);
    }
    async updateConfig(emailjsService_id, emailjsTemplate_id, emailjsUser_id, pathToApp, port) {
        const stmt = ADB.db.prepare(`UPDATE CONFIG SET emailjsService_id=?, emailjsTemplate_id=?, emailjsUser_id=?, pathToApp=?, port=?`);
        const res = await this._run(stmt, emailjsService_id, emailjsTemplate_id, emailjsUser_id, pathToApp, port);
        return res;
    }
    async getConfig() {
        const qry = ADB.db.prepare(`SELECT * FROM CONFIG`);
        const rows = await this._qry(qry);
        if (rows.length > 0) {
            const row = rows[0];
            return row;
        }
        else {
            return false;
        }
    }
    async setAppPath(pathToApp) {
        const stmt = ADB.db.prepare(`UPDATE CONFIG SET pathToApp=? `);
        const res = await this._run(stmt, pathToApp);
        return res;
    }
    async getAppPath() {
        const config = await this.getConfig();
        return config.pathToApp;
    }
    async getPort() {
        const qry = ADB.db.prepare('SELECT * FROM CONFIG');
        const rows = await this._qry(qry);
        const row = rows[0];
        return row.port;
    }
    getVcodeAdmin() {
        let vcode = Math.floor(1000 + Math.random() * 9000);
        const stmt = ADB.db.prepare(`UPDATE ADMIN SET vcode=?`);
        this._run(stmt, vcode);
        return vcode;
    }
    getVcodeEditor(email) {
        let vcode = Math.floor(1000 + Math.random() * 9000);
        const stmt = ADB.db.prepare(`UPDATE EDITORS SET vcode=? WHERE email=?`);
        this._run(stmt, vcode, email);
        return vcode;
    }
    async authEditor(email, password) {
        password = Buffer.from(password, 'base64').toString();
        const salt = await this.getSalt();
        const hashPassP = bcrypt.hashSync(password, salt);
        const qry = ADB.db.prepare('SELECT * FROM EDITORS where email =  ?');
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
        const qry = ADB.db.prepare('SELECT * FROM ADMIN where email = ?');
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
    async addEditor(guid, name, email, password) {
        const salt = await this.getSalt();
        const hashPass = bcrypt.hashSync(password, salt);
        const stmt = ADB.db.prepare(`INSERT INTO EDITORS(guid, name, email, hashPass ) VALUES(?,?, ?,?)`);
        const res = await this._run(stmt, guid, name, email, hashPass);
        return res;
    }
    async editEditor(guid, name) {
        if (typeof name !== 'undefined' &&
            typeof guid !== 'undefined') {
            const stmt = ADB.db.prepare(`UPDATE editors SET name='${name}' WHERE guid='${guid}'`);
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
        const qry = ADB.db.prepare(`SELECT guid AS id, name, email FROM editors`);
        const res = await this._qry(qry);
        return res;
    }
    async deleteEditor(guid) {
        const stmt = ADB.db.prepare(`DELETE FROM EDITORS WHERE guid='${guid}'`);
        const res = await this._run(stmt);
        return res;
    }
    async monitor() {
        const qry = ADB.db.prepare(`SELECT COUNT(*) AS count FROM ADMIN`);
        const rows = await this._qry(qry);
        return rows[0];
    }
    async resetPasswordAdminIfMatch(email, vcode, password) {
        const qry = ADB.db.prepare(`SELECT COUNT(*) AS count FROM ADMIN where email=? and vcode=?`);
        const rows = await this._qry(qry, email, vcode);
        const row = rows[0];
        const count = row.count;
        if (!(count == 0))
            throw new Error('mismatch');
        const salt = await this.getSalt();
        const hashPass = bcrypt.hashSync(password, salt);
        const stmt = ADB.db.prepare(`UPDATE ADMIN SET hashPass=?, vcode=null where email=?`);
        this._run(stmt, hashPass, email);
        return 'OK';
    }
    async resetPasswordEditorIfMatch(email, vcode, password) {
        const qry = ADB.db.prepare(`SELECT COUNT(*) AS count FROM EDITORS where email=? and vcode=${vcode}`);
        const rows = await this._qry(qry, email);
        const row = rows[0];
        const count = row.count;
        if ((count == 0))
            throw new Error('mismatch');
        const salt = await this.getSalt();
        const hashPass = bcrypt.hashSync(password, salt);
        const stmt = ADB.db.prepare(`UPDATE EDITORS SET hashPass=?, vcode=null WHERE email=?`);
        this._run(stmt, hashPass, email);
        return 'OK';
    }
    checkDB(path) {
        return fs.existsSync(path);
    }
    openDB(path, cb) {
        fs.open(path, 'w', cb);
    }
    async connectToDb(dbPath) {
        const dbPro = new sqlite3.Database(dbPath);
        ADB.db = await dbPro;
        ADB.db.configure('busyTimeout', 2 * 1000);
    }
    async connectToDbOnPort(dbPath) {
        let _this = this;
        await _this.connectToDb(dbPath);
        const qry = await ADB.db.prepare('SELECT port FROM CONFIG');
        return await this._qry(qry);
    }
}
exports.ADB = ADB;
class EditorAuth {
    constructor(db) {
        this.db = db;
    }
    async auth(user, pswd, resp, ctx) {
        return new Promise(async (resolve, reject) => {
            const ok = await this.db.authEditor(user, pswd);
            if (ok)
                return resolve('OK');
            this.retErr(resp, 'NO');
            reject('NO');
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
exports.EditorAuth = EditorAuth;
class AdminAuth {
    constructor(db) {
        this.db = db;
    }
    async auth(user, pswd, resp, ctx) {
        return new Promise(async (resolve, reject) => {
            const ok = await this.db.authAdmin(user, pswd);
            if (ok)
                return resolve('OK');
            this.retErr(resp, 'NO');
            reject('NO');
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
exports.AdminAuth = AdminAuth;
module.exports = {
    ADB, EditorAuth, AdminAuth
};
