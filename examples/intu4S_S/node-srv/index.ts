
import { Stripe } from './routes/routes'
import { ExpressRPC } from "mbake/lib/Serv"
import { PaidHook } from './lib/PaidHook';
import { SDB } from './lib/SDB';

const yaml = require("js-yaml")
const fs = require("fs")

const srv = new ExpressRPC()
srv.makeInstance(['*'])
const port = 3000

let db:SDB
// init the db

// 2 apps: first one is intu, so you can edit.
// second on is the app: in this case S&S

// single port - to accept the post
const stripe = new Stripe(db)

srv.handleRRoute("stripe", "get-session", stripe.route.bind(stripe))

let config = yaml.load(fs.readFileSync(__dirname + "/config.yaml"));

const snipHook = new PaidHook(config.printfulApiID, db)
srv.appInst.post('/stripe/snip-hook', snipHook.handlePaidHook.bind(snipHook))
console.log("Webhooks running", srv.appInst._router.stack)


srv.appInst.listen(port, () => {
   console.info({ "server on port": port })
})
