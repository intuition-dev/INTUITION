import { SDB } from "./SDB";

const request = require('request')
// supper agent


export class Ship {
    db: SDB;

    constructor(db: SDB) {
        this.db = db
    }

    ship(items, shippingAddress) {
        console.log("Shiping items", items, 'on address', shippingAddress);
        this.db.getPrintfulAPI()
            .then((printfulApiID) => {
                console.log("TCL: init -> printfulApiID", printfulApiID)
                const printfulAPI = printfulApiID[0].printfulApi

                let temp_shipping = {}
                temp_shipping['name'] = shippingAddress.fullName
                temp_shipping['address1'] = shippingAddress.address1
                temp_shipping['city'] = shippingAddress.city
                temp_shipping['country_code'] = shippingAddress.country
                temp_shipping['state_code'] = shippingAddress.province
                temp_shipping['zip'] = shippingAddress.postalCode

                let elements = []
                items.map(function (item) {
                    let temp = {}
                    temp['quantity'] = item.quantity
                    temp['sync_variant_id'] = item.id //variant_id for getting rates, and sync_variant_id for placing the order
                    elements.push(temp)
                })

                let send_order = Object.assign({ recipient: temp_shipping, items: elements })
                console.info("2) --send_order:", send_order)

                request({
                    url: "https://api.printful.com/orders",
                    headers: {
                        'Authorization': 'Basic ' + printfulAPI,
                    },
                    method: 'POST',
                    json: send_order
                }, function (error, response, body) {
                    console.info("--body:", body)
                    console.info("--error:", error)
                });
            })
    }
}

module.exports = {
    Ship
}