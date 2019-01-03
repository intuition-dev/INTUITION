class BindDataToTheTable { //extends ViewModelDataServ {

   init(data, id){

      this.addModListener(this)// key part, adding the listener
      this.read(this) //reading the data (real or fake)

      this.bindForm = new BindForm('form1')

      //Fake Data to generate the table
      let tabledata = [
         {id:1, col1:" Bob", col2:"Bob2"},
      ]

      let _this = this
      depp.require(['pre','tabLoaded' ], function() { 
         _this.table = new Tabulator("#"+id, {
            data:tabledata, //assign data to table
            layout:"fitColumns",      //fit columns to width of table
            columns:[ //Define Table Columns
               {title:"id", field:"id", visible:false},
               {title:"Col1", field:"col1", align:"left", width:'50%'},
               {title:"Col2", field:"col2", align:"left", width:'50%'},
            ],
            rowClick:function(e, row){ //trigger 
               var row = row.getData()
               console.log('row: ', row);
               localStorage.setItem('row', JSON.stringify(row)); //save object in localStorage, to retrive it on the next page(form)
               window.location.replace('/screen/viewmodel/form');
            },
         })
         depp.done('tabReady') //only after table was generate and tabulator loaded, run the _onData
      })
   }

   _onData (evt) {
      depp.require(['tabReady' ], function() { 
         const rows = evt.detail.data
         const ctx = evt.detail.ctx
         ctx.table.clearData(rows)
         ctx.table.addData(rows)
         ctx.table.setData(rows)
      })
   }
}
