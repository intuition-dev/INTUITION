"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite = require("sqlite");
const bcrypt = require('bcryptjs');
const fs = require('fs-extra');
class Veri {
    static ver() {
        return 'v0.9.26';
    }
}
exports.Veri = Veri;
class ADB {
    dbExists(path) {
        return fs.existsSync(path);
    }
    openDB000(path, cb) {
        fs.open(path, 'w', cb);
    }
    async connectToDb(dbPath) {
        const dbPro = sqlite.open(dbPath);
        this.db = await dbPro;
        this.db.configure('busyTimeout', 2 * 1000);
    }
    async getPort(dbPath) {
        let _this = this;
        await _this.connectToDb(dbPath);
        return new Promise(function (resolve, reject) {
            return _this.db.get(`SELECT port FROM configs`, function (err, row) {
                if (err) {
                }
                return row;
            }).then(function (row) {
                resolve(row.port);
            });
        });
    }
    async addAdmin(email, password, emailjsService_id, emailjsTemplate_id, emailjsUser_id, port) {
        let randomID = '_' + Math.random().toString(36).substr(2, 9);
        var salt = bcrypt.genSaltSync(10);
        var hashPass = bcrypt.hashSync(password, salt);
        await this.db.run(`CREATE TABLE admin(id, email, password, vcode)`);
        await this.db.run(`CREATE TABLE configs(adminId, emailjsService_id, emailjsTemplate_id, emailjsUser_id, pathToApp, snipcartApi, port, printfulApi)`);
        await this.db.run(`CREATE TABLE editors(id, email, password, name, vcode)`);
        await this.db.run(`INSERT INTO admin(id, email, password) VALUES('${randomID}','${email}', '${hashPass}')`, function (err) {
            if (err) {
            }
        });
        await this.db.run(`INSERT INTO editors(id, email, password, name) VALUES('${randomID}','${email}', '${hashPass}', 'Admin')`, function (err) {
            if (err) {
            }
        });
        await this.db.run(`INSERT INTO configs(adminId, emailjsService_id, emailjsTemplate_id, emailjsUser_id, port) VALUES('${randomID}', '${emailjsService_id}', '${emailjsTemplate_id}', '${emailjsUser_id}', '${port}')`, function (err) {
            if (err) {
            }
        });
    }
    validateAdminEmail(email, password) {
        let _this = this;
        return new Promise(function (resolve, reject) {
            _this.db.get(`SELECT password FROM admin WHERE email=?`, email, function (err, row) {
                if (err) {
                }
                return row;
            }).then(function (row) {
                if (typeof row != 'undefined') {
                    bcrypt.compare(password, row.password)
                        .then((res) => {
                        _this.db.get(`SELECT pathToApp FROM configs`, [], function (err, row) {
                            if (err) {
                            }
                            return row;
                        }).then(function (row) {
                            let temp = {};
                            console.info("--res:", res);
                            temp['pass'] = res;
                            temp['pathToApp'] = row.pathToApp;
                            console.info("--result:", temp);
                            resolve(temp);
                        });
                    });
                }
                else {
                    let temp = {};
                    temp['pass'] = false;
                    resolve(temp);
                }
            });
        });
    }
    validateEditorEmail(email, password) {
        let _this = this;
        return new Promise(function (resolve, reject) {
            _this.db.get(`SELECT password FROM editors WHERE email=?`, email, function (err, row) {
                if (err) {
                }
                return row;
            }).then(function (row) {
                if (typeof row != 'undefined') {
                    return bcrypt.compare(password, row.password)
                        .then((res) => {
                        _this.db.get(`SELECT pathToApp FROM configs`, [], function (err, row) {
                            console.info("--row:", row);
                            if (err) {
                            }
                            return row;
                        }).then(function (row) {
                            let temp = {};
                            console.info("--res:", res);
                            temp['pass'] = res;
                            temp['pathToApp'] = row.pathToApp;
                            console.info("--result:", temp);
                            resolve(temp);
                        });
                    });
                }
                else {
                    let temp = {};
                    temp['pass'] = false;
                    resolve(temp);
                }
            });
        });
    }
    getEditors() {
        return this.db.all(`SELECT id, name, email FROM editors`, [], function (err, rows) {
            if (err) {
            }
            return rows;
        });
    }
    addEditor(email, name, password) {
        let randomID = '_' + Math.random().toString(36).substr(2, 9);
        var salt = bcrypt.genSaltSync(10);
        var hashPass = bcrypt.hashSync(password, salt);
        return this.db.run(`INSERT INTO editors(id, email, password, name) VALUES('${randomID}','${email}', '${hashPass}', '${name}')`, function (err) {
            if (err) {
            }
            return this.lastID;
        });
    }
    updateEditor(name, id) {
        return this.db.run(`UPDATE editors SET name='${name}' WHERE id='${id}'`, function (err) {
            if (err) {
            }
            return this.lastID;
        });
    }
    deleteEditor(id) {
        return this.db.run(`DELETE FROM editors WHERE id='${id}'`, function (err) {
            if (err) {
            }
        });
    }
    async setVcodeAdmin(email) {
        let vcode = Math.floor(1000 + Math.random() * 9000);
        await this.db.run(`UPDATE admin SET vcode='${vcode}' WHERE email='${email}'`, function (err, rows) {
            if (err) {
            }
            return rows;
        });
        return vcode;
    }
    async setVcodeEditor(email) {
        let vcode = Math.floor(1000 + Math.random() * 9000);
        await this.db.run(`UPDATE editors SET vcode='${vcode}' WHERE email='${email}'`, function (err, rows) {
            if (err) {
            }
            return rows;
        });
        return vcode;
    }
    resetPasswordAdmin(email, vcode, password) {
        var salt = bcrypt.genSaltSync(10);
        let hashPass = bcrypt.hashSync(password, salt);
        return this.db.run(`UPDATE admin SET password='${hashPass}' WHERE email='${email}' AND vcode='${vcode}'`)
            .then(res => {
            if (res.changes > 0) {
                return true;
            }
            else {
                return false;
            }
        })
            .catch(err => {
            return false;
        });
    }
    resetPasswordEditor(email, vcode, password) {
        var salt = bcrypt.genSaltSync(10);
        let hashPass = bcrypt.hashSync(password, salt);
        return this.db.run(`UPDATE editors SET password='${hashPass}' WHERE email='${email}' AND vcode='${vcode}'`)
            .then(res => {
            if (res.changes > 0) {
                return true;
            }
            else {
                return false;
            }
        })
            .catch(err => {
            return false;
        });
    }
    getEmailJsSettings() {
        return this.db.all(`SELECT emailjsService_id, emailjsTemplate_id, emailjsUser_id FROM configs`, [], function (err, rows) {
            if (err) {
            }
            return rows;
        });
    }
    getAdminId(email) {
        return this.db.all(`SELECT id FROM admin WHERE email='${email}'`, [], function (err, rows) {
            if (err) {
            }
            return rows;
        });
    }
    setAppPath(pathToApp, adminId) {
        return this.db.all(`UPDATE configs SET pathToApp='${pathToApp}' WHERE adminId='${adminId}'`, [], function (err, rows) {
            if (err) {
            }
            return rows;
        });
    }
    updateConfig(pathToApp, port, printfulApi, adminId) {
        return this.db.run(`UPDATE configs SET pathToApp='${pathToApp}', port='${port}', printfulApi='${printfulApi}' WHERE adminId='${adminId}'`, [], function (err, rows) {
            if (err) {
                return console.error('update config error:', err.message);
            }
            return rows.changes;
        });
    }
    getConfigs(adminId) {
        console.log("TCL: getConfigs -> adminId", adminId);
        return this.db.get(`SELECT pathToApp, port FROM configs WHERE adminId='${adminId}'`, [], function (err, rows) {
            if (err) {
            }
            return rows;
        });
    }
    getAppPath() {
        return this.db.all(`SELECT pathToApp FROM configs`, [], function (err, rows) {
            if (err) {
            }
            return rows;
        });
    }
    monitor() {
        return this.db.all("SELECT COUNT(*) AS count FROM admin");
    }
}
exports.ADB = ADB;
module.exports = {
    ADB, Veri
};
