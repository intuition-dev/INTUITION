class Example1Bind {


   init(){
      this.data = new Example1Model()
      return this.data.read() //reading the data (real or fake)
   }//()

   getViewList1(tableId){
      let columns = [ //Define Table Columns
         {title:"Col1", field:"col1", align:"left", width:150},
         {title:"Col2", field:"col2", align:"left", width:'70%'},
      ];
      let params = ['id', 'col1', 'col2']

      let data = this.data.getViewList(params) //thats where we get and later bind the data

      this.setTable(tableId, columns, data)
   }

   getViewList2(tableId){
      let columns = [ //Define Table Columns
         {title:"Col2", field:"col2", align:"left", width:'100%'},
      ];
      let params = ['id', 'col2']

      let data = this.data.getViewList(params) //thats where we get and later bind the data

      this.setTable(tableId, columns, data)
   }

   setTable(tableId, columns, data){

      depp.require(['tabLoaded' ], function() {
         let table = new Tabulator("#"+tableId, {
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
         table.setData(data)
      })//depp

   }

}//class
