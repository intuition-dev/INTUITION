//declare var db1: any
//declare var validator: any
//declare var _start: any

class Example1Service { // testable crud and fake flag, heavy work. view-model

   entityName: string = 'table_one2' //name of the collection in DB
   /**
    * On cb, you can also get the model
    * @param ctx
    * @param cb
    */
   read(id?:string){
      let _this = this
      console.info('--reading...', Date.now() - _start)

      let ref = db1.collection(this.entityName)

      if(id){
         return db1.collection(this.entityName).doc(id)
         .get()
         .then(function(docSnap) {
            let temp = docSnap.data()
            temp['id'] = docSnap.id
            // Object.assign(_this._dataObj, temp)
            return temp
         })
      .catch(function(error) {
         console.info("Error getting documents: ", error)
      })
      }

      return ref
         .get()
         .then(function(querySnapshot) {
            let rows = []
            querySnapshot.forEach(function(doc) {
               let row = doc.data()
               row['id'] = doc.id
               rows.push(row)
            })
            return rows
         })
      .catch(function(error) {
         console.info("Error getting documents: ", error)
      })
   }//()

   add( row) { //resolve, reject) {
      if(row.id) delete row.id // that should not be there on add

      let newPK = db1.collection(this.entityName).doc() // make PK
      return newPK.set(row) // insert
            .then(function() {
               console.info('successful')
            })
         .catch(function(error) {
            console.error('oops', error)
         })
   }//()

   update( row) { //resolve, reject) {
      console.info(row)
      let id = row['id']
      console.info(id, row)
      delete row.id // we are not save pk in a row

      let ref = db1.collection(this.entityName).doc(id)
      return ref.set(row) // save
         .then(function() {
            console.info('successful')
            return id
         })
      .catch(function(error) {
         console.error('oops', error)
      })

   }//()

   delete(row){
      let id = row['id']

      let ref = db1.collection(this.entityName).doc(id)
      return ref.delete() // delete
            .then(function() {
               console.info('successfully deleted')
            })
         .catch(function(error) {
            console.error('oops', error)
         })
   }

   valid(row) {
      let col1 = row['col1']
      let col2 = row['col2']
      if(validator.isEmpty(col1, { ignore_whitespace: true }) )
         return 'Col1 is blank'
      if(validator.isEmpty(col2, { ignore_whitespace: true }) )
         return 'Col2 is blank'
      return 'OK'
   }
}
