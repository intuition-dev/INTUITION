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

        user = Buffer.from(user, 'base64').toString();
        pswd = Buffer.from(pswd, 'base64').toString();

        return new Promise((resolve, reject) => {
            resp.result = {};

            return this.adbDB.validateEditorEmail(user, pswd)
                .then((result: any) => {
                    // editor user auth
                    console.info("--validateEditorEmail: result:", result)

                    if (result.pass) {
                        mountPath = result.pathToSite
                        return resolve('editor');
                    } else {
                        return this.adbDB.validateEmail(user, pswd)
                            .then((result: any) => {
                                // admin user auth
                                console.info("--validateEmail: result:", result)

                                if (result.pass) {
                                    mountPath = result.pathToSite
                                    return resolve('admin');
                                } else {
                                    throw new Error();
                                }
                            });
                    }
                }).catch((error) => {
                    resp.errorLevel = -1
                    resp.errorMessage = 'mismatch'
                    resolve('NO');
                });

        })
    }

}

module.exports = {
    Auth
};