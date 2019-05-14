// All rights reserved by Metabake (Metabake.org) | Cekvenich, licensed under LGPL 3.0
// NOTE: You can extend these classes!

export class CustomCors { // will be deprecated , use the class under here: ExpressRPC
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
   
   static makeInstance(orig) {
      console.log('Allowed>>>',orig)
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
