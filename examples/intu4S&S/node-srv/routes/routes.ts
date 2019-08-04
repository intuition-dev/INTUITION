const stripe = require('stripe')('sk_test_uR3dOqQborl5MbxIahkvDXBg00DQwKMVNJ');
import { BasePgRouter } from 'mbake/lib/Serv';
// get session from stripe to browser


// webhook that it was paid, calls ship, sends email

export class Stripe extends BasePgRouter {

   async createSession(resp, params) {
      let { id, name, description, image, amount, currency, quantity } = params //destructure params

      const session = await stripe.checkout.sessions.create({
         payment_method_types: ['card'],
         line_items: [{
            name: name,
            description: description,
            amount: amount,
            currency: currency,
            quantity: quantity,
         }],
         success_url: 'https://example.com/success',
         cancel_url: 'https://example.com/cancel',
      });
      console.log("TCL: Stripe -> createSession -> session", session)
      this.ret(resp, session);
   }
}

module.exports = {
   Stripe
}