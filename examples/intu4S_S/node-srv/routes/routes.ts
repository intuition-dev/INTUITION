

const stripe = require('stripe')('sk_test_uR3dOqQborl5MbxIahkvDXBg00DQwKMVNJ');
import { BasePgRouter } from 'mbake/lib/Serv'
import { SDB } from '../lib/SDB';


// get session from stripe to browser
// webhook that it was paid, calls ship, sends email

export class Stripe extends BasePgRouter {

   db:SDB 
   
   constructor(db:SDB) {
      super()
      this.db = db
   }

   async createSession(resp, params) {
      let address = params.address
      console.log('Address:', address)

      let line_items = [];
      let items_g = [];
      params.data.forEach(element => {
         let { id, name, description, image, amount, currency, quantity, url } = element
         line_items.push({
            name: name,
            description: description,
            amount: amount,
            currency: currency,
            quantity: quantity,
            // images: [image]
         })
         items_g.push({
            id: id, 
            quantity: quantity
         })
      });
      
      const session = await stripe.checkout.sessions.create({
         payment_method_types: ['card'],
         line_items: line_items,
         success_url: params.data[0]['url'] + '#success',
         cancel_url: params.data[0]['url'] + '#error',
      });
      
      console.log("TCL: Stripe -> createSession -> session", session)

      await this.db.saveSession(session.id, session.payment_intent, address, items_g)
      this.ret(resp, session);
   }
}

module.exports = {
   Stripe
}