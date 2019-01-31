/**
   On cb
   VM maps to screen
   Hides entities
 */
interface iVM {
   // list or array or set
   // object
   getViewChart(name?:string):any // return array for table, params specifying which data needs for table
   getViewForm(name?:string):object // return array for the form

}

// Needs CRUD methods
class FormViewModel {
   exampleModel:any

   constructor(){
      this.exampleModel =  new Example1EModel()
   }

   getViewForm(formName){
      return this.exampleModel._dataObj
   }

   read(id?:string){
      return Promise.all([this.exampleModel.read(id)])
      //maybe other read methods from a diffrent entity
   }

   add(row, cb){
      return this.exampleModel.add(row)
         .then(function(){
            window.location.replace('/screen/example1')
         })
   }

   update(row, cb){
      return this.exampleModel.update(row, cb)
         .then(function(id){
            console.log('document with', id , 'was updated')
         })
   }

   delete(row){
      this.exampleModel.delete(row)
         .then(function(id){
            window.location.replace('/screen/example1')
         })
   }

   valid(row){
      return this.exampleModel.valid(row)
   }
}