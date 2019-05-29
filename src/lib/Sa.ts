// All rights reserved by Metabake (Metabake.org) | Cekvenich, licensed under LGPL 3.0
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

import sharp = require('sharp')
import probe = require('probe-image-size')

import JavaScriptObfuscator = require('javascript-obfuscator')
import { TInputOptions } from "javascript-obfuscator/src/types/options/TInputOptions"

import * as ts from "typescript"
const Terser = require("terser")

const execa = require('execa')

//import colors = require('colors');
const logger = require('tracer').console()
import { firestoreExport, firestoreImport } from 'node-firestore-import-export';

import * as firebase from 'firebase-admin';
import { read } from 'fs';

const util = require('util');



// //////////////////////////////////////////////////////////////////
export class GitDown {
   config
   remote
   pass: string
   git: any
   dir: string
   constructor(pass_: string) {
      const last = pass_.lastIndexOf('/')
      this.pass = pass_.substring(last + 1)
      this.dir = pass_.substring(0, last)

      this.config = yaml.load(fs.readFileSync('gitdown.yaml'))
      console.log(this.dir, this.config.BRANCH)
      logger.trace(this.config)

      this.remote = 'https://' + this.config.LOGINName + ':'
      this.remote += this.pass + '@'
      this.remote += this.config.REPO + '/'
      this.remote += this.config.PROJECT

      this._emptyFolders()
   }//()

   async process() {
      try {
         let b = this.config.BRANCH
         await this._branchExists(b)
         console.log(this.exists)

         if (this.exists) await this._getEXISTINGRemoteBranch(b)
         else await this._getNEWRemoteBranch(b)

         this._moveTo(b)
      } catch (err) {
         console.error(err)
      }
   }

   _moveTo(branch) { // move to folder
      let dir = this.config.PROJECT
      dir = this.dir + '/' + dir + '/' + this.config.REPOFolder

      let dirTo = this.config.PROJECT
      dirTo = this.dir + '/' + this.config.LOCALFolder
      console.log(dir, dirTo)

      fs.moveSync(dir, dirTo)

      let dirR = this.config.PROJECT
      dirR = this.dir + '/' + dirR
      fs.removeSync(dirR)
      console.log('removed', dirR)
      console.log()

      fs.writeJsonSync(dirTo + '/branch.json', { branch: branch, syncedOn: Ver.date() })
      console.log('DONE!')
      console.log('Maybe time to make/bake', dirTo)
      console.log('and then point http server to', dirTo)
      console.log()
   }

   _emptyFolders() {
      let dirR = this.config.PROJECT
      dirR = this.dir + '/' + dirR
      console.log('remove', dirR)
      fs.removeSync(dirR)

      let dirTo = this.config.PROJECT
      dirTo = this.dir + '/' + this.config.LOCALFolder
      console.log('remove', dirTo)
      fs.removeSync(dirTo)
   }

   async _getNEWRemoteBranch(branch) {
      const { stdout } = await execa('git', ['clone', this.remote])

      let dir = this.config.PROJECT
      dir = this.dir + '/' + dir
      //make a branch
      const { stdout2 } = await execa('git', ['remote', 'add', branch, this.remote], { cwd: dir })
      const { stdout3 } = await execa('git', ['checkout', '-b', branch], { cwd: dir })
      // add to remote
      const { stdout4 } = await execa('git', ['push', '-u', 'origin', branch], { cwd: dir })

      /* list history of the new branch TODO
      await execa('git', ['fetch'], {cwd: dir})
      const {stdout10} = await execa('git', ['log', '-8', '--oneline', 'origin/'+branch], {cwd: dir})
      console.log('history', stdout10)
      /*
      git clone https://cekvenich:PASS@github.com/cekvenich/alan
      cd folder
      git remote add test2 https://cekvenich:PASS@github.com/cekvenich/alan
      git checkout -b test2
      git push -u origin test2
      */
   }

