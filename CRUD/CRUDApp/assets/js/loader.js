
// load UX
depp.require(['gridformsDefaultStyle', 'jquery'], function(){
   console.log('gf')
   $('.blurF').removeClass('blurF')
})
depp.require(['FontsLoaded', 'bsDefaultStyle'], function() {
   console.log('styles', Date.now() - _start)
   $('.delayShowing').removeClass('delayShowing')
}) 
// setup tabulator:
depp.require(['tabulator', 'tabulatorDefaultStyle', 'DOM', 'polly', 'jquery'], tab1)
function tab1() {
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

   console.log('Data?')
   // 2 possibilities, impossible to predict if data is there, or we are waiting
   addEventListener('gotData', function(evt){
      console.log(evt)   
      onGotData(evt.detail)
   })   
   if(window.table1data) onGotData('data ahead')
}//()

function onGotData(evt) {
   console.log('gotData', evt)
   window.table1.setData(evt).then(function(){
      $('.blurT').removeClass('blurT')
   })
}//()

