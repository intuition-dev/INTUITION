"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const terse_b_1 = require("terse-b/terse-b");
class BaseDBI {
    constructor() {
        this.log = new terse_b_1.TerseB(this.constructor.name);
        this.sqlite3 = require('sqlite3').verbose();
    }
    defCon(path, fn) {
        this._fn = path + fn;
        this._db = new this.sqlite3.Database(this._fn);
    }
    // passs in an array
    async read(sql, arr) {
        if (!arr)
            arr = [];
        const THIZ = this;
        let rows = new Promise(function (resolve, reject) {
            THIZ._db.all(sql, arr, function (err, rows) {
                if (err)
                    reject(err);
                else
                    resolve(rows);
            });
        }); //pro
        return rows;
    } //()
    // passs in an array
    async readOne(sql, arr) {
        if (!arr)
            arr = [];
        const THIZ = this;
        let row = await new Promise(function (resolve, reject) {
            THIZ._db.get(sql, arr, function (err, row) {
                if (err)
                    reject(err);
                else
                    resolve(row);
            });
        }); //pro
        return row;
    } //()
    // passs in an array
    async write(sql, arr) {
        if (!arr)
            arr = [];
        const THIZ = this;
        await new Promise(function (resolve, reject) {
            THIZ._db.run(sql, arr, function (err) {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        }); //pro
    } //()
} // class
exports.BaseDBI = BaseDBI;
BaseDBI.MAXINT = 9223372036854775807;
