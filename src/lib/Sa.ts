// sass
import { Ver } from './Base'

import sass = require('node-sass')
import autoprefixer = require('autoprefixer')
import postcss      = require('postcss')
import stripCssComments = require('strip-css-comments')

import path = require('path')
import fs = require('fs')

export class Sas {

   trans(fn) {
      
      console.log(fn)

      let css = sass.renderSync({
         file: fn
         , outputStyle: 'compact'
       })
       
       let filename = path.basename(fn)
       filename = filename.split('.').slice(0, -1).join('.')


      postcss([ autoprefixer({ browsers: ['> 1%', 'not ie < 11'] })]).process(css.css, {from: undefined}).then(function (result) {
         result.warnings().forEach(function (warn) {
            console.warn(warn.toString())
         })

         let res:string = stripCssComments(result.css, {preserve: false})
         // lf
         res = res.replace(/(\r\n\t|\n|\r\t)/gm, '\n')
         res = res.replace(/\n\s*\n/g, '\n')
         res = res.trim()
         res = res.replace(/  /g, ' ')
         res = res.replace(/; /g, ';')
         res = res.replace(/: /g, ':')
         res = res.replace(/ }/g, '}')
         res = res.replace(/ { /g, '{')
         res = res.replace(/, /g, ',')

         //add ver string
         const ver = ' /* mB ' + new Ver().ver() +' on '+new Date().toISOString() + " */"
         res = res + ver
         // write the file
         fs.writeFileSync(filename+'.css', res)

      })
   }//()

}//class


module.exports = {
   Sas
}