declare var db1: any

class ViewModelDataServ {

   entityName: string = 'table_one2' //name of the collection in FS
   dataSourceType: string = 'real'  //real or fake
   form

   read(ctx){
      console.log('--ViewModelDataServ reading...', ctx)

      if(this.dataSourceType=='fake') {
         let rows = [
            {id:1, col1:" Bob11", col2:"Bob12"},
            {id:2, col1:" Bob21", col2:"Bob22"},
            {id:3, col1:" Bob31", col2:"Bob32"}
         ]
         this._disE(rows, ctx)
         return
      }

      const ref = db1.collection(this.entityName)
      const _this = this
      ref
         .get()
         .then(function(querySnapshot) {
            let rows = []
            querySnapshot.forEach(function(doc) {
               let row = doc.data()
               row['id'] = doc.id
               rows.push(row)  
            })
            _this._disE(rows, ctx)
         })
      .catch(function(error) {
         console.log("Error getting documents: ", error)
         //if (reject) reject(error)
      })
   }
   
   _disE(data:any, ctx):void { //So i guess, its better to keep this dispatch, as all classes will inherit from this one, and remove the one from load.js
      console.log('--_disE data: ', data);

      const msg = {
         data: data,
         ctx: ctx
      }

      dispatchEvent(new CustomEvent('ViewModelDataServEvent', {detail: msg})) // so when this event dispatched, call the _onData function, from the listener
   }

   addModListener(binder):void {
      console.log('--addModListener binder: ', binder);
      addEventListener('ViewModelDataServEvent', binder._onData) //add a listener, and a callback function when the event will be dispatched
   }

   add( row, resolve, reject) {
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
}
