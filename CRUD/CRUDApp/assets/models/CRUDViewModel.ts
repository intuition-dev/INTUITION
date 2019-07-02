
declare let disE:any
declare let _start:any
declare let depp:any
declare let window:any

var tableData = [
   {id:1, name:'Mary May', age:'1', col:'blue' },
   {id:2, name:'Christine Lobowski', age:'42', col:'green'},
   {id:3, name:'Brendon Philips', age:'125', col:'orange' },
   {id:4, name:'Margret Marmajuke', age:'16', col:'yellow' },
]

// passing data vs file i/o of local-storage
disE2('gotData', tableData)


depp.require(['RPC'])

console.log('data in flight', Date.now() - _start)

//button to validate and spin

// this async dispatch can help, for example in promise
function disE2(evtName, msg) {
   setTimeout(function(){
     dispatchEvent(new CustomEvent(evtName, { detail: msg }))
     window.global[evtName] = msg
     console.log(evtName)
   },1)
 }