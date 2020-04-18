"use strict";
// const URL = require('url')
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const terse_b_1 = require("terse-b/terse-b");
const log = new terse_b_1.TerseB("example");
const Serv_1 = require("http-rpc/lib/Serv");
const srv = new Serv_1.Serv(['*'], 4 * 1024);
srv.serveStatic('./webApp', 1, 1);
srv.listen(8081);
// ///
const express_1 = __importDefault(require("express"));
var app = express_1.default();
app.get('/red', function (request, response) {
    response.send('Hello RED');
});
app.listen(8080, function () {
    console.log('8080 red');
});
