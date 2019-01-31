
/**
  No reference to entities
 */
class Example1Bind {

   constructor(){
      this.viewModel = new Example1ViewModel()
   }

   getViewList1(tableID){
      let _this = this
      let columns = [ //Define Table Columns
         {title:"Col1", field:"col1", align:"left", width:150},
         {title:"Col2", field:"col2", align:"left", width:'70%'},
      ];
      Promise.all([this.viewModel.read()])
         .then(function(){
            let data = _this.viewModel.getViewList(tableID)
            _this.setTable(tableID, columns, data)
         })
   }

   getViewList2(tableID){
      let _this = this

      let columns = [ //Define Table Columns
         {title:"Col45", field:"col45", align:"left", width:'70%'},
         {title:"Col55", field:"col55", align:"left", width:'70%'},
      ];

      Promise.all([this.viewModel.read()])
         .then(function(){
            let data = _this.viewModel.getViewList(tableID)
            _this.setTable(tableID, columns, data)
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
