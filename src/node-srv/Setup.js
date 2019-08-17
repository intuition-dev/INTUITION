"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Email_1 = require("mbake/lib/Email");
const setupRoutes_1 = require("./routes/setupRoutes");
class Setup {
    constructor(db, app) {
        this.emailJs = new Email_1.Email();
        this.db = db;
        this.app = app;
    }
    setup() {
        const sr = new setupRoutes_1.SetupRoutes(this.db);
        this.app.handleRRoute('setup', 'setup', sr.route.bind(sr));
    }
}
exports.Setup = Setup;
