
class BindTab extends BaseDBind  { // from binding is in the form module

   init(id, bindForm_) {
      this.vmod = new Mod1()
      // key part 
      this.vmod.addModListener(this)// key part 

      this.bindForm = bindForm_
      let tabledata = [
            {id:1, col1:" Bob", col2:"Bob2"}
         ]

      const THIZ = this

      depp.require(['pre','tabLoaded' ], function() { 
         THIZ.table = new Tabulator("#"+id, {
            data:tabledata, //assign data to table
            layout:"fitColumns",      //fit columns to width of table
            columns:[ //Define Table Columns
               {title:"id", field:"id", visible:false},
               {title:"Col1", field:"col1", align:"left", width:'50%'},
               {title:"Col2", field:"col2", align:"left", width:'50%'},
            ],
            rowClick:function(e, row){ //trigger 
               var row = row.getData()
               disE('row', row, THIZ.bindForm)
            },
         })

         depp.done('tabReady')
      })

      this.vmod.read(this)
   }
   
   _onData (evt) {
      depp.require(['tabReady'], function() { 
         console.log('data done', Date.now() - _start)
         console.log( evt.detail )
         const rows = evt.detail.data
         const ctx = evt.detail.ctx
         ctx.table.clearData(rows)
         ctx.table.addData(rows)
         ctx.table.setData(rows)
      })
   }

   getVMod() {
      return this.vmod 
   }

   getFields() {
      throw new Error("Method not implemented.")
   }

}//class