// All rights reserved by Cekvenich|INTUITION.DEV) |  Cekvenich, licensed under LGPL 3.0
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
 
import { TerseB } from "terse-b/terse-b"

const log:any = new TerseB( "extra")

import JavaScriptObfuscator = require('javascript-obfuscator')
import { TInputOptions } from "javascript-obfuscator/src/types/options/TInputOptions"

import * as ts from "typescript"
const Terser = require("terser")

export class MinJS {

   ts(dir): Promise<string> {
      log.info(dir)
      const THIZ = this
      return new Promise(function (resolve, reject) {
         const rec = FileHound.create() //recursive
            .paths(dir)
            .ext("ts")
            .findSync()
         if (rec.length < 1) resolve('OK')

         THIZ.compile(rec, {
            target: ts.ScriptTarget.ES2018,
            removeComments: false,
            allowJs: true,
            skipLibCheck: true,
            allowSyntheticDefaultImports: true,

            noImplicitThis: true,
            strictBindCallApply: true,
            
            lib: [
               'lib.es2018.d.ts', 'lib.es2018.promise.d.ts', 'lib.dom.iterable.d.ts', 'lib.scripthost.d.ts', 'lib.dom.d.ts', 'lib.webworker.d.ts'
            ]
         })
         resolve('OK')
      })
   }

   min(dir): Promise<string> {
      const THIZ = this
      return new Promise(async function (resolve, reject) {
         const rec = FileHound.create() //recursive
            .paths(dir)
            .ext("js")
            .addFilter(function (fn) {
               if (fn._pathname.endsWith('.min.js')) {
                  return false
               }

               return true
            })
            .findSync()
         for (let fn of rec) {//clean the strings
            try {
               await THIZ._minOneJS(fn)
            } catch (err) {
               log.warn(err)
               reject(err)
            }
         }
         log.info('Done!')
         resolve('OK')
      })
   }

   _minOneJS(fn) {
      return new Promise(async function (resolve, reject) {
         let result
         try {
            log.info(fn)
            let code: string = fs.readFileSync(fn).toString('utf8')
            result = Terser.minify(code, MinJS.CompOptionsTES)

            let txt = result.code

            txt = txt.replace(/(\r\n\t|\n|\r\t)/gm, '\n')
            txt = txt.replace(/\n\s*\n/g, '\n')
            txt = txt.trim()

            //if (fn.includes('-custel')) {
            let ugs
            try {
               log.info('obs', fn)
               
               ugs = JavaScriptObfuscator.obfuscate(txt, MinJS.getObOptionsXES())
               txt = ugs.getObfuscatedCode()

            } catch (err) {
               log.error(fn, 'error')
               log.error(err)
               reject(err)
            }
            //}

            txt = MinJS.ver + txt

            let fn2 = fn.slice(0, -3)
            fn2 = fn2 + '.min.js'
            fs.writeFileSync(fn2, txt)
            resolve('OK')
         } catch (err) {
            log.warn(fn, err, result)
            reject(err)
         }
      })
   }//()


   static ver = '// mB ' + Ver.ver() + ' on ' + Ver.date() + '\r\n'

   static CompOptionsTES = { // terser
      ecma: 2018,
      keep_classnames: true,
      keep_fnames: true,
      module: true,
      
      parse: { html5_comments: false },
      compress: {
         drop_console: true,
         keep_fargs: true, reduce_funcs: false,
         ecma: 2018, module: true,
      },
      mangle: false, // this breaks things in pg
      output: { indent_level: 1, quote_style: 3, 
         beautify: false, comments: false,  ecma: 2018,
         inline_script: false },

   }

   static getObOptionsXES(): TInputOptions {
      let t = {
         identifierNamesGenerator: 'hexadecimal' // for virus
         , disableConsoleOutput: false // setting to true breaks things
         , target: 'browser' //-no-eval'

         , stringArrayThreshold: 1
         , stringArrayEncoding: 'rc4' // breaks if not
         , splitStrings: true
         , splitStringsChunkLength: 5

         , controlFlowFlattening: true
         , controlFlowFlatteningThreshold: .7 // low sec

      }
      return t as TInputOptions
   }

   compile(fileNames: string[], options_: ts.CompilerOptions): void { // http://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API
      let program = ts.createProgram(fileNames, options_)
      let emitResult = program.emit()

      let allDiagnostics = ts
         .getPreEmitDiagnostics(program)
         .concat(emitResult.diagnostics)

      allDiagnostics.forEach(diagnostic => {
         if (diagnostic.file) {
            let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(
               diagnostic.start!
            );
            let message = ts.flattenDiagnosticMessageText(
               diagnostic.messageText,
               "\n"
            );
            log.info(`${diagnostic.file.fileName}:`, `${line + 1}:${character + 1}`, `${message}`);
         } else {
            log.info(
               `${ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`
            );
         }
      });

      let exitCode = emitResult.emitSkipped ? 1 : 0;
      log.info(`status code '${exitCode}'.`);
   }//()

}//class

// //////////////////////////////////////////////////////////////////

export class Sas {

   /** 
    * @param dir 
    * Find style.yaml and process each css in the style.yaml array
    */
   css(dir): Promise<string> {
      const THIZ = this
      return new Promise(async function (resolve, reject) {
         let a
         let fn = dir + '/style.yaml'
         log.info(fn)
         if (fs.existsSync(fn))
            a = yaml.load(fs.readFileSync(fn))
         else {
            let dir2: string = findUp.sync('style.yaml', { cwd: dir })
            a = yaml.load(fs.readFileSync(dir2))
            dir = dir2.slice(0, -11)
         }
         log.info(dir)

         const css: string[] = a.css
         const set: Set<string> = new Set(css)
         log.info(set)

         for (let item of set) {
            await THIZ._trans(item, dir)
         }

         log.info()
         log.info(' Done!')
         resolve('OK')
      })
   }//()

   _trans(fn2, dir) {
      let css = sass.renderSync({
         file: dir + '/' + fn2
         , outputStyle: 'compact'
      })

      postcss([autoprefixer])
         .process(css.css, { from: undefined }).then(function (result) {
            log.info('autoprefixer')
            result.warnings().forEach(function (warn) {
               log.warn(warn.toString())
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
            const ver = ' /* mB ' + Ver.ver() + ' on ' + Ver.date() + " */"
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

