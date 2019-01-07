class Bind {

   constructor(){
      this.form = '';
      this.data = new OneModel();
   }

   init(formId, tabId){
      this.data.read(this, this.onCB); //reading the data (real or fake)

      this.form = '#' + formId;

      let _this = this;

      depp.require(['tabLoaded' ], function() {
         _this.table = new Tabulator("#"+tabId, {
            layout:"fitColumns",      //fit columns to width of table
            columns:[ //Define Table Columns
               {title:"id", field:"id", visible:false},
               {title:"Col1", field:"col1", align:"left", width:'50%'},
               {title:"Col2", field:"col2", align:"left", width:'50%'},
            ],
            rowClick:function(e, row){ //trigger 
               var row = row.getData();
               console.log('row: ', row);
               $('input[name="col1"]').val(row.col1);
               $('input[name="col2"]').val(row.col2);
               $('input[name="id"]').val(row.id);
            },
         })//tab
         depp.done('tabReady');
      })//depp

   }

   onCB (rows, ctx) {
      depp.require(['tabReady'], function() { 
         ctx.table.clearData();
         ctx.table.setData(rows);
      })
   }

   add(row) {
      let validation = this.data.valid(row);
      
      if (validation=='OK') {
         this.data.add(row).then(() => this.redraw());
      } else  {
         console.log('error', validation);
      }
   }

   update(row) {
      let validation = this.data.valid(row);
      
      if(validation=='OK') {
         this.data.update(row);
         this.redraw();
      } else  {
         console.log('error', validation);
      }
   }

   delete(row) {
      this.data.delete(row).then(()=> this.redraw());
   }
   
   getFields() {
      let lst = {}
      //start w/ pk
      let input = $(this.form+' [name="id"]');
      lst['id'] = input.val();
   
      $(this.form+' input').each(
         function(){  
            let input = $(this);
            lst[ input.attr('name')] = input.val();
         }
      );
      console.log('--lst',lst);
      return lst;
   }


   clearFields() {
      $('input').val('');
   }

   redraw() {
      this.data.read(this, this.onCB);
      this.clearFields();
   }
     
}