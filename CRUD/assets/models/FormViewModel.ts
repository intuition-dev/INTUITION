declare let validator;
/**
   On cb
   VM maps to screen
   Hides entities
 */
interface iVM {
   // list or array or set
   // object
   getViewChart(name?: string): any // return array for table, params specifying which data needs for table
   getViewForm(name?: string): object // return array for the form

}

// Needs CRUD methods
class FormViewModel {
   exampleModel: any
   _dataObj: object = {}
   dataSourceType: string = 'fake'  //real or fake

   constructor() {
      this.exampleModel = new TabulatorService()
   }

   getViewForm(formName) {
      if (formName == 'form1') {
         return this._dataObj
      }
   }

   read(id?: string) {
      let _this = this

      if (this.dataSourceType == 'fake') {
         let row = { id: 1, col1: " Bob11", col2: "Bob12" }

         return Promise.all([row])
            .then(function (data) {
               console.info("--data:", data)
               Object.assign(_this._dataObj, data[0])
            })
      }

      return Promise.all([this.exampleModel.read(id)])
         .then(function (data) {
            Object.assign(_this._dataObj, data[0])
         })
      //maybe other read methods from a diffrent entity
   }

   add(row, cb) {
      return this.exampleModel.add(row)
   }

   update(row, cb) {
      return this.exampleModel.update(row, cb)
   }

   delete(row) {
      return this.exampleModel.delete(row)
   }

   valid(row) {
      let col1 = row['col1']
      let col2 = row['col2']
      if (validator.isEmpty(col1, { ignore_whitespace: true }))
         return 'Col1 is blank'
      if (validator.isEmpty(col2, { ignore_whitespace: true }))
         return 'Col2 is blank'
      return 'OK'
   }
}