"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Email_1 = require("./lib/Email");
var setupRoutes_1 = require("./routes/setupRoutes");
var path = require('path');
var dbName = 'ADB.sqlite';
var pathToDb = path.join(__dirname, dbName);
var Setup = (function () {
    function Setup(db, app) {
        this.emailJs = new Email_1.Email();
        this.db = db;
        this.app = app;
    }
    Setup.prototype.setup = function () {
        console.log('ok setup:');
        var sr = new setupRoutes_1.SetupRoutes(this.db);
        this.app.handleRRoute('setup', 'setup', sr.route.bind(sr));
    };
    return Setup;
}());
exports.Setup = Setup;
