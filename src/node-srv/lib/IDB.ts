
const bcrypt = require('bcryptjs') // to hash passwords
const bunyan = require('bunyan')
const log = bunyan.createLogger({src: true, name: "IDB"})

import { BaseDBL } from 'mbake/lib/BaseDBL'
import { iAuth } from 'mbake/lib/Serv'

export class IDB extends BaseDBL  {

    protected salt

    constructor(path, fn) {
        log.info("TCL: IDB -> constructor -> path", path)
        super()
        log.info(path, fn)
        this.defCon(path, fn)
    }

    setupIfNeeded():boolean {
      const done = this.tableExists('CONFIG')
      if(done) return done


      this.write(`CREATE TABLE CONFIG (emailjsService_id text, emailjsTemplate_id text, emailjsUser_id text)`) // single row in table
      this.write(`CREATE TABLE SALT(salt)`)
      this.write(`CREATE TABLE EDITORS(guid text, name, email, hashPass, last_login_gmt int, vcode)`)
      let salt = bcrypt.genSaltSync(10)
      this.write(`INSERT INTO SALT(salt) VALUES(?)`, salt)
      this.write(`INSERT INTO CONFIG(emailjsService_id, emailjsTemplate_id, emailjsUser_id) VALUES(?, ? , ?)`, '', '', '')
      this.getSalt()
      log.info('-------------------- all tables created --------------------')
      return true

    }

    getSalt() {
        if (this.salt) return this.salt
        const row = this.readOne('SELECT * FROM SALT')// single row in table so no need for where 
        this.salt = row['salt']
        return this.salt
    }//()

    updateConfig(emailjsService_id, emailjsTemplate_id, emailjsUser_id) {
       this.write(`UPDATE CONFIG SET emailjsService_id=?, emailjsTemplate_id=?, emailjsUser_id=?`
        , emailjsService_id, emailjsTemplate_id, emailjsUser_id)
        return true
    }

    getConfig() {
        const row = this.read(`SELECT * FROM CONFIG`)
        return row
    }

    makeVcodeEditor(email) {
        let vcode = Math.floor(1000 + Math.random() * 9000);
        this.write(`UPDATE EDITORS SET vcode=? WHERE email=?`, vcode, email)
        return vcode
    }//()

     authEditor(email, password): boolean {
        // password = Buffer.from(password).toString('base64');
        log.info("TCL: IDB -> password", password)
        const salt =  this.getSalt()
        const hashPassP = bcrypt.hashSync(password, salt)
        const row = this.readOne('SELECT * FROM EDITORS where email =  ?', email)
        const hashPassS = row['hashPass']
        return hashPassP == hashPassS

    }//()

    /**
     * @param guid You can user ToolBelt's getGUID on browser
     * You can set vcode with the vcode method
     */
     addEditor(guid, name, email, password) {
        const salt =  this.getSalt()
        const hashPass = bcrypt.hashSync(password, salt)

        this.write(`INSERT INTO EDITORS(guid, name, email, hashPass ) VALUES(?,?, ?,?)`
            , guid, name, email, hashPass)
    }//()

    /**
     * edit user
     * @param guid You can user ToolBelt's getGUID on browser
     */
     editEditor(guid, name) {
    
        const count = this.write(`UPDATE editors SET name=? WHERE guid=?`, name, guid)
        
        return count
    }//()

    getEditorsAll() {
        return this.read(`SELECT guid AS id, name, email FROM editors`)
    }

     deleteEditor(guid) {
        this.write(`DELETE FROM EDITORS WHERE guid=?`, guid)
    }

     resetPasswordAdminIfMatch(email, vcode, password):boolean {
        // is there a row match?
        const row = this.readOne(`SELECT COUNT(*) AS count FROM ADMIN where email=? and vcode=?`, email, vcode)
        const count = row['count']
        if (!(count == 0)) throw new Error('mismatch')

        const salt =  this.getSalt()
        const hashPass = bcrypt.hashSync(password, salt)
        const changed = this.write(`UPDATE ADMIN SET hashPass=?, vcode=null where email=?`
            ,hashPass, email)

        return true
    }//()

     resetPasswordEditorIfMatch(email, vcode, password):boolean {
        // is there a row match?
        const row = this.readOne(`SELECT COUNT(*) AS count FROM EDITORS where email=? and vcode=${vcode}`)
        const count = row['count']
        if ((count == 0)) throw new Error('mismatch')

        const salt =  this.getSalt()
        const hashPass = bcrypt.hashSync(password, salt)
        const changed = this.write(`UPDATE EDITORS SET hashPass=?, vcode=null WHERE email=?`
            , hashPass, email)
        return true
    }//()


}//()

// Auth section //////////////////////////////////////////////////////////////////
export class EditorAuthX implements iAuth {
    db: IDB
    constructor(db) {
        this.db = db
    }//()

     auth(user: string, pswd: string, resp?: any, ctx?: any): Promise<string> {
        return new Promise( (resolve, reject) => {
            const ok =  this.db.authEditor(user, pswd)
            log.info('editor AUTH status: ', ok)
            if (ok) return resolve('OK')

            resolve('FAIL')
        })// pro
    }

    retErr(resp: any, msg: any) {
        log.info(msg)
        const ret: any = {} // new return
        ret.errorLevel = -1
        ret.errorMessage = msg
        resp.json(ret)
    }//()

}//class
