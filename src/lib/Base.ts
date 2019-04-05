// All rights reserved by MetaBake(mbake.org) | Cekvenich, licensed under LGPL 3.0
// NOTE: You can extend this file!

export class Ver {
   ver() {
      return 'v5.04.4'
   }
}

// metaMD
import markdownItAttrs = require('markdown-it-attrs')
const md = require('markdown-it')({
   html: true,
   typographer: true,
   linkify: true
})
md.use(markdownItAttrs)

import Marpit = require('@marp-team/marpit')
const marpit = new Marpit.Marpit()

import fs = require('fs-extra')
import FileHound = require('filehound')
import yaml = require('js-yaml')
import path = require("path")
import findUp = require('find-up')

import riotc = require('riot-compiler')
import pug = require('pug')
const minify = require('html-minifier').minify
const Terser = require("terser")

import colors = require('colors');
const logger = require('tracer').colorConsole({
   filters: [
      {
         warn: colors.yellow,
         error: [colors.red]
      }
   ]
})
const beeper = require('beeper')

import * as JavaScriptObfuscator from 'javascript-obfuscator'
import { TInputOptions } from "javascript-obfuscator/src/types/options/TInputOptions"
//import { idText } from 'typescript';

import beeper = require('beeper');

// code /////////////////////////////////////////////////////////////////////////////////////////////////
export class RetMsg {
   _cmd: string
   _code: number
   _msg: any
   constructor(cmd: string, code: number, msg: any) {
      this._cmd = cmd
      this._code = code
      this._msg = msg
   }//)_
   get cmd(): string {
      return this.cmd
   }
   get code(): number {
      return Math.round(this._code)
   }
   get msg(): any {
      return this
   }
   log() {
      console.info(this.cmd, this.msg, this.code)
   }
}//class

export class Dirs {
   dir: string
   constructor(dir_: string) {
      let dir = Dirs.slash(dir_)
      this.dir = dir
   }
   static slash(path_) {// windowze
      return path_.replace(/\\/g, '/')
   }
   static goUpOne(dir): string {
      return path.resolve(dir, '..')
   }

   getInDir(sub) {
      const rec = FileHound.create() //recursive
         .paths(this.dir + sub)
         .not().glob("*.js")
         .findSync()

      let ret: string[] = [] //empty string array
      const ll = this.dir.length + sub.length
      for (let s of rec) {//clean the strings
         //console.info(s)
         let n = s.substr(ll)
         //console.info(n)
         if (n.includes('index.html')) continue
         if (n.includes('index.pug')) continue

         ret.push(n)
      }
      return ret
   }

   /**
    * Get list of dirs w/o root part
    */
   getShort() {
      let lst = this.getFolders()
      let ret: string[] = [] //empty string array
      const ll = this.dir.length
      logger.info(this.dir, ll)

      for (let s of lst) {//clean the strings
         //console.info(s)
         let n = s.substr(ll)
         //console.info(n)
         ret.push(n)
      }
      return ret
   }

   getFolders() {
      logger.info(this.dir)
      const rec = FileHound.create() //recursive
         .paths(this.dir)
         .ext('pug')
         .findSync()
      let ret: string[] = [] //empty string array
      for (let val of rec) {//clean the strings
         val = Dirs.slash(val)
         let n = val.lastIndexOf('/')
         let s: string = val.substring(0, n)
         if (!fs.existsSync(s + '/dat.yaml'))
            continue
         ret.push(s)
      }
      //logger.info(ret)

      return Array.from(new Set(ret))
   }//()
}//class

export class Dat {
   props: any
   _path: string
   constructor(path__: string) {
      let path_ = Dirs.slash(path__)
      //logger.info(path)
      this._path = path_

      let y
      if (fs.existsSync(path_ + '/dat.yaml'))
         y = yaml.load(fs.readFileSync(path_ + '/dat.yaml'))
      if (!y) y = {}
      this.props = y

      let keys = Object.keys(y)
      if (keys.includes('include')) this._addData()
   }
   write() {
      try {
         let y = yaml.dump(this.props, {
            skipInvalid: true,
            noRefs: true,
            noCompatMode: true,
            condenseFlow: true
         })
         let p = this._path + '/dat.yaml'
         logger.info(p)
         fs.writeFileSync(p, y)
      } catch (err) { logger.info(err) }
   }
   set(key, val) { // ex: 'title', 'My First Blog'
      this.props[key] = val
   }
   _addData() {
      let jn = this.props.include
      let fn = this._path + '/' + jn
      logger.info(fn)
      let jso = fs.readFileSync(fn)
      Object.assign(this.props, JSON.parse(jso.toString())) // merge
   }

