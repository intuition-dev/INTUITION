
declare let httpRPC
// RPC to get session id
class Services {
   serviceRPC: any
   constructor() {
      this.serviceRPC = new httpRPC('http', '0.0.0.0', '3000')
   }

   getSessionId() {
      return this.serviceRPC.invoke("stripe", "get-session", "createSession", {})
   }

}