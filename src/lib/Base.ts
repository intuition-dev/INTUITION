// All rights reserved by Metabake (Metabake.org) | Cekvenich, licensed under LGPL 3.0
// NOTE: You can extend these classes!

export class Ver {
   static ver() {
      return 'v5.07.08'
   }
   static date(): string {
      return new Date().toISOString()
   }
}
import colors = require('colors')
const logger = require('tracer').colorConsole({
   filters: [
      {
         warn: colors.yellow,
         error: [colors.red]
      }
   ]
})

import { MinJS } from './Extra'
import { Dirs, Dat} from './FileOpsBase'

import Marpit = require('@marp-team/marpit')
const marpit = new Marpit.Marpit()

import fs = require('fs-extra')
import FileHound = require('filehound')
import yaml = require('js-yaml')

import findUp = require('find-up')

import riotc = require('riot-compiler')
import pug = require('pug')
const minify = require('html-minifier').minify
const Terser = require("terser")

import beeper = require('beeper');
////////////////////////////

import JavaScriptObfuscator = require('javascript-obfuscator')

// code /////////////////////////////////////////////////////////////////////

// metaMD
import markdownItCont = require('markdown-it-container')
const md = require('markdown-it')({
   html: true,
   typographer: true,
   linkify: true
})
md.use(markdownItCont, 'dynamic', {
   // https://github.com/markdown-it/markdown-it-container/issues/23
   validate: function () { return true; },
   render: function (tokens, idx) {
      let token = tokens[idx]

      if (token.nesting === 1) {
         return '\n<div class="' + token.info.trim() + '">'
      } else {
         return '</div>\n'
      }
   }
})

export class MBake {

   bake(path_, prod: number): Promise<string> {
      return new Promise(function (resolve, reject) {
         if (!path_ || path_.length < 1) {
            console.info('no path_ arg passed')
            reject('no path_ arg passed')
         }
         try {
            console.info(' Baking ' + path_)

            let d = new Dirs(path_)
            let dirs = d.getFolders()

            if (!dirs || dirs.length < 1) {
               //go one up
               path_ = Dirs.goUpOne(path_)
               console.info(' New Dir: ', path_)
               d = new Dirs(path_)
               dirs = d.getFolders()
            }

            for (let val of dirs) {
               let n = new BakeWrk(val)
               n.bake(prod)
            }
            resolve('OK')
         } catch (err) {
            logger.info(err)
            reject(err)
         }
      })//pro
   }//()

   compsNBake(path_, prod: number): Promise<string> {
      let _this = this
      return new Promise(async function (resolve, reject) {

         if (!path_ || path_.length < 1) {
            console.info('no path_ arg passed')
            reject("no path args passed")
         }
         try {
            console.info(' Xomp ' + path_)

            let t = new Comps(path_)
            let lst = t.get()

            await t.comps(lst)

            _this.bake(path_, prod)
               .then(function () {
                  resolve('OK')
               })
               .catch(function (err) {
                  logger.info(err)
                  reject(err)
               })
         } catch (err) {
            logger.info(err)
            reject(err)
         }


      })//pro
   }//()

   clearToProd(path_): Promise<string> {
      return new Promise(function (resolve, reject) {
         if (!path_ || path_.length < 1) {
            console.info('no path_ arg passed')
            reject(('no path_ arg passed'))
         }
         try {

            console.info(' Clearing ' + path_)
            let dir = Dirs.slash(path_)

            const rec = FileHound.create() //recursive
               .paths(dir)
               .ext(['pug', 'yaml', 'js', 'ts', 'scss'])
               .findSync()

            rec.forEach(file => {
               const min = file.split('.')[file.split('.').length - 2] === 'min';

               if (!min) {
                  console.info(' Removing ' + file)
                  fs.removeSync(file)
               }
            });
         } catch (err) {
            logger.warn(err)
            reject(err)
         }
         resolve('OK')
      })
   }

   // itemize and bake
   itemizeNBake(ppath_, prod: number): Promise<string> {
      let _this = this
      return new Promise(function (resolve, reject) {
         if (!ppath_ || ppath_.length < 1) {
            console.info('no path_ arg passed')
            reject('no path arg passed')
         }
         logger.info('ib:', ppath_)

         try {
            const i = new Items(ppath_)
            i.itemize()

         } catch (err) {
            logger.info(err)
            reject(err)
         }

         _this.bake(ppath_, prod)
            .then(function () { resolve('OK') })
            .catch(function (err) {
               logger.info(err)
               reject(err)
            })


      })//pro
   }//()

}//()

export class BakeWrk {
   dir: string
   static ebodyHtml = '</body>'

   constructor(dir_: string) {
      let dir = Dirs.slash(dir_)

      this.dir = dir
      console.info(' processing: ' + this.dir)
   }

   static metaMD(text, options) {//a custom md filter that uses a transformer
      console.info(' ', options)
      return md.render(text)
   }

