"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Auth {
    constructor(appE, adbDB) {
        this.auth = (user, pswd, resp, ctx) => {
            let mountPath;
            user = Buffer.from(user, 'base64').toString();
            pswd = Buffer.from(pswd, 'base64').toString();
            return new Promise((resolve, reject) => {
                resp.result = {};
                return this.adbDB.validateAdminEmail(user, pswd)
                    .then((result) => {
                    console.log('validateEmail result: ', result);
                    if (result.pass === true) {
                        resp.locals.email = user;
                        resp.locals.mountPath = result.pathToSite;
                        return resolve('admin');
                    }
                    else {
                        return this.adbDB.validateEditorEmail(user, pswd)
                            .then((result) => {
                            console.log('validateEditorEmail result: ', result);
                            if (result.pass) {
                                resp.locals.mountPath = result.pathToSite;
                                return resolve('editor');
                            }
                            else {
                                throw new Error();
                            }
                        });
                    }
                }).catch((error) => {
                    console.log('auth: ', error);
                    resp.errorLevel = -1;
                    resp.errorMessage = 'mismatch';
                    resolve('NO');
                });
            });
        };
        this.appE = appE;
        this.adbDB = adbDB;
    }
}
exports.Auth = Auth;
module.exports = {
    Auth
};
