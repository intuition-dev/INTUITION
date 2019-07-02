
// data binding
// setup tabulator:
depp.require(['tabulator', 'tabulatorDefaultStyle', 'DOM', 'polly', 'jquery'], tab1)
function tab1() {
   console.log('tabulator')
   window.table1 = new Tabulator('#table1', {
      layout:"fitColumns", 
      columns:[ //Define Table Columns
         {title:"Name", field:"name", width:150},
         {title:"Age", field:"age", align:"left"},
         {title:"Favourite Color", field:"col"},
      ],
      rowClick:function(e, row){ 
         console.log(row.getData().id)
      }
   })

   addE1Listener('gotData', onGotData)
}//()
function onGotData(evt) {
   console.log('gotData', evt)
   window.table1.setData(evt).then(function(){
      $('.blurT').removeClass('blurT')
   })
}//()

// loading
// load UX
depp.require(['gridformsDefaultStyle', 'jquery'], function(){
   console.log('gform')
   $('.blurF').removeClass('blurF')
})
depp.require(['FontsLoaded', 'bsDefaultStyle'], function() {
   console.log('styles', Date.now() - _start)
   $('.delayShowing').removeClass('delayShowing')
}) 

