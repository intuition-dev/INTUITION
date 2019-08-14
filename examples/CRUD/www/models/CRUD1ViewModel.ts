
declare var _start:any
declare var depp:any
declare var disE1:any
declare var httpRPC:any
declare var getGUID: any

console.log('VMLoaded')

var tableData = [
   {id:1, name:'Mary May', age:'1', col:'blue' },
   {id:2, name:'Christine Lobowski', age:'42', col:'green'},
   {id:3, name:'Brendon Philips', age:'125', col:'orange' },
   {id:4, name:'Margret Marmajuke', age:'16', col:'yellow' },
]

disE1('gotData', tableData)

class CRUDvm implements iViewModel {

   getData(): Object {
      throw new Error("Method not implemented.");
   }
   
   log(...a: any[]) {
      throw new Error("Method not implemented.");
   }

   // can be in services class so other VM can use
   rpc

   //encapsulation start
   constructor(arg) {
      if(42!==arg) throw new Error('use static inst()') // guard!
   }

   setup() {
      var pro = window.location.protocol
      pro  = pro.replace(':','')
      var host = window.location.hostname
      var port = window.location.port
      this.rpc = new httpRPC(pro, host, 8888)
   }

   static _instance:CRUDvm
   static inst():Promise<CRUDvm> {
      return new Promise(function(res,rej) {
                
         if(CRUDvm._instance) res(CRUDvm._instance)   

         depp.require(['RPC','spin-custEl'],function(){
            console.log('MODEL!')

            CRUDvm._instance = new CRUDvm(42)
            CRUDvm._instance.setup()
            res(CRUDvm._instance)   
         })//req   
      })//pro
   }//()
   //encapsulation end

   _all() {
      var prom = this.rpc.invoke('api', 'CRUD1Pg', 'selectAll', {a:5, b:2})
      // the most important step in the loading waterfall - after the first paint
      console.log('***', 'data in flight', Date.now() - _start)
      disE1('spin-stop','stop')
      
      prom.then(function(resp) {
         console.log('resp', resp, Date.now() - _start)
      }).catch(function (err) {
         console.log('err', err)
      })
   }//()

   // insert
   ins(name, topics) {
      var guid = getGUID()
      var prom = this.rpc.invoke('api', 'CRUD1Pg', 'insert', { guid:guid, name:name, topics:topics })
      
      prom.then(function(resp) {
         console.log('resp', resp)
      }).catch(function (err) {
         console.log('err', err)
      })
   }//()

   validate():string {
      return 'OK'
   }//()

}
