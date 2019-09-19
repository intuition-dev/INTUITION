
declare var Tabulator: any
declare var addE1Listener: any
declare var CRUDvm: any
declare var depp: any
declare var _start
declare var $

console.log('ui binding')
// required dependencies  are in each script

depp.define({ 'CRUD': ['/models/CRUD1ViewModel.js'] })

depp.require(['poly'], onPoly)
function onPoly() {
   // view model(VM) load ASAP
   depp.require('CRUD')
}

depp.require(['tabulator', 'DOM', 'poly', 'jquery'], tab1)

depp.require(['gridformsDefaultStyle', 'jquery'], function () {
   console.log('gform', Date.now() - _start)
   $('.blurF').removeClass('blurF')
   depp.require('tabulatorDefaultStyle')
})


var vm
// data binding to VM
// setup tabulator

async function tab1() {
   loadVexAlertFlat()

   //encapsulation start
   vm = await CRUDvm.inst()
   console.log('TTT')

   vm._all() // call some method, mostly data
   //encapsulation end

   console.log('tabulator', Date.now() - _start)
   window.table1 = new Tabulator('#table1', {
      layout: 'fitColumns',
      columns: [ //Define Table Columns
         { title: 'Name', field: 'name', width: 150 },
         { title: 'Age', field: 'age', align: 'left' },
         { title: 'Favorite Color', field: 'col' },
      ],
      rowClick: function (e, row) {
         console.log(row.getData().id)
      }
   })

   // binding step 1:
   addE1Listener('gotData', onGotData)

   // events
   $('#but1').click(function (evt) {
      console.log('but1')
      
      vex.dialog.open({
         message: 'Please, make sure all the fields are filled with data',
         buttons: [
            $.extend({}, vex.dialog.buttons.YES, { text: 'Ok' }),
            $.extend({}, vex.dialog.buttons.NO, { text: 'Cancel' })
         ],
         callback: function (data) {
            if (!data) {
               console.log('Cancelled')
            } else {
               console.log('Ok')
            }
         }
      })

      $('#but1').blur()
   })

}//()

// binding step 2:
function onGotData(evt) {
   console.log('gotData')

   window.table1.setData(evt).then(function () {
      $('.blurT').removeClass('blurT')
   })

}//()

