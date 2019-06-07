/**
   On cb
   VM maps to screen
   Hides entities
 */
interface iVM {
   // list or array or set
   // object
   getViewList(name?: string): any // return array for table, params specifying which data needs for table
}

// Needs CRUD methods
class TabulatorViewModel {
   exampleModel: any
   _data: object[] = []
   dataSourceType: string = 'fake'  //real or fake

   getViewList(table) {
      switch (table) {
         case 'example-table':
            return this._data
      }
   }

   read() {
      let _this = this

      if (this.dataSourceType == 'fake') {
         let rows = [
            { id: 1, name: "Oli Bob", age: "12", col: "red", dob: "" },
            { id: 2, name: "Mary May", age: "1", col: "blue", dob: "14/05/1982" },
            { id: 3, name: "Christine Lobowski", age: "42", col: "green", dob: "22/05/1982" },
            { id: 4, name: "Brendon Philips", age: "125", col: "orange", dob: "01/08/1980" },
            { id: 5, name: "Margret Marmajuke", age: "16", col: "yellow", dob: "31/01/1999" },
         ]

         return Promise.all([rows])
            .then(function (data) {
               _this._data = [].concat(data[0])
            })
      }
   }
}