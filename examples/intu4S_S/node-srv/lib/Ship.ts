import { IDB } from "./IDB";

const request = require('request')

export class Ship {

    printfulApiID: string;
    constructor(printfulApiID: string) {
        this.printfulApiID = printfulApiID
    }

    async ship(intentId: string) {
        const db = new IDB();
        await db.init();
        console.log('Intent', intentId, 'succeed')

        const session = await db.fetchPaymentIntent(intentId)
        const address = JSON.parse(session.address);
        const items_g = JSON.parse(session.items);
        console.log('Session', session, address)

        let temp_shipping = {}
        temp_shipping['name'] = address.name
        temp_shipping['address1'] = address.address1
        temp_shipping['city'] = address.city
        temp_shipping['country_code'] = address.country_code
        temp_shipping['state_code'] = address.state_code
        temp_shipping['zip'] = address.zip

        let elements = [];
        items_g.map(function (item) {
            let temp = {}
            temp['quantity'] = item.quantity
            temp['sync_variant_id'] = item.id //variant_id for getting rates, and sync_variant_id for placing the order
            elements.push(temp)
        })

        let send_order = Object.assign({ 
            recipient: temp_shipping,
            items: elements 
        })
        console.info("2) --send_order:", send_order)
        console.info("2) --this.printfulApiID:", this.printfulApiID)

        request({
            url: "https://api.printful.com/orders",
            headers: {
                'Authorization': 'Basic ' + Buffer.from(this.printfulApiID).toString('base64'),
            },
            method: 'POST',
            json: send_order
        }, function (error, response, body) {
            console.info("--body:", body)
        });            
    }
}

module.exports = {
    Ship
}