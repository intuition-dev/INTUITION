
function onData(data) {// no need for data

   //let data = vm.getViewObject('form1')
   //do binding 
  }
  
read(ctx, onData)

  

class Example1Bind {

   init(id){
      this.data = new Example1Model()

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
               console.info('row: ', row);
               sessionStorage.setItem('row', JSON.stringify(row)); //save object in sessionStorage, to retrive it on the next page(form)
               window.location.replace('/screen/example1/form');
            },
         })//tab
         depp.done('tabReady')
      })//depp

   }//()

   onCB (rows, ctx) {
      depp.require(['tabReady' ], function() {
         ctx.table.replaceData(rows)
      })
   }//()

}//class
