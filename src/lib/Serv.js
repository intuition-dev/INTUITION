"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const bodyParser = require('body-parser');
const formidable = require('express-formidable');
const logger = require('tracer').console();
class CustomCors {
    constructor(validOrigins) {
        return (request, response, next) => {
            const origin = request.get('origin');
            let approved = false;
            validOrigins.forEach(function (ori) {
                logger.trace(ori);
                if (ori == '*')
                    approved = true;
                if (origin.includes(ori))
                    approved = true;
            });
            logger.trace(origin, approved);
            if (approved) {
                response.setHeader('Access-Control-Allow-Origin', origin);
                return next();
            }
            response.status(403).end();
        };
    }
}
exports.CustomCors = CustomCors;
class ExpressRPC {
    static makeInstance(origins) {
        console.log('Allowed >>> ', origins);
        const cors = new CustomCors(origins);
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
