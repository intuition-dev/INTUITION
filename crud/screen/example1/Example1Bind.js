class Example1Bind {

   constructor(){
      this.viewModel = new Example1ViewModel()
   }

   getViewList(tableID){
      let columns = [ //Define Table Columns
         {title:"Col1", field:"col1", align:"left", width:150},
         {title:"Col2", field:"col2", align:"left", width:'70%'},
      ];
      this.setTable(tableID, columns)
   }
   getViewList1(tableID){
      let columns = [ //Define Table Columns
         {title:"Col2", field:"col2", align:"left", width:'70%'},
      ];

      this.setTable(tableID, columns)
   }

   setTable(table, columns){
      let _this = this
      depp.require(['tabLoaded' ], function() {
         _this._table = new Tabulator("#"+table, {
            layout:"fitColumns",      //fit columns to width of table
            columns:columns,
            layoutColumnsOnNewData:true,
            index: "id",
            rowClick:function(e, row){ //trigger
               var row = row.getData()
               sessionStorage.setItem('row', JSON.stringify(row)); //save object in sessionStorage, to retrive it on the next page(form)
               window.location.replace('/screen/example1/form');
            },
         })//tab
         depp.done('onTab');
         // table.setData(data)
         _this.viewModel.getViewList(_this._table)
      })//d
   }

}//class
