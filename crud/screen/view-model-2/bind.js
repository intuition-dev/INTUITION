class Bind {

   constructor(){
      this.data = new OneModel();
   }

   init(id){
      this.data.read(this, this.onCB); //reading the data (real or fake)

      let _this = this;

      depp.require(['tabLoaded' ], function() { 
         _this.table = new Tabulator("#"+id, {
            layout:"fitColumns",      //fit columns to width of table
            columns:[ //Define Table Columns
               {title:"id", field:"id", visible:false},
               {title:"Col1", field:"col1", align:"left", width:'50%'},
               {title:"Col2", field:"col2", align:"left", width:'50%'},
            ],
            rowClick:function(e, row){ //trigger 
               var row = row.getData();
               console.log('row: ', row);
               sessionStorage.setItem('row', JSON.stringify(row)); //save object in sessionStorage, to retrive it on the next page(form)
               window.location.replace('/screen/viewmodel/form');
            },
         })//tab
         depp.done('tabReady');
      })//depp

   }

   onCB (rows, ctx) {
      depp.require(['tabReady'], function() { 
         ctx.table.clearData()
         ctx.table.setData(rows)
      })
   }

   getRow() {
      $(this).find('input[name="col1"]').val(this.row['col1']);
      $(this).find('input[name="col2"]').val(this.row['col2']);
      $(this).find('input[name="id"]').val(this.row['id']);
   }

   add(row) {
      let validation = this.data.valid(row);
      
      if (validation=='OK') {
         this.data.add(row);
      } else  {
         console.log('error', validation);
      }
   }

   update(row) {
      let validation = this.data.valid(row);
      
      if(validation=='OK') {
         this.data.update(row);
      } else  {
         console.log('error', validation);
      }
   }

   delete(row) {
      this.data.delete(row);
   }
   
   getFields() {
      let lst = {};
      //start w/ pk
      let input = $(this.form+' [name="id"]');
      lst['id'] = input.val();
   
      $(this.form+' input').each(
         function(){  
            let input = $(this);
            lst[ input.attr('name')] = input.val();
         }
      )//each
      console.log('--lst',lst);
      return lst;
   }//()


   clearFields(){
      $(this).find('input').val('');
   }
     
}