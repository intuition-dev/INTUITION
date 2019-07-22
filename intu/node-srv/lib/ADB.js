"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var sqlite3 = require('sqlite3').verbose();
var bcrypt = require('bcryptjs');
var fs = require('fs-extra');
var BaseDB_1 = require("mbake/lib/BaseDB");
var ADB = (function (_super) {
    __extends(ADB, _super);
    function ADB() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ADB.prototype.veri = function () {
        return '0.17.20';
    };
    ADB.prototype.dbExists = function () {
        return fs.existsSync('./ADB.sqlite');
    };
    ADB.prototype.con = function () {
        if (ADB.db) {
            console.log('connection exists');
            return;
        }
        console.log('new connection');
        ADB.db = new sqlite3.Database('./ADB.sqlite');
    };
    ADB.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this_1 = this;
            return __generator(this, function (_a) {
                if (this.dbExists()) {
                    this.con();
                    return [2];
                }
                if (!(ADB.db)) {
                    console.log('no connection made');
                    this.con();
                }
                return [2, Promise.all([
                        this._run(ADB.db.prepare("CREATE TABLE ADMIN  (email, hashPass, vcode)")),
                        this._run(ADB.db.prepare("CREATE TABLE CONFIG ( emailjsService_id, emailjsTemplate_id, emailjsUser_id, pathToApp, port int)")),
                        this._run(ADB.db.prepare("CREATE TABLE SALT(salt)")),
                        this._run(ADB.db.prepare("CREATE TABLE TEMPLATE(template)")),
                        this._run(ADB.db.prepare("CREATE TABLE EDITORS(guid text, name, email, hashPass, last_login_gmt int, vcode)")),
                    ]).then(function () {
                        console.log('all tables created');
                        var salt = bcrypt.genSaltSync(10);
                        var stmt = ADB.db.prepare("INSERT INTO SALT(salt) VALUES( ?)");
                        return _this_1._run(stmt, salt);
                    })];
            });
        });
    };
    ADB.prototype.getSalt = function () {
        return __awaiter(this, void 0, void 0, function () {
            var qry, rows, row;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (ADB.salt)
                            return [2, ADB.salt];
                        console.log('ADB', ADB);
                        qry = ADB.db.prepare('SELECT * FROM SALT');
                        return [4, this._qry(qry)];
                    case 1:
                        rows = _a.sent();
                        row = rows[0];
                        ADB.salt = row.salt;
                        return [2, ADB.salt];
                }
            });
        });
    };
    ADB.prototype.setAdmin = function (email, password, emailjsService_id, emailjsTemplate_id, emailjsUser_id, port) {
        return __awaiter(this, void 0, void 0, function () {
            var salt, hashPass, stmt1, stmt2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.getSalt()];
                    case 1:
                        salt = _a.sent();
                        hashPass = bcrypt.hashSync(password, salt);
                        stmt1 = ADB.db.prepare("INSERT INTO ADMIN(email, hashPass) VALUES(?,?)");
                        this._run(stmt1, email, hashPass);
                        stmt2 = ADB.db.prepare("INSERT INTO CONFIG(emailjsService_id, emailjsTemplate_id, emailjsUser_id, port) VALUES(?,?,?,?)");
                        this._run(stmt2, emailjsService_id, emailjsTemplate_id, emailjsUser_id, port);
                        return [2];
                }
            });
        });
    };
    ADB.prototype.updateConfig = function (emailjsService_id, emailjsTemplate_id, emailjsUser_id, pathToApp, port) {
        var stmt = ADB.db.prepare("UPDATE CONFIG SET (emailjsService_id=?, emailjsTemplate_id=?, \n                emailjsUser_id=?, pathToApp=?, port=?");
        this._run(stmt, emailjsService_id, emailjsTemplate_id, emailjsUser_id, pathToApp, port);
    };
    ADB.prototype.getConfig = function () {
        return __awaiter(this, void 0, void 0, function () {
            var qry, rows, row;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        qry = ADB.db.prepare("SELECT * FROM CONFIG");
                        return [4, this._qry(qry)];
                    case 1:
                        rows = _a.sent();
                        row = rows[0];
                        return [2, row];
                }
            });
        });
    };
    ADB.prototype.setAppPath = function (pathToApp) {
        return __awaiter(this, void 0, void 0, function () {
            var stmt, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        stmt = ADB.db.prepare("UPDATE CONFIG SET pathToApp=? ");
                        return [4, this._run(stmt, pathToApp)];
                    case 1:
                        res = _a.sent();
                        return [2, res];
                }
            });
        });
    };
    ADB.prototype.getAppPath = function () {
        return __awaiter(this, void 0, void 0, function () {
            var config;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.getConfig()];
                    case 1:
                        config = _a.sent();
                        return [2, config.pathToApp];
                }
            });
        });
    };
    ADB.prototype.getPort = function () {
        return __awaiter(this, void 0, void 0, function () {
            var qry, rows, row;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        qry = ADB.db.prepare('SELECT * FROM CONFIG');
                        return [4, this._qry(qry)];
                    case 1:
                        rows = _a.sent();
                        row = rows[0];
                        return [2, row.port];
                }
            });
        });
    };
    ADB.prototype.getVcodeAdmin = function () {
        var vcode = Math.floor(1000 + Math.random() * 9000);
        var stmt = ADB.db.prepare("UPDATE ADMIN SET vcode=?");
        this._run(stmt, vcode);
        return vcode;
    };
    ADB.prototype.getVcodeEditor = function (email) {
        var vcode = Math.floor(1000 + Math.random() * 9000);
        var stmt = ADB.db.prepare("UPDATE EDITORS SET vcode=? WHERE email=?");
        this._run(stmt, vcode, email);
        return vcode;
    };
    ADB.prototype.authEditor = function (email, password) {
        return __awaiter(this, void 0, void 0, function () {
            var salt, hashPassP, qry, rows, row, hashPassS;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.getSalt()];
                    case 1:
                        salt = _a.sent();
                        hashPassP = bcrypt.hashSync(password, salt);
                        qry = ADB.db.prepare('SELECT * FROM EDITORS where email =  ?');
                        return [4, this._qry(qry, email)];
                    case 2:
                        rows = _a.sent();
                        row = rows[0];
                        hashPassS = row.hashPass;
                        return [2, hashPassP == hashPassS];
                }
            });
        });
    };
    ADB.prototype.authAdmin = function (email, password) {
        return __awaiter(this, void 0, void 0, function () {
            var salt, hashPassP, qry, rows, row, hashPassS;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.getSalt()];
                    case 1:
                        salt = _a.sent();
                        hashPassP = bcrypt.hashSync(password, salt);
                        qry = ADB.db.prepare('SELECT * FROM ADMIN where email =  ?');
                        return [4, this._qry(qry, email)];
                    case 2:
                        rows = _a.sent();
                        if (rows.length > 0) {
                            row = rows[0];
                            hashPassS = row.hashPass;
                            return [2, hashPassP == hashPassS];
                        }
                        else {
                            return [2, false];
                        }
                        return [2];
                }
            });
        });
    };
    ADB.prototype.addEditor = function (guid, name, email, password) {
        return __awaiter(this, void 0, void 0, function () {
            var salt, hashPass, stmt, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.getSalt()];
                    case 1:
                        salt = _a.sent();
                        hashPass = bcrypt.hashSync(password, salt);
                        stmt = ADB.db.prepare("INSERT INTO EDITORS(guid, name, email, hashPass ) VALUES(?,?, ?,?)");
                        return [4, this._run(stmt, guid, name, email, hashPass)];
                    case 2:
                        res = _a.sent();
                        return [2, res];
                }
            });
        });
    };
    ADB.prototype.getEditors = function () {
        return __awaiter(this, void 0, void 0, function () {
            var qry, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        qry = ADB.db.prepare("SELECT guid, name FROM editors");
                        return [4, this._qry(qry)];
                    case 1:
                        res = _a.sent();
                        return [2, res];
                }
            });
        });
    };
    ADB.prototype.deleteEditor = function (guid) {
        return __awaiter(this, void 0, void 0, function () {
            var stmt, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        stmt = ADB.db.prepare("DELETE FROM editors WHERE guid=?");
                        return [4, this._run(stmt, guid)];
                    case 1:
                        res = _a.sent();
                        return [2, res];
                }
            });
        });
    };
    ADB.prototype.monitor = function () {
        return __awaiter(this, void 0, void 0, function () {
            var qry, rows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        qry = ADB.db.prepare("SELECT COUNT(*) AS count FROM ADMIN");
                        return [4, this._qry(qry)];
                    case 1:
                        rows = _a.sent();
                        return [2, rows[0]];
                }
            });
        });
    };
    ADB.prototype.resetPasswordAdminIfMatch = function (email, vcode, password) {
        return __awaiter(this, void 0, void 0, function () {
            var qry, rows, row, count, salt, hashPass, stmt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        qry = ADB.db.prepare("SELECT COUNT(*) AS count FROM ADMIN where email=? and vcode=?");
                        return [4, this._qry(qry, email, vcode)];
                    case 1:
                        rows = _a.sent();
                        row = rows[0];
                        count = row.count;
                        if (!(count == 0))
                            throw new Error('mismatch');
                        return [4, this.getSalt()];
                    case 2:
                        salt = _a.sent();
                        hashPass = bcrypt.hashSync(password, salt);
                        stmt = ADB.db.prepare("UPDATE ADMIN SET (hashPass=?, vcode=null) WHERE email=?");
                        this._run(stmt, hashPass, email);
                        return [2, 'OK'];
                }
            });
        });
    };
    ADB.prototype.resetPasswordEditorIfMatch = function (email, vcode, password) {
        return __awaiter(this, void 0, void 0, function () {
            var qry, rows, row, count, salt, hashPass, stmt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        qry = ADB.db.prepare("SELECT COUNT(*) AS count FROM EDITORS where email=? and vcode=?");
                        return [4, this._qry(qry, email, vcode)];
                    case 1:
                        rows = _a.sent();
                        row = rows[0];
                        count = row.count;
                        if (!(count == 0))
                            throw new Error('mismatch');
                        return [4, this.getSalt()];
                    case 2:
                        salt = _a.sent();
                        hashPass = bcrypt.hashSync(password, salt);
                        stmt = ADB.db.prepare("UPDATE EDITORS SET (hashPass=?, vcode=null) WHERE email=?");
                        this._run(stmt, hashPass, email);
                        return [2, 'OK'];
                }
            });
        });
    };
    ADB.prototype.checkDB = function (path) {
        return fs.existsSync(path);
    };
    ADB.prototype.openDB = function (path, cb) {
        fs.open(path, 'w', cb);
    };
    ADB.prototype.connectToDb = function (dbPath) {
        return __awaiter(this, void 0, void 0, function () {
            var dbPro, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        dbPro = new sqlite3.Database(dbPath);
                        _a = ADB;
                        return [4, dbPro];
                    case 1:
                        _a.db = _b.sent();
                        ADB.db.configure('busyTimeout', 2 * 1000);
                        return [2];
                }
            });
        });
    };
    ADB.prototype.connectToDbOnPort = function (dbPath) {
        return __awaiter(this, void 0, void 0, function () {
            var _this, qry;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _this = this;
                        return [4, _this.connectToDb(dbPath)];
                    case 1:
                        _a.sent();
                        return [4, ADB.db.prepare('SELECT port FROM CONFIG')];
                    case 2:
                        qry = _a.sent();
                        return [4, this._qry(qry)];
                    case 3: return [2, _a.sent()];
                }
            });
        });
    };
    return ADB;
}(BaseDB_1.BaseDB));
exports.ADB = ADB;
var EditorAuth = (function () {
    function EditorAuth(db) {
        this.db = db;
    }
    EditorAuth.prototype.auth = function (user, pswd, resp, ctx) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, new Promise(function (resolve, reject) {
                        return __awaiter(this, void 0, void 0, function () {
                            var ok;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4, this.db.authEditor(user, pswd)];
                                    case 1:
                                        ok = _a.sent();
                                        if (ok)
                                            return [2, resolve('OK')];
                                        this.RetErr(resp, 'NO');
                                        reject('NO');
                                        return [2];
                                }
                            });
                        });
                    })];
            });
        });
    };
    EditorAuth.prototype.retErr = function (resp, msg) {
        console.log(msg);
        var ret = {};
        ret.errorLevel = -1;
        ret.errorMessage = msg;
        resp.json(ret);
    };
    return EditorAuth;
}());
exports.EditorAuth = EditorAuth;
var AdminAuth = (function () {
    function AdminAuth(db) {
        this.db = db;
    }
    AdminAuth.prototype.auth = function (user, pswd, resp, ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var _this_1 = this;
            return __generator(this, function (_a) {
                return [2, new Promise(function (resolve, reject) { return __awaiter(_this_1, void 0, void 0, function () {
                        var ok;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4, this.db.authAdmin(user, pswd)];
                                case 1:
                                    ok = _a.sent();
                                    if (ok)
                                        return [2, resolve('OK')];
                                    this.retErr(resp, 'NO');
                                    reject('NO');
                                    return [2];
                            }
                        });
                    }); })];
            });
        });
    };
    AdminAuth.prototype.retErr = function (resp, msg) {
        console.log(msg);
        var ret = {};
        ret.errorLevel = -1;
        ret.errorMessage = msg;
        resp.json(ret);
    };
    return AdminAuth;
}());
exports.AdminAuth = AdminAuth;
module.exports = {
    ADB: ADB, EditorAuth: EditorAuth, AdminAuth: AdminAuth
};
