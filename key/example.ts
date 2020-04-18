
// const URL = require('url')

import { TerseB } from "terse-b/terse-b"
const log:any = new TerseB("example")
import {  Serv }  from 'http-rpc/lib/Serv'
const srv = new Serv(['*'], 4 *1024) 

// keyc /////////
var Keycloak = require('keycloak-connect')
var memoryStore = new session.MemoryStore();
var keycloak = new Keycloak({
    store: memoryStore //used 2 places
})
Serv._expInst.use(session({
    secret: '123',
    resave: false,
    saveUninitialized: true,
    store: memoryStore //used 2 places
  }));

// Serv._expInst.use(keycloak.middleware())

Serv._expInst.use('/protected', keycloak.protect() )
//end keyc //////


Serv._expInst.get('/red',function(request,response){
    response.send('Hello RED')
})

srv.serveStatic('./webApp', 0, 0)
var session = require('express-session')


srv.listen(8080)


