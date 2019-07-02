
declare let disE:any
declare let _start:any

console.log('data in flight', Date.now() - _start)

var tableData = [
   {id:2, name:"Mary May", age:"1", col:"blue" },
   {id:3, name:"Christine Lobowski", age:"42", col:"green"},
   {id:4, name:"Brendon Philips", age:"125", col:"orange" },
   {id:5, name:"Margret Marmajuke", age:"16", col:"yellow" },
]

disE('gotData', tableData)

