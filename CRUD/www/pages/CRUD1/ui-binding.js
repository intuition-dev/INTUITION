
console.log('ui binding')
// required dependencies  are in each script

depp.require(['poly'], onPoly)
depp.define({'CRUD':'/models/CRUD1ViewModel.js'})
function onPoly() {
   // view model(VM) load ASAP
   depp.require('CRUD')
}

// data binding to VM
// setup tabulator
var vm
depp.require(['tabulator', 'DOM', 'poly', 'jquery', 'VM'], tab1)
function tab1() {
   vm = new CRUDvm()
   vm._all()
   
   console.log('tabulator', Date.now() - _start)
   window.table1 = new Tabulator('#table1', {
      layout:'fitColumns', 
      columns:[ //Define Table Columns
         {title:'Name', field:'name', width:150},
         {title:'Age', field:'age', align:'left'},
         {title:'Favorite Color', field:'col'},
      ],
      rowClick:function(e, row){ 
         console.log(row.getData().id)
      }
   })

   // binding step 1:
   addE1Listener('gotData', onGotData)

   // events
   $('#but1').click(function(evt){
      console.log('but1')
      $('#but1').blur()
   })

}//()
depp.require('tabulatorDefaultStyle')

depp.require(['gridformsDefaultStyle', 'jquery'], function(){
   console.log('gform', Date.now() - _start)
   $('.blurF').removeClass('blurF')
   depp.require('tabulatorDefaultStyle')
})

// binding step 2:
function onGotData(evt) {
   console.log('gotData')

   window.table1.setData(evt).then(function(){
      $('.blurT').removeClass('blurT')
   })

}//()

