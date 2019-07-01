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

        return new Promise((resolve, reject) => {

            // check db to see if user and password match and then return level
            return this.adbDB.validateEditorEmail(user, pswd)
                .then((result: any) => {
                    console.info("--result:", result)

                    resp.result = {};
                    if (result.pass) {
                        mountPath = result.pathToSite
                        return resolve('YES');
                    } else {
                        resp.errorLevel = -1
                        resp.errorMessage = 'mismatch'
                        return resolve('NO');
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