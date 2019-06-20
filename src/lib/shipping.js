"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require('request');
function init(mainApp, name, adbDB) {
    mainApp.post('/api/shipping/' + name, function (req, res) {
        console.log("TCL: init -> name", name);
        const method = req.fields.mode;
        const params = req.fields;
        console.log("TCL: init -> params", params);
        const resp = {};
        let shippingAddress = params.content['shippingAddress'];
        let items_g = params.content['items'];
        console.log("TCL: init -> items_g", items_g);
        let temp_shipping = {};
        temp_shipping['name'] = shippingAddress.fullName;
        temp_shipping['address1'] = shippingAddress.address1;
        temp_shipping['city'] = shippingAddress.city;
        temp_shipping['country_code'] = shippingAddress.country;
        temp_shipping['state_code'] = shippingAddress.province;
        temp_shipping['zip'] = shippingAddress.postalCode;
        let elements = [];
        if ('Live' == method) {
            resp.type = '';
            resp.ispacked = false;
            console.log(resp);
            adbDB.getPrintfulAPI()
                .then(function (printfulApiID) {
                console.log("TCL: init -> printfulApiID", printfulApiID);
                const printfulAPI = printfulApiID[0].printfulApi;
                if (name == "printful-rate") {
                    items_g.map(function (item) {
                        let temp = {};
                        temp['quantity'] = item.quantity;
                        temp['variant_id'] = item.metadata.rate_id;
                        elements.push(temp);
                    });
                    let send_order = Object.assign({ recipient: temp_shipping, items: elements });
                    console.info("1) --send_order:", send_order);
                    request({
                        url: "https://api.printful.com/shipping/rates",
                        headers: {
                            'Authorization': 'Basic ' + printfulAPI,
                        },
                        method: 'POST',
                        json: send_order
                    }, function (error, response, body) {
                        console.info("--body printify-rate:", body);
                        var shippin_rates = {
                            "rates": [{
                                    "cost": 1,
                                    "description": "1$ shipping"
                                }
                            ]
                        };
                        res.json(shippin_rates);
                    });
                }
                if (name == "printful-create-order" && params.eventName == 'order.completed') {
                    items_g.map(function (item) {
                        let temp = {};
                        temp['quantity'] = item.quantity;
                        temp['sync_variant_id'] = item.id;
                        elements.push(temp);
                    });
                    let send_order = Object.assign({ recipient: temp_shipping, items: elements });
                    console.info("2) --send_order:", send_order);
                    request({
                        url: "https://api.printful.com/orders",
                        headers: {
                            'Authorization': 'Basic ' + printfulAPI,
                        },
                        method: 'POST',
                        json: send_order
                    }, function (error, response, body) {
                        console.info("--body:", body);
                        res.json(body);
                    });
                }
            }).catch(function (error) {
                resp.errorLevel = -1;
                resp.errorMessage = error;
                resp.result = false;
                return res.json(resp);
            });
        }
        else {
            resp.errorLevel = -1;
            resp.errorMessage = 'mismatch';
            console.log('respppp errorr', resp);
            res.json(resp);
        }
    });
}
exports.init = init;
module.exports = {
    init
};
