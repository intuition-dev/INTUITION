"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Serv_1 = require("mbake/lib/Serv");
var request = require('request');
const yaml = require('js-yaml');
const fs = require('fs');
let config = yaml.load(fs.readFileSync('config.yaml'))[process.env.NODE_ENV || 'local'];
const app = Serv_1.ExpressRPC.makeInstance(config.cors);
const port = 3000;
app.post('/printify-rate', function (req, res) {
    console.info("--res:", res);
    console.log('--req.fields', req.fields);
    const method = req.fields.mode;
    const params = req.fields;
    const resp = {};
    let shippingAddress = params.content['shippingAddress'];
    console.info("--shippingAddress:", shippingAddress);
    let items_g = params.content['items'];
    console.info("--items:", items_g);
    let temp_shipping = {};
    temp_shipping['name'] = shippingAddress.fullName;
    temp_shipping['address1'] = shippingAddress.address1;
    temp_shipping['city'] = shippingAddress.city;
    temp_shipping['country_code'] = shippingAddress.country;
    temp_shipping['state_code'] = shippingAddress.province;
    temp_shipping['zip'] = shippingAddress.postalCode;
    let elements = [];
    items_g.map(function (item) {
        let temp = {};
        temp['quantity'] = item.quantity;
        temp['variant_id'] = item.id;
        elements.push(temp);
    });
    let send_order = Object.assign({ recipient: temp_shipping, items: elements });
    console.info("--send_order:", send_order);
    if ('Test' == method) {
        resp.type = '';
        resp.ispacked = false;
        console.log(resp);
        request({
            url: "https://api.printful.com/shipping/rates",
            headers: {
                'Authorization': 'Basic ' + config.apiKey,
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
    else {
        resp.errorLevel = -1;
        resp.errorMessage = 'mismatch';
        console.log(resp);
        res.json(resp);
    }
});
app.post('/printify-create-order', (req, res) => {
    console.info("--res:", res);
    console.log(req.fields);
    const user = req.fields.user;
    const pswd = req.fields.pswd;
    const mode = req.fields.mode;
    console.info("--mode:", mode);
    const params = req.fields;
    let shippingAddress = params.content['shippingAddress'];
    console.info("--shippingAddress:", shippingAddress);
    let items_g = params.content['items'];
    console.info("--items:", items_g);
    let temp_shipping = {};
    temp_shipping['name'] = shippingAddress.fullName;
    temp_shipping['address1'] = shippingAddress.address1;
    temp_shipping['city'] = shippingAddress.city;
    temp_shipping['country_code'] = shippingAddress.country;
    temp_shipping['state_code'] = shippingAddress.province;
    temp_shipping['zip'] = shippingAddress.postalCode;
    let elements = [];
    items_g.map(function (item) {
        let temp = {};
        temp['quantity'] = item.quantity;
        temp['sync_variant_id'] = item.metadata.sync_variant_id;
        elements.push(temp);
    });
    let send_order = Object.assign({ recipient: temp_shipping, items: elements });
    console.info("--send_order:", send_order);
    const resp = {};
    if ('Test' == mode) {
        resp.type = '';
        resp.ispacked = false;
        console.log(resp);
        request({
            url: "https://api.printful.com/orders",
            headers: {
                'Authorization': 'Basic ' + config.apiKey,
            },
            method: 'POST',
            json: send_order
        }, function (error, response, body) {
            console.info("--body:", body);
            res.json(body);
        });
    }
    else {
        resp.errorLevel = -1;
        resp.errorMessage = 'mismatch';
        console.log(resp);
        res.json(resp);
    }
    console.info();
});
app.listen(port, () => console.log(`ShopApi app listening on port ${port}!`));
