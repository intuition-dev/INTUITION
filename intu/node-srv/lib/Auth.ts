import { ExpressRPC, iAuth } from 'mbake/lib/Serv';
import { ADB } from './ADB';

export class Auth implements iAuth {

    appE: ExpressRPC
    adbDB: ADB;
    iauth: iAuth;

    constructor(appE, adbDB) {
        this.appE = appE
        this.adbDB = adbDB
    }

    auth = (user: string, pswd: string, resp?, ctx?): Promise<string> => {
        let mountPath: string;

        // decode 
        user = Buffer.from(user, 'base64').toString();
        pswd = Buffer.from(pswd, 'base64').toString();

        return new Promise((resolve, reject) => {
            resp.result = {}

            return this.adbDB.validateAdminEmail(user, pswd)
                .then((result: any) => {
                    console.log('validateEmail result: ', result);
                    // editor user auth
                    if (result.pass === true) {
                        resp.locals.email = user;
                        resp.locals.mountPath = result.pathToSite;
                        return resolve('admin');
                    } else {
                        return this.adbDB.validateEditorEmail(user, pswd)
                            .then((result: any) => {
                                console.log('validateEditorEmail result: ', result);
                                // admin user auth
                                if (result.pass) {
                                    resp.locals.mountPath = result.pathToSite;
                                    return resolve('editor');
                                } else {
                                    throw new Error();
                                }
                            })
                    }
                }).catch((error) => {
                    console.log('auth: ', error);
                    resp.errorLevel = -1
                    resp.errorMessage = 'mismatch'
                    resolve('NO');
                })

        })
    }

}

module.exports = {
    Auth
}
