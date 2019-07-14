"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Email_1 = require("./lib/Email");
const setup_1 = require("./routes/setup");
class Setup {
    constructor(db, app) {
        this.emailJs = new Email_1.Email();
        this.db = db;
        this.app = app;
    }
    setup() {
        console.log('ok setup:');
        const sr = new setup_1.SetupRoutes(this.db);
        this.app.handleRRoute('setup', 'setup', sr.route);
    }
}
exports.Setup = Setup;
