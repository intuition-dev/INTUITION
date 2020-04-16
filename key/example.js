"use strict";
// const URL = require('url')
Object.defineProperty(exports, "__esModule", { value: true });
const terse_b_1 = require("terse-b/terse-b");
const log = new terse_b_1.TerseB("example");
const Serv_1 = require("./lib/Serv");
const SrvRPC_1 = require("./lib/SrvRPC");
const jwtUtil_1 = require("./lib/jwtUtil");
const jwt = new jwtUtil_1.jwT();
let secret = '123';
let allowedDomains = [];
allowedDomains.push('one.com'); // get from config.yaml, could be '*'
allowedDomains.push('two.org'); // XXX host or local would match localhost
// pass in the CORS domains 
const service = new Serv_1.Serv(['*'], 4 * 1024);
// RPC Example: (should be a class)
async function doMultiply(a, b) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve(a * b);
        }, 500);
    });
}
// handler
class Handler1 extends Serv_1.BaseRPCMethodHandler {
    constructor() {
        super(2, 1); // example of 2 second browser cache and 1 second CDN/edge cache. You can set to 0,0 to disable.
    }
    async multiply(params) {
        log.info(params.token, params.remoteAddress);
        let a = params.a;
        let b = params.b;
        let result = await doMultiply(a, b);
        return [jwt.newToken5(secret, 'me@me.com', 'user', params['remoteAdddress']), result];
    } //()
} //c
const h1 = new Handler1();
service.routeRPC('api', h1); // route to handler
service.listen(8888);
// part II: server side
setTimeout(function () {
    let params = { a: 5, b: 2 };
    foo(params);
}, 2000);
// server RPC call
async function foo(params) {
    const rpc = new SrvRPC_1.HttpRPC('http', 'localhost', 8888);
    rpc.setToken(jwt.newToken5(secret, 'me@me.com', 'user', params['remoteAdddress']));
    let ans = await rpc.invoke('api', 'multiply', params);
    //console.log(ans[0])//token
    log.warn(ans[1]);
}
