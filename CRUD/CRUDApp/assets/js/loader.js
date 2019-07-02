
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

   addEListener('gotData', onGotData)
}//()

function addEListener(evtName, foo) {
   // 2 choices, if there, call
   if(window.global[evtName]) { 
      console.log('data ahead', evtName)
      foo(window.global[evtName])
      delete window.global[evtName]
   }// else fire the event when there
   else addEventListener(evtName, function(evt){
      console.log(evtName)   
      foo(evt.detail)
      delete window.global[evtName]
   })   
}//()


function onGotData(evt) {
   console.log('gotData', evt)
   window.table1.setData(evt).then(function(){
      $('.blurT').removeClass('blurT')
   })
}//()

