import { eventNames } from "cluster";
import { ADB } from "./ADB";

const request = require('request')


// rewrite to be simple, no shipping, using superagent, make into class
// just ship

export class PaidHook {
    printfulApiID: string;

    constructor(printfulApiID) {
        this.printfulApiID = printfulApiID
    }

    async handlePaidHook(req, res) {
        console.log("TCL: init -> name", req)
        const params = req.fields
        console.log("TCL: init -> params", params)
        const method = params.type
        const resp: any = {} // new response
        const db = new ADB();
        await db.init();

        if ('payment_intent.succeeded'==method) {
            const intentId = params.data.object.id
            console.log('Intent', intentId, 'succeed' )
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
                res.json(body); //res is the response object, and it passes info back to client-side
            });

        } else if ('checkout.session.completed'==method) {
            console.log('checkout.session.completed')
            res.json("OK")
        } else {
            resp.errorLevel = -1
            resp.errorMessage = 'mismatch'
            console.log('respppp errorr', resp)
            res.json(resp)
        }


    //     const resp: any = {} // new response
    //     let shippingAddress = params.content['shippingAddress']
    //     let items_g = params.content['items']
    //     console.log("TCL: init -> items_g", items_g)

    //     let temp_shipping = {}
    //     temp_shipping['name'] = shippingAddress.fullName
    //     temp_shipping['address1'] = shippingAddress.address1
    //     temp_shipping['city'] = shippingAddress.city
    //     temp_shipping['country_code'] = shippingAddress.country
    //     temp_shipping['state_code'] = shippingAddress.province
    //     temp_shipping['zip'] = shippingAddress.postalCode

    //     let elements = []

    //     if ('Live' == method) {

    //         resp.type = ''//eg array
    //         resp.ispacked = false
    //         console.log(resp)

    //         console.log("TCL: init -> printfulApiID", this.printfulApiID)
    //         if (name == "printful-rate") {
    //             items_g.map(function (item) {
    //                 let temp = {}
    //                 temp['quantity'] = item.quantity
    //                 temp['variant_id'] = item.metadata.rate_id //variant_id for getting rates, and sync_variant_id for placing the order
    //                 elements.push(temp)
    //             })

    //             let send_order = Object.assign({ recipient: temp_shipping, items: elements })
    //             console.info("1) --send_order:", send_order)
    //             request({
    //                 url: "https://api.printful.com/shipping/rates",
    //                 headers: {
    //                     'Authorization': 'Basic ' + this.printfulApiID,
    //                 },
    //                 method: 'POST',
    //                 json: send_order

    //             }, function (error, response, body) {
    //                 // console.info("--response:", response)
    //                 console.info("--body printify-rate:", body)
    //                 var shippin_rates = {
    //                     "rates": [{
    //                         "cost": 1,
    //                         "description": "1$ shipping"
    //                     }
    //                     ]
    //                 }
    //                 res.json(shippin_rates); //res is the response object, and it passes info back to client-side
    //             });
    //         }

    //         if (name == "printful-create-order" && params.eventName == 'order.completed') {
    //             items_g.map(function (item) {
    //                 let temp = {}
    //                 temp['quantity'] = item.quantity
    //                 temp['sync_variant_id'] = item.id //variant_id for getting rates, and sync_variant_id for placing the order
    //                 elements.push(temp)
    //             })

    //             let send_order = Object.assign({ recipient: temp_shipping, items: elements })
    //             console.info("2) --send_order:", send_order)

    //             request({
    //                 url: "https://api.printful.com/orders",
    //                 headers: {
    //                     'Authorization': 'Basic ' + this.printfulApiID,
    //                 },
    //                 method: 'POST',
    //                 json: send_order
    //             }, function (error, response, body) {
    //                 console.info("--body:", body)
    //                 res.json(body); //res is the response object, and it passes info back to client-side
    //             });
    //         }
    //     } else if (method == 'Test') {
    //         console.log(eventNames)
    //         if (params.eventName == 'shippingrates.fetch') {
    //             res.send({
    //                 "rates": [
    //                     {
    //                         "cost": 10,
    //                         "description": "10$ shipping"
    //                     },
    //                     {
    //                         "cost": 20,
    //                         "description": "20$ shipping",
    //                         "guaranteedDaysToDelivery": 5
    //                     }
    //                 ]
    //             });
    //         } else if (params.eventName == 'shippingrates.fetch') {
    //             res.send({});
    //         }
    //     } else {
    //         resp.errorLevel = -1
    //         resp.errorMessage = 'mismatch'
    //         console.log('respppp errorr', resp)
    //         res.json(resp)
    //     }
    }
}

module.exports = {
    PaidHook
}