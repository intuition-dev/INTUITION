// All rights reserved by Metabake (Metabake.org) | Cekvenich, licensed under LGPL 3.0
// NOTE: You can extend these classes!

import {MBake, Dirs, Dat} from './Base'
import {Sas, MinJS} from './Sa'

import fs = require('fs-extra')
import FileHound = require('filehound')
import yaml = require('js-yaml')

// map
import sm = require('sitemap')
import traverse = require('traverse')
import lunr = require('lunr')

import express = require('express')
import probe = require('probe-image-size')

import extractor = require('unfluff')//scrape
import axios from 'axios'
import chokidar = require('chokidar')
import reload = require('reload')

import cheerio = require('cheerio')
import interceptor = require('express-interceptor')
const logger = require('tracer').console()

import csv2JsonV2 = require('csvtojson')

import opn = require('open')

// watch: /////////////////////////////////////////////////////////////////////////////////////////////////
export class Wa {

   static watch(dir: string, port?: number, reloadPort?: number) {
      port = port || 8090;
      let ss = new MDevSrv(dir, port, reloadPort)
      const mp = new MetaPro(dir)
      let ww = new Watch(mp, dir)
      
      ww.start(400) // build X ms after save

      console.info(' Serving on ' + 'http://localhost:' + port)
      console.info(' --------------------------')
      console.info('')
      opn('http://localhost:' + port)
   }//()

}

export class CSV2Json { // TODO: get to work with watcher
   dir: string
   constructor(dir_: string) {
      if (!dir_ || dir_.length < 1) {
         console.info('no path arg passed')
         return
      }
      this.dir = Dirs.slash(dir_)
   }

   convert(): Promise<string> {
      return new Promise(function (resolve, reject) {
      let fn: string = this.dir + '/list.csv'
      if (!fs.existsSync(fn)) { //if it does not exist, go up a level
         console.info('not found')
         reject('not found')
      }
      let thiz = this
      logger.info('1')

      csv2JsonV2({noheader: true}).fromFile(fn)
         .then(function (jsonO) {
            logger.info(jsonO)
            let fj: string = thiz.dir + '/list.json'

            fs.writeFileSync(fj, JSON.stringify(jsonO, null, 3))
            resolve('OK')
         })
      })
   }//()
}

export class Watch {
   root
   watcher

   mp: MetaPro
   constructor(mp_: MetaPro, mount) {
      this.mp = mp_
      this.root = mount
   }

   delay
   start(delay_) {// true for WAN
      this.delay = delay_
      console.info(' watcher starting')
      console.info(this.root)
      this.watcher = chokidar.watch(this.root, {
         ignored: '*.swpc*',
         ignoreInitial: true,
         cwd: this.root,
         usePolling: true, // for linux support
         useFsEvents: false, // for linux support
         binaryInterval: delay_ * 5,
         interval: delay_//time

         //alwaysStat: true,
         , atomic: delay_
         , awaitWriteFinish: {
            stabilityThreshold: delay_ * 2.11,
            pollInterval: delay_ *.7
         }
      })

      this.watcher.unwatch('*.html')
      this.watcher.unwatch('*.swpc*')
      this.watcher.unwatch('*.min*')
      this.watcher.unwatch('*.min.js')
      this.watcher.unwatch('*.css')
      this.watcher.unwatch('.DS_Store')
      this.watcher.unwatch('.gitignore')
      this.watcher.unwatch('.git') // how to ignore git folder of changes? todo

      let thiz = this
      this.watcher.on('add', function (path) {
         Watch.debounce(thiz.auto(path), this.delay*4.3)
      })
      this.watcher.on('change', function (path) {
         Watch.debounce(thiz.auto(path), this.delay*4.3)
      })
   }//()

   static debounce(callback, time) {
      var timeout;
      return function() {
         var context = this
         var args = arguments;
         if (timeout) {
            clearTimeout(timeout)
         }
         timeout = setTimeout(function() {
            timeout = null
            callback.apply(context, args)
         }, time)
      }
   }

   refreshBro() {
      MDevSrv.reloadServer.reload()
   }

   auto(path_: string) {//process
      let path = Dirs.slash(path_)

      let p = path.lastIndexOf('/')
      let folder = ''
      let fn = path

      if (p > 0) {
         folder = path.substring(0, p)
         fn = path.substr(p + 1)
      }

      try {
         logger.info('WATCHED1:', folder + '/' + fn)

         let pro:Promise<string> = this.mp.autoBake(folder, fn)
         const THIZ = this
         pro.then(function(val){
            console.log(val)
            THIZ.refreshBro()
         })

      } catch (err) {
         logger.warn(err)
      }
   }
}//class

export class MetaPro {
   mount: string
   b = new MBake()
   m: Map

   static folderProp = 'folder'

