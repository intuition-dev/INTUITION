"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Auth {
    constructor(appE, adbDB) {
        this.auth = (user, pswd, resp, ctx) => {
            let mountPath;
            console.log('user pswd ', user, ' ', pswd);
            console.log('user pswd ', user, ' ', pswd);
            return new Promise((resolve, reject) => {
                resp.result = {};
                return this.adbDB.validateEmail(user, pswd)
                    .then((result) => {
                    console.info("--validateEmail: result:", result);
                    if (result.pass) {
                        console.log('editor');
                        mountPath = result.pathToSite;
                        return resolve('editor');
                    }
                    else {
                        return this.adbDB.validateEditorEmail(user, pswd)
                            .then((result) => {
                            console.info("--validateEditorEmail: result:", result);
                            if (result.pass) {
                                mountPath = result.pathToSite;
                                return resolve('admin');
                            }
                            else {
                                throw new Error();
                            }
                        });
                    }
                }).catch((error) => {
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
