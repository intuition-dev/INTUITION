import { ExpressRPC } from 'mbake/lib/Serv';
import { ShippingRoutes } from './lib/shipping';

var request = require('request');
const yaml = require('js-yaml');
const fs = require('fs');

let config = yaml.load(fs.readFileSync('config.yaml'))[process.env.NODE_ENV || 'local'];

const app = ExpressRPC.makeInstance(config.cors);

const port = 9081
const mainApp = ExpressRPC.makeInstance(['http://localhost:' + port]);

const shippingRoutes = new ShippingRoutes();

mainApp.use('/api/editors', shippingRoutes.routes(port));

app.listen(port, () => console.log(`ShippingApi for the snipcart webhook app listening on port ${port}!`))