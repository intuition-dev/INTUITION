class TableBind {

   init(data_, id){
      this.data = data_

      this.data.read(this, this.onCB) //reading the data (real or fake)

      let _this = this

      depp.require(['tabLoaded' ], function() { 
         _this.table = new Tabulator("#"+id, {
            layout:"fitColumns",      //fit columns to width of table
            columns:[ //Define Table Columns
               {title:"id", field:"id", visible:false},
               {title:"Col1", field:"col1", align:"left", width:'50%'},
               {title:"Col2", field:"col2", align:"left", width:'50%'},
            ],
            rowClick:function(e, row){ //trigger 
               var row = row.getData()
               console.log('row: ', row);
               sessionStorage.setItem('row', JSON.stringify(row)); //save object in sessionStorage, to retrive it on the next page(form)
               window.location.replace('/screen/viewmodel/form');
            },
         })//tab
         depp.done('tabReady')
      })//depp

   }//()

   onCB (rows, ctx) {
      depp.require(['tabReady' ], function() { 
         ctx.table.clearData()
         ctx.table.setData(rows)
      })
   }//()

}//class
