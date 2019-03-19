/**
   On cb
   VM maps to screen
   Hides entities
 */
interface iVM {
   // list or array or set
   // object
   getViewChart(name?: string): any // return array for table, params specifying which data needs for table
   getViewList(name?: string): any // return array for table, params specifying which data needs for table
   getViewForm(name?: string): any // return array for table, params specifying which data needs for table

}

// Needs CRUD methods
class TabulatorViewModel {
   exampleModel: any
   _data: object[] = []
   dataSourceType: string = 'real'  //real or fake

   constructor() {
      this.exampleModel = new TabulatorService()
   }

   getViewList(table) {

      switch (table) {
         case 'table1':
            if (this.dataSourceType == 'fake') {
               let rows = [
                  { id: 1, col1: " Bob11", col2: "Bob12" },
                  { id: 2, col1: " Bob21", col2: "Bob22" },
                  { id: 3, col1: " Bob31", col2: "Bob32" },
               ]
               return rows
            }
            return this._data
      }
   }

   read() {
      let _this = this
      return Promise.all([this.exampleModel.read()])
         .then(function (data) {
            _this._data = [].concat(data[0])
         })
      //maybe other read methods from a diffrent entity
   }
}