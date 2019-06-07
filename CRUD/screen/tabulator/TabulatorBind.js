
/**
  No reference to entities
 */
class TabulatorBind {

   constructor() {
      this.viewModel = new TabulatorViewModel()
   }
   getViewList(tableID) {
      let _this = this
      let columns1 = [ //Define Table Columns
         { title: "Name", field: "name", width: 150 },
         { title: "Age", field: "age", align: "left", formatter: "progress" },
         { title: "Favourite Color", field: "col" },
         { title: "Date Of Birth", field: "dob", sorter: "date", align: "center" },
      ];
      Promise.all([this.viewModel.read()])
         .then(function () {
            let data1 = _this.viewModel.getViewList(tableID)
            _this.setTable(tableID, columns1, data1)
         })
   }

   setTable(table, columns, data) {
      let _this = this
      depp.require(['tabLoaded'], function () {
         _this._table = new Tabulator("#" + table, {
            layout: "fitColumns",      //fit columns to width of table
            columns: columns,
            layoutColumnsOnNewData: true,
            index: "id",
            rowClick: function (e, row) { //trigger an alert message when the row is clicked
               alert("Row " + row.getData().id + " Clicked!!!!");
            },
         })//tab
         depp.done('onTab');
         _this._table.setData(data)
      })//d
   }
}//class
