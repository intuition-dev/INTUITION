declare var db1: any
declare var _disE: any

class ServiceOne { // testable crud and fake flag, heavy work. view-model

   entityName: string = 'table_one2' //name of the collection in DB
   dataSourceType: string = 'real'  //real or fake
   form

   read(ctx, cb){
      console.log('- reading...', ctx)

      if(this.dataSourceType=='fake') {
         let rows = [
            {id:1, col1:" Bob11", col2:"Bob12"},
            {id:2, col1:" Bob21", col2:"Bob22"},
            {id:3, col1:" Bob31", col2:"Bob32"}
         ]
         cb(rows, ctx)
         return
      }

      const ref = db1.collection(this.entityName)
      ref
         .get()
         .then(function(querySnapshot) {
            let rows = []
            querySnapshot.forEach(function(doc) {
               let row = doc.data()
               row['id'] = doc.id
               rows.push(row)  
            })
            cb(rows, ctx)
         })
      .catch(function(error) {
         console.log("Error getting documents: ", error)
      })
   }//()

   add( row, cb ) { //resolve, reject) {
      if(row.id) delete row.id // that should not be there on add

      let newPK = db1.collection(this.entityName).doc() // make PK
      newPK.set(row) // insert
         .then(function() { 
            console.log('successful')
            cb(newPK)
         })
      .catch(function(error) {
         console.error('oops', error)
      })
   }//()

}
