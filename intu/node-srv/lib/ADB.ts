
const sqlite3 = require('sqlite3').verbose()

const bcrypt = require('bcryptjs') // to hash passwords
const fs = require('fs-extra')

import { BaseDB } from 'mbake/lib/BaseDB'
import { iAuth } from 'mbake/lib/Serv'

export class ADB extends BaseDB { 
    veri() {
        return 'v0.9.26'
     }
  
    // auth & auth DB
    // emailjs is client side api

   static db
   static salt

    dbExists() {
        return fs.existsSync('./ADB.sqlite')
   }

   con() {
        if(ADB.db) {
        console.log('connection exists')
        return
        }
        console.log('new connection')
        ADB.db =  new sqlite3.Database('./ADB.sqlite')
    }//()

    init() {
        if(this.dbExists())  {
           // if db exists, connect an exit
              this.con()
           return
        }//fi
        if(!(ADB.db)) {
           console.log('no connection made')
           this.con()
        }//fi
  
        ADB.db.run(`CREATE TABLE ADMIN  (email, hashPass, vcode)`) // only one row
        ADB.db.run(`CREATE TABLE CONFIG (emailjsService_id, emailjsTemplate_id, emailjsUser_id, pathToApp, port)`) // only one row
        ADB.db.run(`CREATE TABLE EDITORS(guid, name, email, hashPass, vcode)`)

        let salt = bcrypt.genSaltSync(10)
        ADB.db.run(`CREATE TABLE SALT(salt)`)
        const stmt =  ADB.db.prepare(`INSERT INTO SALT(salt) VALUES( ?)`)
        this._run(stmt, salt )
        ADB.salt = salt
    }

    async getSalt() {
        if(ADB.salt) return ADB.salt
        const qry =  ADB.db.prepare('SELECT * FROM SALT') 
        const rows = await this._qry(qry)
        const row = rows[0]
        ADB.salt = row.salt
        return ADB.salt
    }//()

    async setAdmin(email, password, emailjsService_id, emailjsTemplate_id, emailjsUser_id, port) {
      const salt = await this.getSalt()
      var hashPass = bcrypt.hashSync(password, salt)
     
      const stmt1 =  ADB.db.prepare(`INSERT INTO ADMIN(email, hashPass) VALUES(?,?)`)
      this._run(stmt1, email, hashPass)

      const stmt2 =  ADB.db.prepare(`INSERT INTO CONFIG(emailjsService_id, emailjsTemplate_id, emailjsUser_id, port) VALUES(?,?,?,?)`)
      this._run(stmt2, emailjsService_id, emailjsTemplate_id, emailjsUser_id, port)      
  }//()

    async getPort() {
        const qry =  ADB.db.prepare('SELECT * FROM CONFIG') 
        const rows = await this._qry(qry)
        const row = rows[0]
        return row.port
    }

    setVcodeAdmin() {
        let vcode = Math.floor(1000 + Math.random() * 9000);

        const stmt =  ADB.db.prepare(`UPDATE ADMIN SET vcode=?`)
        this._run(stmt, vcode )
        return vcode
    }//()
    setVcodeEditor(email) {
        let vcode = Math.floor(1000 + Math.random() * 9000);
 
        const stmt =  ADB.db.prepare(`UPDATE EDITORS SET vcode=? WHERE email=?`)
        this._run(stmt, vcode, email )
        return vcode
    }//()

    async authEditor(email, password) {
        const salt = await this.getSalt()
        const hashPassP = bcrypt.hashSync(password, salt)

        const qry =  ADB.db.prepare('SELECT * FROM EDITORS where email =  ?') 
        const rows = await this._qry(qry, email)
        const row = rows[0]
        const hashPassS = row.hashPass

        return hashPassP == hashPassS
    }//()
    async authAdmin(email, password) {
        const salt = await this.getSalt()
        const hashPassP = bcrypt.hashSync(password, salt)

        const qry =  ADB.db.prepare('SELECT * FROM ADMIN where email =  ?') 
        const rows = await this._qry(qry, email)
        const row = rows[0]
        const hashPassS = row.hashPass

        return hashPassP == hashPassS
    }//()

