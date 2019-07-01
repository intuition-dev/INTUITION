import { ExpressRPC, iAuth } from 'mbake/lib/Serv';
import { ADB } from './ADB';


class Auth implements iAuth {

    appE: ExpressRPC
    adbDB: ADB;
    iauth: iAuth;

    constructor(appE, adbDB) {
        this.appE = appE
        this.adbDB = adbDB
        // this.iauth = new iAuth();
    }

    auth(user:string, pswd:string, resp?, ctx?):Promise<string> {
        return new Promise( function (resolve, reject) {
            
            // check db to see if user and password match and then return level
            return this.adbDB.validateEditorEmail(user, pswd)
                .then(function (result) {
                    console.info("--result:", result)
                    resolve('YES');

                    // resp.result = {}
                    // if (result.pass) {
                    //     mountPath = result.pathToSite
                    //     return next()
                    // } else {
                    //     resp.errorLevel = -1
                    //     resp.result = false
                    //     return response.json(resp)
                    // }
                }).catch(function (error) {
                    // console.info("--error:", error)
                    // resp.errorLevel = -1
                    // resp.errorMessage = error
                    // resp.result = false
                    // return response.json(resp)
                    resolve('NO');
                });

        })
    }
    
}

module.exports = {
    Auth
};