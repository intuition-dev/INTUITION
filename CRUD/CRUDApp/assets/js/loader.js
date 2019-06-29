
depp.define({'oops':'https://cdn.jsdelivr.net/npm/tabulator-tables@4.2.7/dist/css/tabulator.css'})

depp.require(['FontsLoaded', 'bsDefaultStyle', 'tabulatorDefaultStyle'], function() {
   console.log('styles')
}) 
//'tabulatorDefaultStyle'

depp.require(['tabulator', 'DOM'], tab1)

function tab1() {
   
   var tabledata = [
      {id:2, name:"Mary May", age:"1", col:"blue" },
      {id:3, name:"Christine Lobowski", age:"42", col:"green"},
      {id:4, name:"Brendon Philips", age:"125", col:"orange" },
      {id:5, name:"Margret Marmajuke", age:"16", col:"yellow" },
   ]

   var table = new Tabulator('#table1', {
      data:tabledata, //assign data to table
      layout:"fitColumns", //fit columns to width of table (optional)

      columns:[ //Define Table Columns
         {title:"Name", field:"name", width:150},
         {title:"Age", field:"age", align:"left"},
         {title:"Favourite Color", field:"col"},
      ],

      rowClick:function(e, row){ //trigger an alert message when the row is clicked
         //alert("Row " + row.getData().id + " Clicked!!!!");
      }
   })
   console.log('tab1')

}