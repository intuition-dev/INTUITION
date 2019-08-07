
declare let httpRPC
// RPC to get session id
class Services {
   serviceRPC: any
   constructor() {
      this.serviceRPC = new httpRPC('http', '0.0.0.0', '3000')
   }

   getSessionId(data: Array<Object>, address: Object) {
      console.log('getSessionId', JSON.stringify(data), JSON.stringify(address));
      let request = {
         data: data,
         address: address
      }
      return this.serviceRPC.invoke("stripe", "get-session", "createSession", request)
   }
}