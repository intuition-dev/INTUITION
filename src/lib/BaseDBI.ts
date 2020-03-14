
 


export class BaseDBI {
    log:any = new TerseB(this.constructor.name)

    static MAXINT:number = 9223372036854775807 

    sqlite3 = require('sqlite3').verbose()

    protected _fn
    protected _db 
 
    defCon(path,  fn) {
        this._fn = path + fn
        this._db = new this.sqlite3.Database(this._fn)
    }

    // passs in an array
    async read(sql:string, arr) {
        if(!arr) arr =[]
        const THIZ = this
        let rows = new Promise( function(resolve, reject) {
            THIZ._db.all(sql, arr, function(err, rows){
                if(err) reject(err) 
                else resolve(rows)
            })
        })//pro
        return rows
    }//()

    // passs in an array
    async readOne(sql:string, arr) {
        if(!arr) arr =[]
        const THIZ = this
        let row = await new Promise( function(resolve, reject) {
            THIZ._db.get(sql, arr, function(err, row){
                if(err) reject(err) 
                else resolve(row)
            })
        })//pro
        return row
    }//()

    // passs in an array
    async write(sql:string, arr) {
        if(!arr) arr =[]
        const THIZ = this
        await new Promise( function(resolve, reject) {
            THIZ._db.run(sql, arr, function(err){
                if(err) reject(err) 
                else resolve()
            })
        })//pro

    }//()

}// class