// All rights reserved by MetaBake(mbake.org) | Cekvenich, licensed under LGPL 3.0
// NOTE: You can extend these classes!

import { Ver } from './Base'
import yaml = require('js-yaml')

import findUp = require('find-up')

import sass = require('node-sass')
import autoprefixer = require('autoprefixer')
import postcss = require('postcss')
import stripCssComments = require('strip-css-comments')

import path = require('path')
import fs = require('fs-extra')
import FileHound = require('filehound')

const sharp = require('sharp')

import * as ts from "typescript"
import UglifyJS = require("uglify-es")
import decomment = require('decomment')

//import colors = require('colors');
const logger = require('tracer').console()


// //////////////////////////////////////////////////////////////////

export class MinJS {//es5
   constructor(dir) {
      try {
         this.ts(dir)
      } catch (err) {
         logger.warn(err)
      }
      this.min(dir)
   }

   ts (dir) {
      const rec = FileHound.create() //recursive
         .paths(dir)
         .ext("ts")
         .findSync()

      if (rec.length < 1) return

      this.compile(rec, {
         target: ts.ScriptTarget.ES5,
         //noEmitOnError: true,
         removeComments: true
      })
   }

   min (dir) { //.log, .info and .trace remove
      const rec = FileHound.create() //recursive
         .paths(dir)
         .ext("js")
         .addFilter(function (fn) {
            if (fn._pathname.endsWith('.min.js')) {
               return false
            }
            if (fn._pathname.endsWith('-comp.js')) { // no riot comps
               return false
            }
            return true
         })
         .findSync()
      for (let fn of rec) {//clean the strings
         try {
            this._minOne(fn)
         } catch (err) {
            logger.warn(err)
         }
      }
      console.info('Done!'.green)
   }

   _minOne (fn) {
      console.log(fn)
      const code: string = fs.readFileSync(fn).toString('utf8')

      let result = UglifyJS.minify(code, MinJS.options)

      let txt = decomment(result.code, { space: true })
      txt = txt.replace(/(\r\n\t|\n|\r\t)/gm, '\n')
      txt = txt.replace(/\n\s*\n/g, '\n')
      txt = txt.trim()

      txt = MinJS.ver + txt

      let fn2 = fn.slice(0, -3)
      fn2 = fn2 + '.min.js'
      fs.writeFileSync(fn2, txt)

   }//()

   static ver = '// mB ' + new Ver().ver() + ' on ' + new Date().toISOString() + '\r\n'

   static options = {
      ecma: 5,
      keep_classnames: true,
      parse: { html5_comments: false },
      compress: {
         drop_console: true,
         ecma: 5,
         keep_classnames: true,
         keep_fnames: true,
         reduce_funcs: false
      },
      mangle: false,
      output: {
         beautify: true,
         bracketize: true,
         ecma: 5,
         indent_level: 1,
         preserve_line: true,
         quote_style: 3,
         semicolons: false
      }

   }//options

   compile (fileNames: string[], options: ts.CompilerOptions): void { //http://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API
      let program = ts.createProgram(fileNames, options);
      let emitResult = program.emit();

      let allDiagnostics = ts
         .getPreEmitDiagnostics(program)
         .concat(emitResult.diagnostics);

      allDiagnostics.forEach(diagnostic => {
         if (diagnostic.file) {
            let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(
               diagnostic.start!
            );
            let message = ts.flattenDiagnosticMessageText(
               diagnostic.messageText,
               "\n"
            );
            console.info(`${ diagnostic.file.fileName }:`.cyan, `${ line + 1 }:${ character + 1 }`.yellow, `${ message }`);
         } else {
            console.info(
               `${ ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n") }`
            );
         }
      });

      let exitCode = emitResult.emitSkipped ? 1 : 0;
      console.info(`status code '${ exitCode }'.`);
   }//()

}//class

export class YamlConfig {
   constructor(fn) {
      let cfg = yaml.load(fs.readFileSync(fn))
      console.info(cfg)
      return cfg
   }//()
}//class

// //////////////////////////////////////////////////////////////////
export class Resize {

   do (dir) {

      console.info(dir)

      const rec = FileHound.create() //recursive
         .paths(dir)
         .ext("jpg")
         .findSync()

      let ret: string[] = [] //empty string array
      for (let s of rec) {//clean the strings
         //console.info(s)
         let n = s.slice(0, -4)
         //console.info(n)
         if (n.includes('.min')) continue

         ret.push(n)
      }
      console.info(ret)
      for (let s of ret) {//clean the strings
         this.smaller(s)
      }
   }

   smaller (file) {
      sharp(file + '.jpg')
         .resize(1680 * 1.9)
         .jpeg({
            quality: 74,
            progressive: true,
            trellisQuantisation: true
         })
         .blur()
         .toFile(file + '.2K.min.jpg')

      sharp(file + '.jpg')
         .resize(320 * 2)
         .jpeg({
            quality: 78,
            progressive: true,
            trellisQuantisation: true
         })
         .toFile(file + '.32.min.jpg')

   }//()

}//class

export class Sas {

   /** 
    * @param dir 
    * Find assets.yaml and process each css in the assets.yaml array
    */
   css (dir) {
      logger.info(dir)
      let m
      let fn = dir + '/assets.yaml'
      if (fs.existsSync(fn))
         m = yaml.load(fs.readFileSync(fn))
      else {
         let dir2: string = findUp.sync('assets.yaml', { cwd: dir })
         m = yaml.load(fs.readFileSync(dir2))
         dir = dir2.slice(0, -12)
      }
      logger.info(dir)

      const css: string[] = m.css
      const set: Set<string> = new Set(css)
      logger.info(set)

      for (let item of set) {
         this._trans(item, dir)
      }

      console.info()
      console.info(' Done!'.green)
   }//()

   _trans (fn2, dir) {
      let css = sass.renderSync({
         file: dir + '/' + fn2
         , outputStyle: 'compact'
      })

      postcss([autoprefixer({ browsers: ['> 1%', 'ios_saf >= 8', 'not ie < 11'] })]).process(css.css, { from: undefined }).then(function (result) {
         result.warnings().forEach(function (warn) {
            console.warn(warn.toString())
         })

         let res: string = stripCssComments(result.css, { preserve: false })
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
         const ver = ' /* mB ' + new Ver().ver() + ' on ' + new Date().toISOString() + " */"
         res = res + ver

         // write the file
         let filename2 = path.basename(fn2)
         filename2 = filename2.split('.').slice(0, -1).join('.')
         let filename = filename2.split('\\').pop().split('/').pop()

         fs.ensureDirSync(dir + '/css')

         fs.writeFileSync(dir + '/css/' + filename + '.css', res)

      })
   }//()

}//class

module.exports = {
   Sas, Resize, YamlConfig, MinJS
}
