"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Email_1 = require("./lib/Email");
class Setup {
    constructor(db) {
        this.emailJs = new Email_1.Email();
        this.adbDB = db;
    }
    setup() {
    }
}
exports.Setup = Setup;