   static srcProp = 'src'
   static destProp = 'dest'


   constructor(mount) {
      this.mount = mount
      this.m = new Map(this.mount)
      logger.info('MetaPro', this.mount)
   }

   bake(dir: string): Promise<string> {

      let folder = this.mount + '/' + dir
      logger.info(folder)
      return this.b.bake(folder)
   }

   comps(dir: string): Promise<string> {
      let folder = this.mount + '/' + dir
      logger.info(folder)
      return this.b.compsNBake(folder, true, this.mount)
   }
   map(): Promise<string> {
      return this.m.gen()
   }

   itemize(dir: string): Promise<string> {
      return this.b.itemizeNBake(this.mount + '/' + dir)
   }

   css(dir: string):Promise<string> {
      return new Sas().css(this.mount + '/' + dir)
   }

   ts(dir: string):Promise<string> {
      const folder = this.mount + '/' + dir;
      const js = new MinJS();
      return js.ts(folder);
   }

   minJS(dir: string):Promise<string> {
      const folder = this.mount + '/' + dir;
      const js = new MinJS();
      return js.min(folder);
   }

   // when you pass the file name, ex: watch
   autoBake(folder__, file):Promise<string> {
      const folder = Dirs.slash(folder__)

      const ext = file.split('.').pop()
      logger.info('WATCHED2:', folder, ext)

      if (ext == 'scss' || ext == 'sass') // css
         return this.css(folder)
         
      if (ext == 'ts') // ts
         return this.ts(folder)

      if (ext == 'yaml') // bake and itemize
         return this.itemize(folder)
      if (ext == 'md')
         return this.bake(folder)

      if (ext == 'pug') {
         if (file.indexOf('-comp') >= 0)
            return this.comps(folder)
         else
            return this.bake(folder)
      }

   }//()

}//class

// Meta: //////////////////////
export class MDevSrv {
   static reloadServer

   constructor(dir, port, reloadPort?) {
      let app = express()
      logger.info(dir, port)
      app.set('app port', port)
      const rport = Number(reloadPort) || 9856;
      reload(app, {verbose: false, port: rport})
      .then((reloadServer_) => {
         MDevSrv.reloadServer = reloadServer_
         logger.info('reloadServer')
      }).catch(e => {
         console.log('==================e', e)
      })

      app.set('views', dir)

      const bodyInterceptor = interceptor(function (req, res) {
         return {
            // Only HTML responses will be intercepted
            isInterceptable: function () {
               return /text\/html/.test(res.get('Content-Type'))
            },
            intercept: function (body, send) {
               console.info(' .')
               let $document = cheerio.load(body)
               $document('body').prepend('<script src="/reload/reload.js"></script>')
               send($document.html())
            }
         }
      })

      const timeInterceptor = interceptor(function (req, res) {
         return {
            isInterceptable: function () {
               let js = /application\/javascript/.test(res.get('Content-Type'))
               let cs = /text\/css/.test(res.get('Content-Type'))
               let img = /image\/jpg/.test(res.get('Content-Type'))

               return cs || js || img
            },
            intercept: function (body, send) {
               setTimeout(function () {send(body)},
                  Math.floor(Math.random() * 200) + 50)
            }
         }
      })

      app.use(bodyInterceptor)
      app.use(timeInterceptor)

      app.use(express.static(dir))
      app.listen(port, function () {
         logger.info('dev srv ' + port)
      })

   }//()
}//class


export class FileOps {
   root
   constructor(root_) {
      this.root = Dirs.slash(root_)
   }

   /** returns # of files with the name, used for edit ver */
   count(fileAndExt):number {

      const files = FileHound.create()
         .paths(this.root)
         .depth(0)
         .match(fileAndExt+'*')
         .findSync()

      return files.length
   }

   clone(src, dest): Promise<string> {
      return new Promise(function (resolve, reject) {
      logger.info('copy?')

      fs.copySync(this.root + src, this.root + dest)

      let p = this.root + dest
      logger.info(p)
      const d = new Dat(p)
      d.write()
      logger.info('copy!')
      resolve('OK')
      })
   }//()

   write(destFile, txt) {
      logger.info(this.root + destFile)
      fs.writeFileSync(this.root + destFile, txt)
   }

   read(file): string {
      return fs.readFileSync(this.root + file).toString()
   }

   remove(path) {
      let dir_path = this.root + path
      logger.info('remove:' + dir_path)
      if (fs.existsSync(dir_path)) {
         fs.readdirSync(dir_path).forEach(function (entry) {
            fs.unlinkSync(dir_path + '/' + entry)
         })
         fs.rmdirSync(dir_path)
      }
   }
   removeFile(path) {
      let file_path = this.root + path
      fs.unlinkSync(file_path)
   }
}//class


