// All rights reserved by Metabake (Metabake.org) | Cekvenich, licensed under AGPL 3.0
// NOTE: You can extend these classes!

const express = require('express')
const bodyParser = require('body-parser')
const formidable = require('express-formidable')

const logger = require('tracer').console()

export class CustomCors { // will be deprecated , use the class under here: ExpressRPC
   constructor(validOrigins:Array<string>) {

      return (request, response, next) => {
   
         const origin = request.get('origin')
         let approved = false
         validOrigins.forEach( function(ori) { 
            if(ori=='*')  approved = true
            if(origin.includes(ori)) approved = true // allow on string match
         })
         logger.trace(origin, approved)
         if(approved) {
            response.setHeader('Access-Control-Allow-Origin', origin)
            return next()
         } 
         
         //else
         response.status(403).end()
      }
   }
}

export class ExpressRPC {
   /**
    * @param origins An array of string that would match a domain. So host would match localhost. Returns express server instance.
    */
   static makeInstance(origins:Array<string>) {
      console.log('Allowed >>> ', origins)
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
