"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Email_1 = require("mbake/lib/Email");
const setupHandler_1 = require("./handlers/setupHandler");
class Setup {
    constructor(db, app) {
        this.emailJs = new Email_1.Email();
        this.db = db;
        this.app = app;
    }
    setup() {
        const sr = new setupHandler_1.SetupHandler(this.db);
        this.app.handleRRoute('setup', 'setup', sr.route.bind(sr));
    }
}
exports.Setup = Setup;
