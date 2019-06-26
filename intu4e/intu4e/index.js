"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var intu4e_1 = require("./lib/intu4e");
var FileOpsExtra_1 = require("mbake/lib/FileOpsExtra");
var Serv_1 = require("mbake/lib/Serv");
var mainApp = Serv_1.ExpressRPC.makeInstance(null);
mainApp.use('/api/shipping/:name', function (req, res, next) {
    var shipping = require('./lib/shipping');
    var name = req.params.name;
    console.log("TCL: mainAppsetup -> name", name);
    shipping.init(mainApp, name, null);
    next();
});
FileOpsExtra_1.VersionNag.isCurrent('intu4e', intu4e_1.Vere.ver()).then(function (isCurrent_) {
    try {
        if (!isCurrent_)
            console.log('There is a newer version of mbake CLI, please update.');
        else
            console.log('You have the current version of mbake CLI');
    }
    catch (err) {
        console.log(err);
    }
});
