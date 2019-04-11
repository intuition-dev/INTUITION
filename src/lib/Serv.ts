// All rights reserved by Metabake (mbake.org) | Cekvenich, licensed under LGPL 3.0
// NOTE: You can extend these classes!


export class CustomCors {
   constructor(orig) {
      return (request, response, next) => {
         response.setHeader('Access-Control-Allow-Origin', '*')
         return next()
      }
   }
}


module.exports = {
   CustomCors
}
