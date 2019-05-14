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

module.exports = {
   CustomCors
}
