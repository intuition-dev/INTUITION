/**
   On cb
   VM maps to screen
 */
interface iVM {
   getViewList(params:string):any // return array for table, params specifying which data needs for table
}

// CRUD
class Example1ViewModel {
   exampleModel:any

   constructor(){
      this.exampleModel =  new Example1Model()
   }

   getViewList(table){
      // if table == ''
      this.exampleModel.read(table, this.onCB)
   }

   onCB(table, data){
      table.setData(data)
   }
}