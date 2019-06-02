"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite_1 = __importDefault(require("sqlite"));
class ADB {
    async createNewADBwSchema() {
        const dbPro = sqlite_1.default.open('./db/ADB.sqlite');
        this.db = await dbPro;
        this.db.configure('busyTimeout', 2 * 1000);
    }
    isUserAuth(userEmail, pswd) {
        return 'editor';
    }
}
exports.ADB = ADB;
module.exports = {
    ADB
};
