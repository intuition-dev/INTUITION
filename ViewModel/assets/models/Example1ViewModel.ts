/**
   On cb
   VM maps to screen
   Hides entities
 */
interface iVM {
   // list or array or set
   // object
   getViewChart(name?:string):any // return array for table, params specifying which data needs for table
   getViewList(name?:string):any // return array for table, params specifying which data needs for table
   getViewForm(name?:string):any // return array for table, params specifying which data needs for table

}

// Needs CRUD methods
class Example1ViewModel {
   exampleModel:any

   constructor(){
      this.exampleModel =  new Example1EModel()
   }

   getViewList(table){
      let _this = this
      console.info("--_this:", _this)
      let data

      switch (table){
         case 'table1':
            data = _this.exampleModel._data
            break;
         case 'table2':
            data = [
               {id:1, col45:'Col45', col55: 'Col55'},
               {id:1, col45:'Col45_2', col55: 'Col55_2'}
            ]
            break;
      }
      return data
   }

   getViewForm(formName, id){
      let _this = this

      return this.read(id)
         .then(function(){
            return _this.exampleModel._data
         })
         .then(function(data){
            console.info("--data:", data)
            return data
         })
   }

   read(id?:string){
      return Promise.all([this.exampleModel.read(id)])
      //maybe other read methods from a diffrent entity
   }

   add(row, cb){
      this.exampleModel.add(row, cb)
   }

   update(row, cb){
      this.exampleModel.update(row, cb)
   }

   delete(row){
      this.exampleModel.delete(row)
   }

   valid(row){
      return this.exampleModel.valid(row)
   }
}