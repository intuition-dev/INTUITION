
// const URL = require('url')

import { TerseB } from "terse-b/terse-b"
const log:any = new TerseB("example")

import {  Serv }  from 'http-rpc/lib/Serv'

const srv = new Serv(['*'], 4 *1024) 

srv.serveStatic('./webApp', 1, 1)
srv.listen(8081)

// ///
import express from 'express'
var app            =       express()

app.get('/red',function(request,response){

    response.send('Hello RED')
})
app.listen(8080, function() {
    console.log('8080 red')
})