   async _getEXISTINGRemoteBranch(branch) { // if null, master
      const { stdout } = await execa('git', ['clone', this.remote])

      let dir = this.config.PROJECT
      dir = this.dir + '/' + dir
      const { stdout2 } = await execa('git', ['checkout', branch], { cwd: dir })
      console.log(dir, branch)

      /* list history of the branch TODO
      await execa('git', ['fetch'], {cwd: dir})
      const {stdout10} = await execa('git', ['log', '-8', '--oneline', 'origin/'+branch], {cwd: dir})
      console.log('history', stdout10)
      /*
      git clone https://cekvenich:PASS@github.com/cekvenich/alan
      cd folder
      git checkout test2
      */
   }

   exists: boolean
   async _branchExists(branch) {
      let cmd = this.remote
      cmd += '.git'
      logger.info(cmd)

      const { stdout } = await execa('git', ['ls-remote', cmd])
      this.exists = stdout.includes(branch)

      logger.trace(stdout)
      /*
      git ls-remote https://cekvenich:PASS@github.com/cekvenich/alan.git
      */
   }//()
}//class

export class MinJS {

   ts(dir): Promise<string> {
      logger.info(dir)
      const THIZ = this
      return new Promise(function (resolve, reject) {
         const rec = FileHound.create() //recursive
            .paths(dir)
            .ext("ts")
            .findSync()
         if (rec.length < 1) resolve('OK')

         THIZ.compile(rec, {
            target: ts.ScriptTarget.ES5,
            //noEmitOnError: true,
            removeComments: true
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
               if (fn._pathname.endsWith('-comp.js')) { // no riot comps
                  return false
               }
               return true
            })
            .findSync()
         for (let fn of rec) {//clean the strings
            try {
               await THIZ._minOneJS(fn)
            } catch (err) {
               logger.warn(err)
               reject(err)
            }
         }
         console.info('Done!'.green)
         resolve('OK')
      })
   }

   _minOneJS(fn) {
      return new Promise(async function (resolve, reject) {
         let result
         try {
            console.log(fn)
            let code: string = fs.readFileSync(fn).toString('utf8')

            let optionsCompJS = Object.assign({}, MinJS.CompOptionsJS)
            let _output = { indent_level: 0, quote_style: 0, semicolons: false }
            //_output['mangle'] = true
            optionsCompJS['output'] = _output

            if (fn.includes('-wcomp'))
               result = Terser.minify(code, MinJS.CompOptionsJS)
            else result = Terser.minify(code, optionsCompJS)

            let txt = result.code

            txt = txt.replace(/(\r\n\t|\n|\r\t)/gm, '\n')
            txt = txt.replace(/\n\s*\n/g, '\n')
            txt = txt.trim()

            if (fn.includes('-wcomp')) {
               let ugs
               try {
                  logger.info('obs')
                  ugs = JavaScriptObfuscator.obfuscate(txt, MinJS.getCompOptions())
                  txt = ugs.getObfuscatedCode()

               } catch (err) {
                  logger.error('error')
                  logger.error(err)
                  reject(err)
               }
            }

            txt = MinJS.ver + txt

            let fn2 = fn.slice(0, -3)
            fn2 = fn2 + '.min.js'
            fs.writeFileSync(fn2, txt)
            resolve('OK')
         } catch (err) {
            logger.warn(err, result)
            reject(err)
         }
      })
   }//()


   static getCompOptions(): TInputOptions {
      let t = {
         identifierNamesGenerator: 'hexadecimal' // for virus
         , disableConsoleOutput: false // setting to true breaks things
         , target: 'browser' //-no-eval'

         , stringArray: true
         , stringArrayThreshold: 1
         , stringArrayEncoding: 'rc4' // breaks if not

         , selfDefending: false // low sec

         , controlFlowFlattening: true
         , controlFlowFlatteningThreshold: .6 // low sec

         , deadCodeInjection: false
      }
      return t as TInputOptions
   }

   static ver = '// mB ' + Ver.ver() + ' on ' + Ver.date() + '\r\n'

   static CompOptionsJS = {
      parse: { html5_comments: false },
      compress: {
         drop_console: true,
         keep_fargs: true, reduce_funcs: false
      },
      output: { indent_level: 1, quote_style: 3, semicolons: false },
      ecma: 5,
      //mangle: false, // this breaks things in pg
      keep_classnames: true,
      keep_fnames: true
   }

