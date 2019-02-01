
/**
  No reference to entities
 */
class Example1Bind {

   constructor(){
      this.viewModel = new Example1ViewModel()
   }

   getViewList(tableID, tableID2){
      let _this = this
      let columns1 = [ //Define Table Columns
         {title:"Col1", field:"col1", align:"left", width:150},
         {title:"Col2", field:"col2", align:"left", width:'70%'},
      ];
      let columns2 = [ //Define Table Columns
         {title:"Col45", field:"col45", align:"left", width:'70%'},
         {title:"Col55", field:"col55", align:"left", width:'70%'},
      ];
      Promise.all([this.viewModel.read()])
         .then(function(){
            let data1 = _this.viewModel.getViewList(tableID)
            let data2 = _this.viewModel.getViewList(tableID2)
            _this.setTable(tableID, columns1, data1)
            _this.setTable(tableID2, columns2, data2)
         })
   }

   setTable(table, columns, data){
      let _this = this
      depp.require(['tabLoaded' ], function() {
         _this._table = new Tabulator("#"+table, {
            layout:"fitColumns",      //fit columns to width of table
            columns:columns,
            layoutColumnsOnNewData:true,
            index: "id",
            rowClick:function(e, row){ //trigger
               var id = row.getData().id
               sessionStorage.setItem('id', JSON.stringify(id)); //save object in sessionStorage, to retrive it on the next page(form)
               window.location.replace('/screen/example1/form');
            },
         })//tab
         depp.done('onTab');
         _this._table.setData(data)
      })//d
   }

}//class