   static marp(text, options) {//a custom md filter that uses a transformer
      console.info(' ', options)
      const { html, css } = marpit.render(text)
      return html
   }


   //http://github.com/kangax/html-minifier/issues/843
   static minify_pg(text, inline) {

      let code = text.match(/^\s*\s*$/) ? '' : text

      let optionsCompH = Object.assign({}, MinJS.CompOptionsJS)
      let _output = { indent_level: 0, quote_style: 3, semicolons: false }
      optionsCompH['output'] = _output

      let result = Terser.minify(code, optionsCompH)
      if (result.error) {
         console.info('Terser error:', result.error)
         beeper()
         return text
      }
      return result.code.replace(/;$/, '')
   }

   //find string indexes
   static sindexes(source, f) {
      if (!source)
         return []
      if (!f)
         return []

      let result = []
      for (let i = 0; i < source.length; ++i) {
         if (source.substring(i, i + f.length) == f)
            result.push(i)
      }
      return result
   }

   static minifyPg = {
      caseSensitive: true,
      collapseWhitespace: true,
      decodeEntities: true,
      minifyCSS: true,
      minifyJS: BakeWrk.minify_pg,
      quoteCharacter: "'",
      removeComments: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      useShortDoctype: true,
      sortAttributes: true,
      sortClassName: true
   }

   bake(prod: number) {
      let tstFile = this.dir + '/index.pug'
      if (!fs.existsSync(tstFile)) {
         return
      }
      process.chdir(this.dir)

      let dat = new Dat(this.dir)

      //static data binding with a custom md filter that uses a transformer
      let options = dat.getAll()
      options['filters'] = {
         metaMD: BakeWrk.metaMD,
         marp: BakeWrk.marp
      }

      options['ENV'] = prod

      if (this.locAll(options)) // if locale, we are not writing here, but in sub folders.
         return ' '

      this.writeFilePg(this.dir + '/index.pug', options, this.dir + '/index.html')
      //amp
      if (!fs.existsSync(this.dir + '/m.pug'))
         return ' '
      this.writeFilePg(this.dir + '/m.pug', options, this.dir + '/m.html')

   }//()

   // if loc, do locale
   locAll(options) {
      if (!options.LOC) return false

      let d = options.LOC
      d = this.dir + d

      let a
      let fn = d + '/loc.yaml'
      if (fs.existsSync(fn))
         a = yaml.load(fs.readFileSync(fn))
      else {
         let dir2: string = findUp.sync('loc.yaml', { cwd: d })
         a = yaml.load(fs.readFileSync(dir2))
         d = dir2.slice(0, -8)
      }
      // found
      const css: string[] = a.loc
      const set: Set<string> = new Set(css)
      logger.info(set)

      let merged = { ...a, ...options } // es18 spread
      for (let item of set) {
         this.do1Locale(item, merged)
      }

      //delete 'root' index.html
      fs.remove(this.dir + '/index.html')
   }//()

   do1Locale(locale, combOptions) {
      //extract locale var
      console.log(locale)
      let localeProps = {}
      localeProps['LOCALE'] = locale // any let can be access in pug or js  eg window.locale = '#{LOCALE}'

      for (let key in combOptions)
         if (key.endsWith('-' + locale)) { //for each key
            let len = key.length - ('-' + locale).length
            let key2 = key.substring(0, len)
            localeProps[key2] = combOptions[key]
         }

      let locMerged = { ...combOptions, ...localeProps } // es18 spread
      console.log(localeProps)

      // if dir not exists
      let locDir = this.dir + '/' + locale
      console.log(locDir)
      fs.ensureDirSync(locDir)

      // if loc.pug exists
      if (fs.existsSync(locDir + '/loc.pug'))
         this.writeFilePg(locDir + '/loc.pug', locMerged, locDir + '/index.html')
      else this.writeFilePg(this.dir + '/index.pug', locMerged, locDir + '/index.html')

      //amp
      if (!fs.existsSync(this.dir + '/m.pug'))
         return ' '
      this.writeFilePg(this.dir + '/m.pug', locMerged, locDir + '/m.html')
   }

   writeFilePg(source, options, target) {
      let html = pug.renderFile(source, options)
      const ver = '<!-- mB ' + Ver.ver() + ' on ' + Ver.date() + ' -->'
      if (!options['pretty'])
         html = minify(html, BakeWrk.minifyPg)
      html = html.replace(BakeWrk.ebodyHtml, ver + BakeWrk.ebodyHtml)
      fs.writeFileSync(target, html)
   }

}//class


export class Items {
   dir: string
   dirs // array
   feed //rss

