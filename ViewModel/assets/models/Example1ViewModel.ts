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
   read(id?:string){
      return Promise.all([this.exampleModel.read()])
      //maybe other read methods from a diffrent entity
   }
}