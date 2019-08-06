
declare let httpRPC
// RPC to get session id
class Services {
   serviceRPC: any
   constructor() {
      this.serviceRPC = new httpRPC('http', '0.0.0.0', '3000')
   }

   getSessionId(id: string, name: string, description: string, image: string, amount: number, currency: string, quantity: number, url: string) {
      console.log('getSessionId', JSON.stringify({
         id: id,
         name: name,
         amount: amount,
         image: image,
         url: url,
         description: description,
         quantity: quantity,
         currency: currency,
      }));
      return this.serviceRPC.invoke("stripe", "get-session", "createSession", { id: id, name: name, description: description, image: image, amount: amount, currency: currency, quantity: quantity, url: url })
   }

}