export class Map {
   _sitemap
   _root
   constructor(root) {
      if (!root || root.length < 1) {
         console.info('no path arg passed')
         return
      }
      this._root = root
   }
   gen():Promise<string> {
      return new Promise(function (resolve, reject) {

      const m = yaml.load(fs.readFileSync(this._root + '/map.yaml'))
      let jmenu = JSON.stringify(m.menu, null, 2)
      //menu done
      fs.writeFileSync(this._root + '/menu.json', jmenu)

      this._sitemap = sm.createSitemap({
         hostname: m['host']
      })

      //build sitemap
      let leaves = traverse(m.menu).reduce(function (acc, x) {
         if (this.isLeaf) acc.push(x)
         return acc
      }, [])
      // any items recursively
      let itemsRoot = m['itemsRoot']
      if (itemsRoot) {
         //visit each path
         const d = new Dirs(this._root + itemsRoot)
         leaves = leaves.concat(d.getFolders())
      }

      let arrayLength = leaves.length
      logger.info(arrayLength)
      for (let i = 0; i < arrayLength; i++) {
         try {
            let path = leaves[i]

            if (path.includes(this._root))
               path = path.replace(this._root, '')
            let fullPath = this._root + path

            let dat = new Dat(fullPath)
            let props = dat.getAll()
            logger.info(path)//, props)

            //priority
            let priority = props['priority']
            if (!priority) priority = 0.3

            let image = props['image']
            if (!image) {
               this._sitemap.add({
                  url: path,
                  changefreq: m['changefreq'],
                  priority: priority
               })
            } else {  //if it has image
               this._sitemap.add({
                  url: path,
                  changefreq: m['changefreq'],
                  priority: priority,
                  img: [{
                     url: image,
                     title: props['title'],
                     caption: props['title']
                  }]
               })
            }
         } catch (err) {
            logger.info(err)
         }
      }//for

      //validate and write
      const thiz = this
      this._sitemap.toXML(function (err, xml) {

         fs.writeFileSync(thiz._root + '/sitemap.xml', xml)
         console.info(' Sitemap ready')

         thiz._map(leaves)

      })// to XML write
      resolve('OK')
      })
   }//map()

   _map(leaves) {
      let documents = []

      let arrayLength = leaves.length
      for (let i = 0; i < arrayLength; i++) {
         try {
            let path = leaves[i]
            if (path.includes(this._root))
               path = path.replace(this._root, '')
            let fullPath = this._root + path

            // find all md files in fullPath
            const rec = FileHound.create() //recursive
               .paths(fullPath)
               .ext('md')
               .findSync()

            let text = ''
            for (let val of rec) {//clean the strings
               val = Dirs.slash(val)
               console.info(val)
               let txt1 = fs.readFileSync(val, "utf8")
               text = text + ' ' + txt1
            }//for
            const row = {
               id: path,
               body: text
            }
            documents.push(row)
         } catch (err) {logger.info(err)}
      }//for

      //fts index
      logger.info(documents.length)
      let idx = lunr(function () {
         this.ref('id')
         this.field('body')

         documents.forEach(function (doc) {
            this.add(doc)
         }, this)
      })//idx

      const jidx = JSON.stringify(idx)
      fs.writeFileSync(this._root + '/FTS.idx', jidx)

      console.info(' Map generated menu.json, sitemap.xml and FTS.idx(json) index in ' + this._root)

   }//()
}// class

// //////////////////////////////////////////////////////////////////////////////
export class Scrape {
   constructor() {
      axios.defaults.responseType = 'document'
   }

   s(url) {
      return new Promise(function (resolve, reject) {
         try {
            console.info(url)
            axios.get(url).then(function (response) {
               let data = extractor.lazy(response.data)
               let ret = new Object()
               ret['title'] = data.softTitle()
               ret['content_text'] = data.description()
               ret['image'] = data.image()

               ret['title'] = Scrape.alphaNumeric(ret['title'])
               ret['content_text'] = Scrape.alphaNumeric(ret['content_text'])
               resolve(ret)
            })
         } catch (err) {
            logger.warn(err)
            reject(err)
         }
      })//pro
   }

   static __getImageSize(iurl_) {
      logger.info(iurl_)
      return probe(iurl_, {timeout: 3000})
   }

   static alphaNumeric(str) {
      if (!str) return ''
      const alpha_numeric = Array.from('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789' + ' ')
      let filterd_string = ''

      for (let i = 0; i < str.length; i++) {
         let char = str[i]
         let index = alpha_numeric.indexOf(char)
         if (index > -1) {
            filterd_string += alpha_numeric[index]
         }
      }
      return filterd_string
   }//()

}//class



module.exports = {
   Wa, MetaPro, Watch, FileOps, MDevSrv, CSV2Json,
   Scrape
}