    /**
     * @param guid You can user ToolBelt's getGUID on browser
     * You can set vcode with the vcode method
     */
    async addEditor(guid, name, email, password) {
        const salt = await this.getSalt()
        const hashPass = bcrypt.hashSync(password, salt)

        const stmt =  ADB.db.prepare(`INSERT INTO EDITORS(guid, name, email, hashPass ) VALUES(?,?, ?,?)`)
        await this._run(stmt, guid, name, email, hashPass )
    }//()

    async getConfigs() {
        const qry =  ADB.db.prepare(`SELECT * FROM CONFIG`)
        const rows = await this._qry(qry)
        const row = rows[0]
        return row
    }
    
    setAppPath(pathToApp) {
        const stmt =  ADB.db.prepare(`UPDATE CONFIG SET pathToApp=? `)
        this._run(stmt)
      }

//////////////////
 
  getEditors() {
      return ADB.db.all(`SELECT id, name, email FROM editors`, [], function (err, rows) {
          if (err) throw err
          return rows
      });
  }

  updateEditor(name, id) {
      return ADB.db.run(`UPDATE editors SET name='${name}' WHERE id='${id}'`, function (err) {
          if (err) throw err
          return this.lastID;
      });
  }
  deleteEditor(id) {
      return ADB.db.run(`DELETE FROM editors WHERE id='${id}'`, function (err) {
          if (err) throw err
      });
  }

  resetPasswordAdmin(email, vcode, password) {
      var salt = bcrypt.genSaltSync(10);
      let hashPass = bcrypt.hashSync(password, salt)
      
      return ADB.db.run(`UPDATE admin SET password='${hashPass}' WHERE email='${email}' AND vcode='${vcode}'`)
          .then(res => {
            return res.changes > 0
      })
          .catch(err => {
          return false;
      });
  }

  resetPasswordEditor(email, vcode, password) {
      var salt = bcrypt.genSaltSync(10);
      let hashPass = bcrypt.hashSync(password, salt)

      return ADB.db.run(`UPDATE editors SET password='${hashPass}' WHERE email='${email}' AND vcode='${vcode}'`)
          .then(res => {
          return res.changes > 0
      })
          .catch(err => {
          console.log(err)
          return false;
      });
  }
  

  updateConfig(pathToApp, port, printfulApi, adminId) {
      return ADB.db.run(`UPDATE configs SET pathToApp='${pathToApp}', port='${port}', printfulApi='${printfulApi}' WHERE adminId='${adminId}'`, [], function (err, res) {
          if (err) {
              return console.error('update config error:', err.message);
          }
          return res.changes > 0

      });
  }



   /**
    * this one is used for uptime server monitoring
    * doesn't matter the count result
    **/
   monitor(): any {
      return ADB.db.all("SELECT COUNT(*) AS count FROM ADMIN")
   }

}//()

// Auth section //////////////////////////////////////////////////////////////////
class EditorAuth implements iAuth {
    db:ADB
    constructors(db) {
        this.db = db
    }//()

    auth(user: string, pswd: string, resp?: any, ctx?: any): Promise<string> {     
        return new Promise( async function (resolve, reject) {
        const ok = await this.db.authEditor(user, pswd)
        if(ok) resolve('ok')        
        this.RetErr(resp, 'not ok')
        })// pro
    }    
    retErr(resp: any, msg: any) {
        console.log(msg)
        const ret:any= {} // new return
        ret.errorLevel = -1
        ret.errorMessage = msg
        resp.json(ret)    
    }//()
}//class
class AdminAuth implements iAuth {
    db:ADB
    constructors(db) {
        this.db = db
    }//()

    auth(user: string, pswd: string, resp?: any, ctx?: any): Promise<string> {     
        return new Promise( async function (resolve, reject) {
        const ok = await this.db.authAdmin(user, pswd)
        if(ok) resolve('ok')        
        this.RetErr(resp, 'not ok')
        })// pro
    }    
    retErr(resp: any, msg: any) {
        console.log(msg)
        const ret:any= {} // new return
        ret.errorLevel = -1
        ret.errorMessage = msg
        resp.json(ret)    
    }//()
}//class

module.exports = {
   ADB, EditorAuth, AdminAuth
}
