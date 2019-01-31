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
      this.exampleModel =  new Example1Model()
   }

   getViewList(table){
      // if table == '1'
      this.exampleModel.read(table, this.onCB)
      // else if table 2 
      // ... 
   }

   onCB(table, data){
      table.setData(data)
   }
}