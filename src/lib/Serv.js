"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CustomCors {
    constructor(orig) {
        return (request, response, next) => {
            response.setHeader('Access-Control-Allow-Origin', orig);
            response.setHeader('Access-Control-Allow-Methods', 'POST');
            return next();
        };
    }
}
exports.CustomCors = CustomCors;
const express = require('express');
const bodyParser = require('body-parser');
const formidable = require('express-formidable');
class ExpressRPC {
    static makeInstance(orig) {
        console.log('Allowed>>>', orig);
        const cors = new CustomCors(orig);
        const appInst = express();
        appInst.use(cors);
        appInst.use(bodyParser.urlencoded({ extended: false }));
        appInst.use(formidable());
        return appInst;
    }
}
exports.ExpressRPC = ExpressRPC;
module.exports = {
    CustomCors, ExpressRPC
};