   getAll(): Object {
      return this.props
   }//()
}//class


export class MBake {

   bake(path_): RetMsg {
      if (!path_ || path_.length < 1) {
         console.info('no path_ arg passed')
         return
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
            n.bake()
         }
      } catch (err) {
         logger.info(err)
         return new RetMsg(path_ + ' bake', -1, err)
      }
      return new RetMsg(path_ + ' bake', 1, 'ok')
   }

   comps(path_, watcher?: boolean, mount?: string): RetMsg {
      if (!path_ || path_.length < 1) {
         console.info('no path_ arg passed')
         return
      }
      try {
         console.info(' Tag ' + path_)

         let t = new Comps(path_)
         let lst = t.get()
         t.comps(lst, watcher, mount)

         // now do the regular bake
         return this.bake(path_)
      } catch (err) {
         //logger.info(err)
         return new RetMsg(path_ + ' tag', -1, err)
      }
      // return new RetMsg(path_ + ' tag', 1,'ok')
   }

   // itemize and bake
   itemizeNBake(ppath_): RetMsg {
      if (!ppath_ || ppath_.length < 1) {
         console.info('no path_ arg passed')
         return
      }
      logger.info('ib:', ppath_)

      try {
         const i = new Items(ppath_)
         i.itemize()
      } catch (err) {
         logger.info(err)
         return new RetMsg(ppath_ + ' itemizeB', -1, err)
      }
      return this.bake(ppath_)
   }

   // itemize, bake and tag, needs itemize to find yaml i dat in path_
   _all(path_): RetMsg {
      try {
         let t = new Comps(path_)
         let lst = t.get()
         t.comps(lst)
         return this.itemizeNBake(path_)
      } catch (err) {
         logger.info(err)
         return new RetMsg(path_ + ' tagA', -1, err)
      }
      // return new RetMsg(path_ + ' tagA', 1,'ok')
   }
}

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
   static minify_es6(text, inline) {
      var uglifyEsOptions = {
         parse: { bare_returns: {} },
         mangle: false,
         keep_classnames: true,
         keep_fnames: true,
         safari10: true
      }

      var code = text.match(/^\s*\s*$/) ? '' : text
      uglifyEsOptions.parse.bare_returns = inline

      var result = Terser.minify(code, uglifyEsOptions)
      if (result.error) {
         console.info('Uglify-es error:', result.error)
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

      var result = []
      for (let i = 0; i < source.length; ++i) {
         if (source.substring(i, i + f.length) == f)
            result.push(i)
      }
      return result
   }


   //the markdown magic for fixed
   fixedHTMLcss(h) {
      if (!h) return h
      var nh = (' ' + h).slice(1) // make a copy

      let hits: number[] = BakeWrk.sindexes(h, '<!--')
      if (hits.length < 1) return nh
      logger.trace(hits.length)

      let start = hits[0]
      let end = h.indexOf('-->', start)
      let str = h.substring(start + 5, end - 1)
      try {
         logger.trace(str)
         let y = yaml.load(str)
         //refactor nh to remove markup
         let s1 = h.substring(0, start)
         let s2 = h.substring(end + 3)

         // add css style inline
         let klass = y['class']
         let background_image = y['background-image']
         let css = ' <style>.' + klass + ' { '
         css = css + 'background-image: ' + background_image + ';'
         css = css + ' </style>'

         // add div
         let div = ' <div class=\'' + klass + '\' >'
         div = div + '</div> '

         return this.fixedHTMLcss(s1 + div + css + s2) // keep going while <|-- exists
      } catch (err) {
         logger.error(err)
         return h
      }
   }//()

   bake() {
      let tstFile = this.dir + '/index.pug'
      if (!fs.existsSync(tstFile)) {
         return
      }
      process.chdir(this.dir)

      let m = new Dat(this.dir)
      //static data binding with a custom md filter that uses a transformer
      let options = m.getAll()
      options['filters'] = {
         metaMD: BakeWrk.metaMD,
         marp: BakeWrk.marp
      }
      let minifyO = {
         caseSensitive: true,
         collapseWhitespace: true,
         decodeEntities: true,
         minifyCSS: true,
         minifyJS: BakeWrk.minify_es6,
         quoteCharacter: "'",
         removeComments: true,
         removeScriptTypeAttributes: true,
         removeStyleLinkTypeAttributes: true,
         useShortDoctype: true,
         sortAttributes: true,
         sortClassName: true
      }
      let html = pug.renderFile(this.dir + '/index.pug', options)

      const ver = '<!-- mB ' + new Ver().ver() + ' on ' + new Date().toISOString() + ' -->'
      // FIX the html for css
      html = this.fixHTMLcss(html)

      if (!options['pretty'])
         html = minify(html, minifyO)
      html = html.replace(BakeWrk.ebodyHtml, ver + BakeWrk.ebodyHtml)

      let fn = this.dir + '/index.html'
      fs.writeFileSync(fn, html)
      //console.info(' processed: '+ this.dir)

      //amp
      if (!fs.existsSync(this.dir + '/m.pug'))
         return ' '
      //static data binding:
      html = pug.renderFile(this.dir + '/m.pug', options)
      // FIX the html for css
      html = this.fixHTMLcss(html)

      if (!options['pretty'])
         html = minify(html, minifyO)
      html = html.replace(BakeWrk.ebodyHtml, ver + BakeWrk.ebodyHtml)

      fn = this.dir + '/m.html'
      fs.writeFileSync(fn, html)

   }//()

   getNameFromFileName(filename) {//lifted from pug cli
      filename = Dirs.slash(filename)

      if (filename.indexOf('/') > -1) {
         let pos = filename.lastIndexOf('/') + 1
         filename = filename.substring(pos)
      }
      let file = filename.replace(/\.(?:pug|jade)$/, '')
      return file.toLowerCase().replace(/[^a-z0-9]+([a-z])/g, function (_, character) {
         return character.toUpperCase()
      }) + 'Bind'
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
         dir = dir2.slice(0, -11)
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
      let y = yaml.load(fs.readFileSync((fn)))

      Items.clean(y)
      y.mbVer = new Ver().ver()
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

      // don't include
      delete o['publish']

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
   comps(list, watcher?: boolean, mount?: string): string {
      console.info('Looking for tags *-comp ' + this.dir)
      for (let val of list) {//clean the strings
         let s: string = fs.readFileSync(val).toString()

         let n = val.lastIndexOf('/')
         let dir: string = val.substring(0, n)
         let name: string = val.substring(n)
         let p = name.lastIndexOf('.')
         name = name.substring(0, p)
         console.info(' ' + dir + name);
         this.process(s, dir + name, watcher, mount)
      }
      return 'ok'
   }//()

   static getObsOptions(): TInputOptions {
      let t = {
         identifierNamesGenerator: 'hexadecimal' // for virus
         , disableConsoleOutput: true 
         , target: 'browser-no-eval'

         , stringArray: true
         , stringArrayThreshold: 1
         , stringArrayEncoding: 'rc4'

         , selfDefending: true 

         , controlFlowFlattening: true
         , controlFlowFlatteningThreshold: 1

         , deadCodeInjection: true
         , deadCodeInjectionThreshold: 0.2
      }
      return t as TInputOptions
   }

   ver = '// mB ' + new Ver().ver() + ' on ' + new Date().toISOString() + '\r\n'

   process(s: string, fn: string, watcher?: boolean, mount?: string) {
      const r_options = { 'template': 'pug' }

      logger.info('compiling', fn + '.tag')
      let js
      try {
         if (watcher) {
            js = riotc.compile(s, r_options, mount)
         } else {
            js = riotc.compile(s, r_options)
         }
      } catch (err) {
         beeper(1);
         logger.error('compiler error')
         logger.error(err)
         return
      }

      fs.writeFileSync(fn + '.js', js)

      logger.info('minify')

      let ugs
      try {
         // ugs http://npmjs.com/package/uglify-es
         ugs = JavaScriptObfuscator.obfuscate(js, Comps.getObsOptions())// ugs

      } catch (err) {
         logger.error('error')
         logger.error(err)
         return
      }

      let obCode = this.ver + ugs.getObfuscatedCode()

      fs.writeFileSync(fn + '.min.js', obCode)
   }
}//class


module.exports = {
   Dat, Dirs, BakeWrk, Items, Comps, Ver, MBake, RetMsg
}
