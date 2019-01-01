
// pre-reqs, + fb tag
declare var db1: any
declare var validator: any
declare var swal: any
declare var _start: any

// example and optional base impl  ////////////////////////////////////////////////////////////////
// RW ////////////////////////////////////////
class BaseVMod {
   entityName:string 

   dataSourceType: string = 'real' 
   page:string
   constructor() {
      this.page = window.location.href 
   }
   _disE(data:any, ctx:IDBinding):void {
      const msg = {
         data: data,
         ctx: ctx
      }
      dispatchEvent(new CustomEvent('VMod', { detail: msg } ) )
   }
   addModListener(binder:IDBinding):void {
      addEventListener('VMod', binder._onData)
   }

   read(ctx:IDBinding) {
      console.log('reading...', Date.now() - _start)

      if(this.dataSourceType=='fake') {
         let rows = [
            {id:1, col1:" Bob11", col2:"Bob22"},
            {id:2, col1:" Bob11", col2:"Bob22"}
         ]
         this._disE(rows, ctx)
         return
      }

      const ref = db1.collection(this.entityName)
      const THIZ = this
      ref // .where("capital", "==", true)
         .get()
         .then(function(querySnapshot) {
            let rows = []
            querySnapshot.forEach(function(doc) {
               let row = doc.data()
               row['id'] = doc.id
               rows.push(row)  
            })
            THIZ._disE(rows, ctx)
         })
      .catch(function(error) {
         console.log("Error getting documents: ", error)
         //if (reject) reject(error)
      })
   }

   add(row, resolve, reject) {
      if(row.id) delete row.id // that should not be there on add

      let newPK = db1.collection(this.entityName).doc() // make PK
      newPK.set(row) // insert
         .then(function() { 
            console.log('successful')
            if(resolve) resolve(1)
         })
      .catch(function(error) {
         console.error('oops', error)
         if(reject) reject(error)
      })
      console.log(newPK)
      return newPK
   }//()

   update( row, resolve, reject) {
      console.log(row)
      let id = row['id']
      console.log(id, row)
      delete row.id // we are not save pk in a row

      let ref = db1.collection(this.entityName).doc(id)
      ref.set(row) // save
         .then(function() { 
            console.log('successful')
            if(resolve) resolve(1)//1 = ok
         })
      .catch(function(error) {
         console.error('oops', error)
         if(reject) reject(error)
      })
      return id
   }//()
}//class

// rw.js ////////////////////////////////////////////////////////////////
class BaseDBind {
   vmod:BaseVMod;
   form

   log(msg:string) {
      console.log(msg)
   }

   popError(arg:{}): void {
      console.log(arg)
      swal(
         arg
         )
   }//()

   getClassName():string {
      return this.constructor.name
   }

   setFields(row, ctx) {
      //set PK in hidden field
      console.log(ctx.form)
      let input = $(ctx.form+' [name="id"]')
      input.val(row['id'])

      let fields = Object.keys(row)
      fields.forEach(function(field) { // reflect form field names 
         var input = $(ctx.form+' input[name='+field+']')
         input.val(row[field])
      })
   }//()

   clearFields() {
      //set PK in hidden field
      let input = $(this.form+' [name="id"]')
      input.val('')

      $(this.form+' input').each(
         function(index){  
            let input = $(this)
            input.val('')
         }//index
      )//each
   }//()

   getFields() : any {
      let lst = {}
      //start w/ pk
      let input = $(this.form+' [name="id"]')
      lst['id'] = input.val()
   
      $(this.form+' input').each(
         function(index){  
            let input = $(this)
            lst[ input.attr('name')] = input.val()
         }//index
      )//each
      console.log(lst)
      return lst
   }//()

}// class

// ModEg //////////////////////////////////////////////////

class Mod1 extends BaseVMod implements IVModServ {

   constructor() {
      super()
      this.entityName = 'table_one2'
   }

   isAuth(arg?: object): boolean {
      throw new Error("Method not implemented.")
   }
   
   valid(row): string {
      console.log(row)
      let col1 = row['col1']
      let col2 = row['col2']
      if(validator.isEmpty(col1, { ignore_whitespace: true }) )
         return 'Col1 is blank'
      if(validator.isEmpty(col2, { ignore_whitespace: true }) )
         return 'Col2 is blank'
      return 'OK'
   }
}//class