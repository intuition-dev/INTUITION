import { eventNames } from "cluster";
import { IDB } from "./IDB";
import { Ship } from "./Ship";

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
        const db = new IDB();
        await db.init();

        if ('payment_intent.succeeded'==method) {
            const intentId = params.data.object.id
            const ship = new Ship(this.printfulApiID)
            await ship.ship(intentId)
            res.json("OK"); //res is the response object, and it passes info back to client-side
        } else if ('checkout.session.completed'==method) {
            console.log('checkout.session.completed')
            res.json("OK")
        } else {
            resp.errorLevel = -1
            resp.errorMessage = 'mismatch'
            console.log('respppp errorr', resp)
            res.json(resp)
        }
    }
}

module.exports = {
    PaidHook
}