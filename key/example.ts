
// const URL = require('url')

import { TerseB } from "terse-b/terse-b"
const log:any = new TerseB("example")

import {  Serv }  from 'http-rpc/lib/Serv'

const srv = new Serv(['*'], 4 *1024) 

Serv._expInst.get('/red',function(request,response){

    response.send('Hello RED')
})

srv.serveStatic('./webApp', 1, 1)
srv.listen(8080)


