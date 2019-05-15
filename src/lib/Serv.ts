// All rights reserved by Metabake (Metabake.org) | Cekvenich, licensed under LGPL 3.0
// NOTE: You can extend these classes!
const logger = require('tracer').console()

export class CustomCors { // will be deprecated , use the class under here: ExpressRPC
   constructor(validOrigins:Array<string>) {

      return (request, response, next) => {
         const origin = request.get('origin')
         logger.trace(origin)
         let approved = false
         for(var ori in validOrigins) {
            if(ori=='*')  approved = true
            if(origin.includes(ori)) approved = true // allow on string match
         }
         if(approved) {
            response.setHeader('Access-Control-Allow-Origin', origin)
            return next()
         } 
         
         //else
         response.status(403).end()
      }
   }
}

const express = require('express')
const bodyParser = require('body-parser')
const formidable = require('express-formidable')

export class ExpressRPC {
   
   static makeInstance(origins:Array<string>) {
      console.log('Allowed>>>', origins)
      const cors = new CustomCors(origins)
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