   compile(fileNames: string[], options_: ts.CompilerOptions): void { //http://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API
      let program = ts.createProgram(fileNames, options_)
      let emitResult = program.emit();

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
            console.info(`${diagnostic.file.fileName}:`.cyan, `${line + 1}:${character + 1}`.yellow, `${message}`);
         } else {
            console.info(
               `${ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`
            );
         }
      });

      let exitCode = emitResult.emitSkipped ? 1 : 0;
      console.info(`status code '${exitCode}'.`);
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

   do(dir) {
      logger.info(dir)

      const rec = FileHound.create() //recursive
         .paths(dir)
         .ext('jpg')
         .findSync()

      let ret: string[] = [] //empty string array
      for (let s of rec) {//clean the strings
         let n = s.slice(0, -4)
         if (n.includes('.min')) continue
         ret.push(n)

      }
      for (let s of ret) {
         this.smaller(s)
      }
   }

   isWide(file): boolean {
      let data = fs.readFileSync(file + '.jpg')
      let p = probe.sync(data)
      if (p.width && p.width > 3200) return true
      logger.info(file, ' is low res')
      return false
   }

   smaller(file) {
      logger.info(file)
      if (!this.isWide(file)) return
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
   css(dir): Promise<string> {
      const THIZ = this
      return new Promise(async function (resolve, reject) {

         let a
         let fn = dir + '/assets.yaml'
         if (fs.existsSync(fn))
            a = yaml.load(fs.readFileSync(fn))
         else {
            let dir2: string = findUp.sync('assets.yaml', { cwd: dir })
            a = yaml.load(fs.readFileSync(dir2))
            dir = dir2.slice(0, -12)
         }
         logger.info(dir)

         const css: string[] = a.css
         const set: Set<string> = new Set(css)
         logger.info(set)

         for (let item of set) {
            await THIZ._trans(item, dir)
         }

         console.info()
         console.info(' Done!'.green)
         resolve('OK')
      })
   }//()

   _trans(fn2, dir) {
      let css = sass.renderSync({
         file: dir + '/' + fn2
         , outputStyle: 'compact'
      })

      postcss([autoprefixer({ browsers: ['> 0.5%', 'cover 99.5%', 'last 2 major versions', 'Firefox ESR', 'ios_saf >= 10', 'ie >= 11'] })]).process(css.css, { from: undefined }).then(function (result) {
         console.info('autoprefixer')
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

// //////////////////////////////////////////////////////////////////
export class ExportFS {
   config
   collectionRef
   constructor(config) {
      this.config = require(config);


      firebase.initializeApp({
         credential: firebase.credential.cert(this.config),
      });

      this.collectionRef = firebase.firestore()

   }//()


   export() {
      firestoreExport(this.collectionRef)
         .then(data => {
            console.log(data)
            fs.writeJsonSync('dbexport.json', data, 'utf8')
            // fs.writeFile('dbexport.json', JSON.stringify(data), 'utf8', err => {
            //    if (err) console.log(err);
            //    console.log("Successfully Written to File.");
            // });
         });
   }
}

export class ImportFS {
   args
   config
   collectionRef
   pathToData
   serviceAccountConfig
   pathToImportedFile
   constructor(config) {
      console.info("--config:", config)
      this.args = config.split(':')
      this.serviceAccountConfig = this.args[0]
      this.pathToImportedFile = this.args[1]
      this.config = require(this.serviceAccountConfig);


      firebase.initializeApp({
         credential: firebase.credential.cert(this.config),
      });

      this.collectionRef = firebase.firestore()

   }//()

   import() {
      let _this = this
      fs.readJson(this.pathToImportedFile, function (err, result) {
         console.info("--result:", result)

         firestoreImport(result, _this.collectionRef)
            .then(() => {
               console.log('Data was imported.')
            });
      })
   }
}
module.exports = {
   Sas, Resize, YamlConfig, MinJS, GitDown, ExportFS, ImportFS
}
