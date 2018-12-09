
import { Ver, MBake, RetMsg, Map , Dirs, Dat} from './Base'
import fbAdmin = require('firebase-admin')
import fs = require('fs')
import fse = require('fs-extra')

import express = require('express')
import probe = require('probe-image-size')
import bsz = require('buffer-image-size')

import extractor = require('unfluff')//scrape
import axios from 'axios'
import chokidar = require('chokidar')
import reload = require('reload')

import Marpit = require('@marp-team/marpit')
const marpit = new Marpit.Marpit()

import cheerio = require('cheerio')
import interceptor = require('express-interceptor')
const logger = require('tracer').console()



// slides/////////////////////////////////////////////////////////////////////////////////////////////////
export class Slides {
   foo() {

      const theme = `
      /* @theme example */
      
      section {
        background-color: #369;
        color: #fff;
        font-size: 30px;
        padding: 40px;
      }
      
      h1,
      h2 {
        text-align: center;
        margin: 0;
      }
      
      h1 {
        color: #8cf;
      }
      `
      marpit.themeSet.default = marpit.themeSet.add(theme)
      
      // 3. Render markdown
      const markdown = `
      
      # Hello, Marpit!
      
      Marpit is the skinny framework for creating slide deck from Markdown.
      
      ---
      
      ## Ready to convert into PDF!
      
      You can convert into PDF slide deck through Chrome.
      
      `
      const { html, css } = marpit.render(markdown)
      
      // 4. Use output in your HTML
      const htmlFile = `
      <!DOCTYPE html>
      <html><body>
        <style>${css}</style>
        ${html}
      </body></html>
      `
      fs.writeFileSync('example123123.html', htmlFile.trim())

   }
}

// watch: /////////////////////////////////////////////////////////////////////////////////////////////////
export class Wa {
   static gwatch() {
      const path = require('path')
      const appDir = path.dirname(require.main.filename)
      const electron = require('electron' )
      const proc = require('child_process')
      console.log(appDir)

      const fp = appDir+'../ewApp/main.js'

      /*const options = {
         stdio: [ 'pipe', 'pipe', 'pipe', 'ipc' ]
         , windowsHide: true
      }*/
      const child = proc.spawn(electron, [fp, appDir] )
      child.stdout.on('data', function(data) { // log of child to show
         console.log(data.toString())
      })
      child.on('exit',Wa.onWaExit) 
   }// watch
   static onWaExit(){
      console.log('Watcher child exited')
   }
}

export class Watch {
   root
   watcher

   mp: MetaA
   constructor(mp_:MetaA, mount) {
      this.mp = mp_
      this.root = mount
   }

   start(poll_) {// true for WAN
      console.log(' watcher works best on linux, on ssh watched drives - that are S3 mounts')
      console.log(this.root)
      this.watcher = chokidar.watch(this.root, {
         ignored: '*.swpc*',
         ignoreInitial: true,
         cwd: this.root,
         usePolling: poll_,
         binaryInterval: 100000,
         interval: 50//time

         //alwaysStat: true,
         , atomic: 50
         , awaitWriteFinish: {
            stabilityThreshold: 100,
            pollInterval: 50
          }
      })

      this.watcher.unwatch('*.jpg')
      this.watcher.unwatch('*.html')
      this.watcher.unwatch('*.css')
      this.watcher.unwatch('*.swpc*')
      this.watcher.unwatch('*.js')

      let thiz = this
      this.watcher.on('add', function( path ){
         thiz.auto(path)
      })
      this.watcher.on('change', function(path ){
         thiz.auto(path)
      })
   }//()

   static refreshPending = false
   refreshBro() {
      if(Watch.refreshPending) return  //debounce
      Watch.refreshPending = true
      setTimeout(function () {
         console.log('reload')
         MDevSrv.reloadServer.reload()

         Watch.refreshPending = false

      }, 20)//time
   }

   auto(path_:string) {//process
      let path = Dirs.slash(path_)

      let p = path.lastIndexOf('/')
      let folder = ''
      let fn = path

      if(p>0) {
         folder = path.substring(0,p)
         fn = path.substr(p+1)
      }

      try {
         logger.trace('WATCHED1:',folder + '/' + fn)

         this.mp.autoBake(folder, fn)
         this.refreshBro()

      } catch(err) {
         logger.warn(err)
      }
   }
}//class

export class MetaA {
   mount:string
   b = new MBake()
   m:Map

   static folderProp = 'folder'

   static srcProp = 'src'
   static destProp = 'dest'

   _lastMsg:RetMsg

   setLast(m:RetMsg) {
      this._lastMsg = new RetMsg(m._cmd, m.code, m.msg)
   }
   getLastMsg():RetMsg{
      let m = this._lastMsg
      return new RetMsg(m._cmd, 1, m.msg)
   }

   constructor(mount) {
      this.mount = mount
      this.m = new Map(this.mount)
      logger.trace('MetaPro', this.mount)
   }

   bake(dir:string):RetMsg {
      let folder = this.mount + '/' +dir
      logger.trace(folder)
      let msg:RetMsg = this.b.bake(folder)
      this.setLast(msg)
      return msg
   }
   tagRoot():RetMsg {
      return this.tag('/')
   }
   tag(dir:string):RetMsg {
      let folder = this.mount + '/' +dir
      logger.trace(folder)
      let msg:RetMsg = this.b.tag(folder)
      this.setLast(msg)
      return msg
   }
   map():RetMsg {
      let msg:RetMsg = this.m.gen()
      this.setLast(msg)
      return msg
   }
   itemize(dir:string):RetMsg {
      let msg:RetMsg = this.b.itemizeNBake(this.mount+ '/' +dir)
      this.setLast(msg)
      return msg
   }
   itemizeOnly(dir:string):RetMsg {
      let msg:RetMsg = this.b.itemizeOnly(this.mount+ '/' +dir)
      this.setLast(msg)
      return msg
   }