   constructor(dir_: string) {
      let dir = Dirs.slash(dir_)
      let fn: string = dir + '/dat_i.yaml'

      if (!fs.existsSync(fn)) { //if it does not exist, go up a level
         let dir2: string = findUp.sync('dat_i.yaml', { cwd: dir })

         if (dir2 != null) {
            dir = dir2.slice(0, -11) // this reported error for UBAYCAP
         }
      }

      this.dir = dir
      let d = new Dirs(dir)
      this.dirs = d.getFolders()
   }

   _addAnItem(dn) {
      try {
         if (!fs.existsSync(dn + '/dat.yaml'))
            return

         let y = yaml.load(fs.readFileSync(dn + '/dat.yaml'))
         if (!y) return

         //if publish property: true, skip static publishing regardless of publishDate
         if (false == y.publish) {
            return
         }

         // if publishDate is set and later than now we skip
         if (typeof y.publishDate !== 'undefined'
            && y.publishDate !== null
            && (y.publishDate - Date.now()) > 0
         ) {
            return;
         }

         Items.clean(y)

         let dl = dn.lastIndexOf('/')
         let url = dn.substring(dl + 1)
         console.info('', url)
         y.url = url

         if (!y.hasOwnProperty('id'))
            y.id = url //to be compliant to feed

         //array of items
         if (!this.feed.items)
            this.feed.items = []

         y.index = this.feed.items.length
         //console.info('', this.feed.items.length)
         this.feed.items.push(y)

      } catch (err) {
         logger.info(err)
      }
   }

   itemize(): string {
      logger.info('Itemizing: ' + this.dir)

      const rootDir: string = this.dir
      // header file
      let fn: string = rootDir + '/dat_i.yaml'
      if (!fs.existsSync(fn)) return;

      let y = yaml.load(fs.readFileSync((fn)))

      Items.clean(y)
      y.mbVer = Ver.ver()
      this.feed = y
      logger.warn(this.feed)

      for (let val of this.dirs) {
         this._addAnItem(val)
      }

      if (!this.feed.items)
         this.feed.items = []

      if (0 == this.feed.items.length) {
         logger.info('no items')
         return
      }
      this.feed.count = this.feed.items.length

      //write
      let json = JSON.stringify(this.feed, null, 2)
      let items = rootDir + '/items.json'
      fs.writeFileSync(items, json)

      console.info(' processed.')
      return ' processed '
   }

   static clean(o: Object) {// remove fields that are pug
      delete o['basedir']
      delete o['ROOT']
      delete o['pretty']
      delete o['LOC']
      delete o['publishFlag']

   }

}//class

export class Comps {
   dir: string

   constructor(dir_: string) {
      let dir = Dirs.slash(dir_)
      this.dir = dir
   }

   get() {
      const rec = FileHound.create() //recursive
         .paths(this.dir)
         .ext('pug')
         .glob('*-comp.pug')
         .findSync()
      let ret: string[] = [] //empty string array
      for (let val of rec) {//clean the strings
         val = val.split('\\').join('/') // windoze
         ret.push(val)
      }
      return ret
   }//()

   comps(list): Promise<string> {
      const THIZ = this
      return new Promise(async function (resolve, reject) {

         console.info('Looking for comps: *-comp ' + THIZ.dir)
         for (let val of list) {//clean the strings
            let s: string = fs.readFileSync(val).toString()

            let n = val.lastIndexOf('/')
            let dir: string = val.substring(0, n)
            let name: string = val.substring(n)
            let p = name.lastIndexOf('.')
            name = name.substring(0, p)
            console.info(' ' + dir + name);
            await THIZ.process(s, dir, dir + name)
         }
         resolve('OK')
      })
   }//()


   ver = '// mB ' + Ver.ver() + ' on ' + Ver.date() + '\r\n'

   process(s: string, dir: string, fn: string): Promise<string> {
      const THIZ = this
      return new Promise(function (resolve, reject) {

         const r_options = { 'template': 'pug', 'basedir': dir }

         logger.info('compiling', fn)
         let js1
         try {

            js1 = riotc.compile(s, r_options, fn) //tagpath

         } catch (err) {
            beeper(1);
            logger.error('compiler error')
            logger.error(err)
            reject(err)
         }
         fs.writeFileSync(fn + '.js', js1)

         let optionsCompR = Object.assign({}, MinJS.CompOptionsJS)
         let _output = { indent_level: 0, quote_style: 0, semicolons: false }
         //_output['mangle'] = true
         optionsCompR['output'] = _output
         let js2 = Terser.minify(js1, optionsCompR)

         let ugs
         try {
            logger.info('obs')
            ugs = JavaScriptObfuscator.obfuscate(js2.code, MinJS.getCompOptions())

         } catch (err) {
            logger.error('error')
            logger.error(err)
            reject(err)
         }

         let obCode = THIZ.ver + ugs.getObfuscatedCode()
         fs.writeFileSync(fn + '.min.js', obCode)
         resolve('OK')
      })
   }
}//class


module.exports = {
   BakeWrk, Items, Comps, Ver, MBake
}
