
// Bus. Layer test
import { Ship } from './lib/Ship';
import { SDB } from './lib/SDB';
// const is = require('is');
// const assert = require('assert');
// const logger = require('tracer').console();
// const perfy = require('perfy');
// var bunyan = require('bunyan');

const db = new SDB();
const ship = new Ship(db);
let item = {
    'quantity': '1',
    'id': '119018290',
};
let address = {
    'fullName': 'Liza Test',
    'address1': '4558 Cook Hill Road',
    'city': 'Cheshire',
    'country': 'US',
    'province': 'CT',
    'postalCode': '06410',
};
ship.ship([item], address);