   getItems(dir:string):RetMsg {
      let s:string =  fs.readFileSync(this.mount+'/'+dir+'/items.json', 'utf8')
      //TODO: handle not found
      let msg:RetMsg = new RetMsg(s, 1, 'success')
      this.setLast(msg)
      return msg
   }

   // when you pass the file name, ex: watch
   autoBake(folder__, file):RetMsg {
      const folder = Dirs.slash(folder__)
      logger.trace('WATCHED2a:', folder)

      const ext = file.split('.').pop()

      if (ext =='yaml') // bake and itemize
         return this.itemize(folder)

      if (ext =='md')
         return this.bake(folder)

      if (ext =='pug') {
         if( file.indexOf('-tag') >= 0 )
            return this.tag(folder)
         else
            return this.bake(folder)
      }

      let m =  new RetMsg(folder+'-'+file,-1,'nothing to bake')
      this.setLast(m)// maybe not set it to avoid noise?
      return m
   }
}

export class FileOps {
   root
   constructor(root_) {
      this.root = Dirs.slash(root_)
   }

   clone(src, dest):RetMsg {
      logger.trace('copy?')

      fse.copySync(this.root+src, this.root+dest)

      let p = this.root+dest
      logger.trace(p)
      const d = new Dat(p)
      d.write()
      logger.trace('copy!')
      return new RetMsg('clone',1,dest)
   }//()

   write(destFile, txt) {
      logger.trace(this.root+destFile)
      fs.writeFileSync(this.root+destFile, txt)
   }

   read(file):string {
      return fs.readFileSync(this.root+file).toString()
   }

   remove(path) {
      let dir_path = this.root + path
      logger.trace('remove:' + dir_path)
      if (fs.existsSync(dir_path)) {
         fs.readdirSync(dir_path).forEach(function(entry) {
            fs.unlinkSync(dir_path+'/'+entry)
         })
         fs.rmdirSync(dir_path)
      }
   }	
   removeFile(path) {
      let file_path = this.root + path
      fs.unlinkSync(file_path)
   }
}//class

// Meta: //////////////////////
export class MDevSrv {
   static reloadServer
   // http://github.com/alallier/reload

   constructor(dir, port) {// flag to ignore reload

      let app = express()
      logger.trace(dir, port)
      app.set('app port', port)
      MDevSrv.reloadServer = reload(app, {verbose:false, port:9856})
      app.set('views', dir)

      const bodyInterceptor = interceptor(function(req, res){
         return {
           // Only HTML responses will be intercepted
           isInterceptable: function(){
             return /text\/html/.test(res.get('Content-Type'))
           },
           intercept: function(body, send) {
               console.log(' h')
               let $document = cheerio.load(body)
               $document('body').prepend('<script src="/reload/reload.js"></script>')
               send($document.html())
           }
         }
      })

      const timeInterceptor = interceptor(function(req, res){
         return {
           isInterceptable: function(){
            let js = /application\/javascript/.test(res.get('Content-Type'))
            let cs = /text\/css/.test(res.get('Content-Type'))
            let img = /image\/jpg/.test(res.get('Content-Type'))

            return cs || js || img
           },
           intercept: function(body, send) {
            setTimeout(function(){send(body) }, 
               Math.floor(Math.random() * 200) + 50 )
           }
         }
      })

      app.use(bodyInterceptor)
      app.use(timeInterceptor)

      app.use(express.static(dir))
      app.listen(port, function () {
         logger.trace('dev srv '+port)
      })

   }//()
}//class


export class Scrape {
   constructor() {
      axios.defaults.responseType= 'document'
   }

   s(url) {
      return new Promise(function(resolve, reject) {
         try {
         console.log(url)
         axios.get( url ).then(function(response){
            let data = extractor.lazy(response.data)
            let ret = new Object()
            ret['title'] = data.softTitle()
            ret['content_text'] = data.description()
            ret['image'] = data.image()

            ret['title'] = Scrape.alphaNumeric( ret['title'])
            ret['content_text'] = Scrape.alphaNumeric( ret['content_text'])
            resolve(ret)
         })
      } catch(err) {
         logger.warn(err)
         reject(err)
      }
      })//pro
   }

   static getImageSize(iurl_) {
      logger.trace(iurl_)
      return probe(iurl_, { timeout: 3000 })
   }

   static alphaNumeric(str) {
      if(!str) return ''
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

   static getBufferImageSize(buf_) {
      return bsz(buf_)
   }

}//class


export class AdminSrv { // until we write a push service
   //static reloadServer      
   constructor(config) {
      let dir = config['admin_www']
      let port = config['admin_port']

      let app = express()
      logger.trace(dir,port)
      app.set('admin port', port)
      
      let fbServiceAccount = new Object(JSON.parse( fs.readFileSync(config['firebase_config']).toString() ) )

      app.set('views', dir)

      app.use(express.static(dir))
      app.listen(port, function () {
         logger.trace('admin app'+port)
      })
   }//()
}//class

export class AdminFireUtil {
   public fbApp = null

   constructor(config) {
    
      let fbServiceAccount = new Object(JSON.parse(fs.readFileSync(config['firebase_config']).toString()))

      this.fbApp = fbAdmin.initializeApp({
         credential: fbAdmin.credential.cert(fbServiceAccount)
      })

   }

   deleteAuthUser(uid:string) {
      console.log('deleteAuthUser'+uid)
      return fbAdmin.auth().deleteUser(uid)
   }

}//class

module.exports = {
   Wa, AdminFireUtil, AdminSrv, Scrape, MetaA, Watch, FileOps, Slides
}