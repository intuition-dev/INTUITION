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
module.exports = {
    CustomCors
};
