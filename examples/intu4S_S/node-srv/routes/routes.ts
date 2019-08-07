const stripe = require('stripe')('sk_test_uR3dOqQborl5MbxIahkvDXBg00DQwKMVNJ');
import { BasePgRouter } from 'mbake/lib/Serv';
// get session from stripe to browser


// webhook that it was paid, calls ship, sends email

export class Stripe extends BasePgRouter {

   async createSession(resp, params) {
      let address = params.address
      console.log('Address:', address)

      let line_items = [];
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
      });

      const session = await stripe.checkout.sessions.create({
         payment_method_types: ['card'],
         line_items: line_items,
         success_url: params.data[0]['url'] + '#success',
         cancel_url: params.data[0]['url'] + '#error',
      });
      
      console.log("TCL: Stripe -> createSession -> session", session)
      this.ret(resp, session);
   }
}

module.exports = {
   Stripe
}