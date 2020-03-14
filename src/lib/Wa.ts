// All rights reserved by Cekvenich|INTUITION.DEV) |  Cekvenich, licensed under LGPL 3.0
// NOTE: You can extend these classes!

import { MBake} from './Base'
import { Sas, MinJS } from './Extra'

const {Dirs} = require('agentg/lib/FileOpsExtra')

import express = require('express')

import chokidar = require('chokidar')
import reload = require('reload')

import cheerio = require('cheerio')
import interceptor = require('express-interceptor')

 

const log = bunyan.createLogger({src: true, stream: formatOut, name: "WA"})

import opn = require('open')

// watch: /////////////////////////////////////////////////////////////////////////////////////////////////
export class Wa {

   static watch(dir: string, port?: number, reloadPort?: number) {
      port = port || 8090;
      let ss = new MDevSrv(dir, port, reloadPort)
      const mp = new MetaPro(dir)
      let ww = new Watch(mp, dir)
      
      ww.start(250) // build x ms after saving a file

      log.info(' Serving on ' + 'http://localhost:' + port)
      log.info(' --------------------------')
      log.info('')
      opn('http://localhost:' + port)
   }//()
}


export class Watch {
   root
   watcher

   mp: MetaPro
   constructor(mp_: MetaPro, mount:string) {
      this.mp = mp_
      if(mount.endsWith('/.')) {
         mount = mount.slice(0, -1)
      }
      this.root = mount
   }

   delay
   start(delay_) {// true for WAN
      this.delay = delay_
      log.info(' watcher starting')
      log.info(this.root)
      let watchList = []
      watchList.push(this.root+'/**/*.md')
      watchList.push( this.root+'/**/*.ts')
      watchList.push( this.root+'/**/*.pug')
      watchList.push(this.root+'/**/*.scss')
      watchList.push(this.root+'/**/*.sass')
      watchList.push(this.root+'/**/*.yaml')
      watchList.push(this.root+'/**/*.js')
      watchList.push(this.root+'/**/*.json')
      watchList.push(this.root+'/**/*.css')

      log.info(watchList)
      this.watcher = chokidar.watch(watchList, {
         ignoreInitial: true,
         cwd: this.root,
         usePolling: true, // for linux support
         useFsEvents: false, // for linux support
         binaryInterval: delay_ * 5,
         interval: delay_//time

         , atomic: delay_
         , awaitWriteFinish: {
            stabilityThreshold: delay_ * 1.2,
            pollInterval: delay_ *.5
         }
      })

      let thiz = this
      this.watcher.on('add', async function (path) {
         await thiz.autoNT(path, 'a')
      })
      this.watcher.on('change', async function (path) {
         await thiz.autoNT(path, 'c')
      })
   }//()

   refreshBro() {
      MDevSrv.reloadServer.reload()
   }


   async autoNT(path_: string, wa:string) {//process
      log.info(wa)
      let path = Dirs.slash(path_)

      let p = path.lastIndexOf('/')
      let folder = ''
      let fn = path

      if (p > 0) {
         folder = path.substring(0, p)
         fn = path.substr(p + 1)
      }

      try {
         log.info('WATCHED1:', folder + '/' + fn)
         await this.mp.autoBake(folder, fn)
         await this.refreshBro()
      
      } catch (err) {
         log.warn(err)
      }
   }//()
}//class

export class MetaPro {
   mount: string
   b = new MBake()

   static folderProp = 'folder'

   static srcProp = 'src'
   static destProp = 'dest'


   constructor(mount) {
      this.mount = mount
      log.info('MetaPro', this.mount)
   }

   bake(dir: string): Promise<string> {

      let folder = this.mount + '/' + dir
      log.info(folder)
      return this.b.bake(folder, 0)
   }

   itemize(dir: string): Promise<string> {
      return this.b.itemizeNBake(this.mount + '/' + dir, 0)
   }

   css(dir: string):Promise<string> {
      return new Sas().css(this.mount + '/' + dir)
   }

   ts(dir: string):Promise<string> {
      const folder = this.mount + '/' + dir;
      const js = new MinJS();
      return js.ts(folder);
   }

   // when you pass the file name, ex: watch
   async autoBake(folder__, file):Promise<string> {
      const folder = Dirs.slash(folder__)

      const ext = file.split('.').pop()
      log.info('WATCHED2:', folder, ext)

      if (ext == 'scss' || ext == 'sass') // css
         return await this.css(folder)
         
      if (ext == 'ts') // ts
         return await this.ts(folder)

      if (ext == 'yaml') // bake and itemize
         return await this.itemize(folder)

      if (ext == 'md')
         return await this.bake(folder)

      if (ext == 'pug') {
         return await this.bake(folder)
      }
      return ('Cant process ' + ext)
   }//()

}//class

// Meta: //////////////////////
export class MDevSrv {
   static reloadServer

   constructor(dir, port, reloadPort?) {
      let app = express()
      log.info(dir, port)
      app.set('app port', port)
      const rport = Number(reloadPort) || 9856;
      reload(app, {verbose: false, port: rport})
      .then((reloadServer_) => {
         MDevSrv.reloadServer = reloadServer_
         log.info('reloadServer')
      }).catch(e => {
         log.info('==================e', e)
      })

      app.set('views', dir)

      const bodyInterceptor = interceptor(function (req, res) {
         return {
            // Only HTML responses will be intercepted
            isInterceptable: function () {
               return /text\/html/.test(res.get('Content-Type'))
            },
            intercept: function (body, send) {
               //log.info(' .')
               let $document = cheerio.load(body)
               $document('body').prepend('<script src="/reload/reload.js"></script>')
               send($document.html())
            }
         }
      })

      app.use(bodyInterceptor)

      app.use(express.static(dir))
      app.listen(port, function () {
         log.info('dev srv ' + port)
      })

   }//()
}//class

