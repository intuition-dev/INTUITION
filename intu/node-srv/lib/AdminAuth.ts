import { iAuth } from 'mbake/lib/Serv';
import { ADB } from './ADB';

export class AdminAuth implements iAuth {

    adbDB: ADB;
    iauth: iAuth;

    constructor( adbDB) {
        this.adbDB = adbDB
    }

    auth = (user: string, pswd: string, resp?, ctx?): Promise<string> => {

        return new Promise((resolve, reject) => {
            resp.result = {}

            return this.adbDB.validateAdminEmail(user, pswd)
                .then((result: any) => {
                    console.log('validateEmail result: ', result);
                if (result.pass === true) 
                    return resolve('OK')
                else throw new Error()
                
                }).catch((error) => {
                    this.retErr(resp, 'Sorry, try again')
                    reject('NO')
                })

        })
    }//()

    /**
    * returns an error
    * @param resp http response
    * @param msg error msg
    */
   retErr(resp, msg) {
        console.log(msg)
        const ret:any= {} // new return
        ret.errorLevel = -1
        ret.errorMessage = msg
        resp.json(ret)
    }//()

}

module.exports = {
    AdminAuth
}

