

depp.require(['FontsLoaded', 'bsDefaultStyle', 'tabulatorDefaultStyle'], function() {
   console.log('styles')
}) 

depp.require(['tabulator', 'DOM', 'polly'], tab1)

function tab1() {

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