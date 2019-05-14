// All rights reserved by Metabake (Metabake.org) | Cekvenich, licensed under LGPL 3.0
// NOTE: You can extend these classes!

export class CustomCors { // for use with http-rpc
   constructor(orig) {
      return (request, response, next) => {
         response.setHeader('Access-Control-Allow-Origin', orig)
         response.setHeader('Access-Control-Allow-Methods', 'POST')
         return next()
      }
   }
}

const express = require('express')
const bodyParser = require('body-parser')
const formidable = require('express-formidable')

export class ExpressRPC {
   
   makeInstance(orig) {
      const cors = new CustomCors(orig)
      const appInst = express()
      appInst.use(cors)

      appInst.use(bodyParser.urlencoded({ extended: false }))
      appInst.use(formidable())// for fetch

      return appInst
   }
}

module.exports = {
   CustomCors, ExpressRPC
}
