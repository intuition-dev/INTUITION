import { isReturnStatement } from "babel-types";

// All rights Metabake.org | cekvenich, licensed under GPL v3

declare var module: any
declare var require: any
declare var process: any

const fs = require('fs')
const fse = require('fs-extra')
const FileHound = require('filehound')
const yaml = require('js-yaml')
const riotc = require('riot-compiler')
const pug = require('pug')
const logger = require('tracer').console()

const csv2JsonV2 = require('csvtojson')

const JavaScriptObfuscator = require('javascript-obfuscator')

const express = require('express')
const chokidar = require('chokidar')
const reload = require('reload')

const extractor = require('unfluff')//scrape
const axios = require('axios')

const probe  = require('probe-image-size')

// map
const sm = require('sitemap')
const traverse = require('traverse')
const lunr = require('lunr')

export class Ver {
   ver() {
      return "v3.8.31"
   }

   static slash(path) {// windowze
      return path.replace(/\\/g, '/')
   }
}

export class RetMsg {
   _cmd:string
   _code:number
   _msg: any
   constructor(cmd:string, code:number, msg:any) {
      this._cmd = cmd
      this._code = code
      this._msg = msg
   }//)_
   get cmd():string {
      return this.cmd;
   }
   get code():number {
      return Math.round(this._code)
   }
   get msg():any{
      return this
   }
   log() {
      console.log(this.cmd, this.msg, this.code)
   }
}//class

export class Map {
   _sitemap
   _root
   constructor(root) {
      this._root = root
   }
   gen() {
      const m = yaml.load(fs.readFileSync(this._root+'/map.yaml'))
      let jmenu = JSON.stringify(m.menu, null, 2)
      //menu done
      fs.writeFileSync(this._root+'/menu.json', jmenu)

      this._sitemap = sm.createSitemap( {
         hostname: m['host']
      })

      //build sitemap
      let leaves = traverse(m.menu).reduce(function (acc, x) {
         if (this.isLeaf) acc.push(x)
         return acc
      }, [])
      // any items recursively
      let itemsRecRoot = m['itemsRecRoot']
      if (itemsRecRoot) {
         //visit each path
         const d = new Dirs(this._root + itemsRecRoot)
         leaves = leaves.concat(d.get())
      }

      var arrayLength = leaves.length
      logger.trace(arrayLength)
      for (var i = 0; i < arrayLength; i++) {
         try {
            let path = leaves[i]

            if(path.includes(this._root))
               path = path.replace(this._root,'')
            let fullPath =  this._root + path

            let dat = new Dat(fullPath)
            let props = dat.getAll()
            logger.trace(path)//, props)

            let publish = props['publish']
            if (publish == false) //skip
               continue
            let image = props['image']
            if(!image) {
               this._sitemap.add({
                  url: path,
                  changefreq: m['changefreq']
               })
            } else {  //if it has image
               this._sitemap.add({
                  url: path,
                  changefreq: m['changefreq'],
                  img: [{
                     url: image,
                     title: props['title'],
                     caption: props['title']
                  }]
               })
            }
         } catch(err) { logger.trace(err)}
      }//for

      //validate and write
      const thiz = this
      this._sitemap.toXML( function (err, xml) {

         fs.writeFileSync(thiz._root+'/sitemap.xml', xml)
         console.log(' Sitemap ready')

         thiz._map2(leaves)

      })// to XML write

   }//map()

   _map2(leaves) {
      let documents = []

      var arrayLength = leaves.length
      for (var i = 0; i < arrayLength; i++) {
         try {
            let path = leaves[i]
            if(path.includes(this._root))
               path = path.replace(this._root,'')
            let fullPath =  this._root + path

            // find all md files in fullPath
            const rec = FileHound.create() //recurse
               .paths(fullPath)
               .ext('md')
               .findSync()

            let text =''
            for (let val of rec) {//clean the strings
               val = Ver.slash(val)
               console.log(val)
               let txt1 = fs.readFileSync(val, "utf8")
               text = text + ' ' + txt1
            }//for
            const row = {
               id: path,
               body: text
            }
            documents.push(row)
         } catch(err) { logger.trace(err)}
      }//for

      //fts index
      logger.trace(documents.length)
      var idx = lunr(function () {
         this.ref('id')
         this.field('body')

         documents.forEach(function (doc) {
            this.add(doc)
         }, this)
      })//idx

      const jidx = JSON.stringify(idx)
      fs.writeFileSync(this._root+'/FTS.idx', jidx)

      console.log(' Map generated menu.json, sitemap.xml and FTS.idx(json) index in '+ this._root)

   }//()
}// class

export class FileOps {
   root
   constructor(root_) {
      this.root = Ver.slash(root_)
   }

   clone(src, dest):RetMsg {
      logger.trace('copy?')

      fse.copySync(this.root+src, this.root+dest)

      let p = this.root+dest
      logger.trace(p)
      const d = new Dat(p)
      d.set('publish', false)
      d.write()
      logger.trace('copy!')
      return new RetMsg('clone',1,dest)
   }//()

   write(destFile, txt) {
      logger.trace(this.root+destFile)
      fs.writeFileSync(this.root+destFile, txt)
   }

}

export class Dat {
   props: any
   path:string
   constructor(path_:string) {
      let path = Ver.slash(path_)
      //logger.trace(path)
      this.path = path

      let y
      if (fs.existsSync(path+'/dat.yaml'))
         y = yaml.load(fs.readFileSync(path+'/dat.yaml'))
      if(!y) y= {}
      this.props = y

      let keys = Object.keys( y )
      if(keys.includes('include')) this._addData()
   }
   write() {
      try{
         let y = yaml.dump(this.props,{
            skipInvalid : true,
            noRefs: true,
            noCompatMode: true,
            condenseFlow: true
         })
         let p = this.path+'/dat.yaml'
         logger.trace(p)
         fs.writeFileSync(p, y)
      } catch(err) { logger.info(err)}
   }
   set(key, val) { // ex: 'publish', false
      this.props[key] = val
   }
   _addData() {// load json for Wolfgang?
      let jn = this.props.include
      let fn = this.path+'/'+jn
      logger.trace( fn)
      let jso = fs.readFileSync(fn)
      Object.assign(this.props, JSON.parse(jso)) // merge
   }

   getAll():Object {
      return this.props
   }//()
}//class

export class Dirs {
   dir:string
   constructor(dir_:string) {
      let dir = Ver.slash(dir_)
      this.dir=dir
   }

   get() {
      logger.trace(this.dir)
      const rec = FileHound.create() //recurse
         .paths(this.dir)
         .ext('yaml')
         .findSync()
      let ret : string[] = [] //empty string array
      for (let val of rec) {//clean the strings
         val = Ver.slash(val)
         let n = val.lastIndexOf('/')
         let s:string = val.substring(0,n)
         if (!fs.existsSync(s+'/dat.yaml'))
            continue
         ret.push(s)
      }
      //logger.trace(ret)
      return ret
   }//()
}//class

export class CSV2Json { // TODO: get to work with watcher
   dir:string
   constructor(dir_:string) {
      this.dir = Ver.slash(dir_)
   }

   convert():RetMsg {
      let fn:string = this.dir +'/list.csv'
      if (!fs.existsSync(fn)) { //if it does not exist, go up a level
         let r = new RetMsg('CSV2Json', -1, 'list.csv not found in ' + this.dir)
         r.log()
         return r
      }
      let r = new RetMsg('CSV2Json', 1, 'OK')
      let thiz = this
      csv2JsonV2({ noheader:true }).fromFile(fn)
         .then(function(jsonO) {
            logger.trace(jsonO)
            let fj:string = thiz.dir +'/list.json'

            fs.writeFileSync(fj, JSON.stringify(jsonO, null, 3))
            return r
         })

   }//()
}

export class MBake {

   bake(path):RetMsg {
      try {
         console.log(' Baking ' + path)

         let d = new Dirs(path)
         let dirs =d.get()

         for (let val of dirs) {
            let n = new BakeWrk(val)
            n.bake()
         }
      } catch(err) {
         logger.trace(err)
         return new RetMsg(path + ' bake', -1, err)
      }
      return new RetMsg(path + ' bake', 1, 'ok')
   }

   tag(path):RetMsg {
      try {
         console.log(' Tag ' + path)

         let t = new Tag(path)
         let lst = t.get()
         t.tag(lst)

         // now do the regular bake
         return this.bake(path)
      } catch(err) {
         //logger.trace(err)
         return new RetMsg(path + ' tag', -1, err)
      }
      return new RetMsg(path + ' tag', 1,'ok')
   }

   itemizeOnly(path):RetMsg {

      console.log(' Itemize ' + path)
      try {
         const i = new Items(path)
         i.itemize()
      } catch(err) {
         logger.trace(err)
         return new RetMsg(path + ' itemize',  -1, err)
      }
      return new RetMsg(path + ' itemize', 1,'ok')
   }

   // itemize and bake
   itemizeNBake(ppath):RetMsg {
      logger.trace('ib:', ppath)

      try {
         const i = new Items(ppath)
         i.itemize()
      } catch(err) {
         logger.trace(err)
         return new RetMsg(ppath + ' itemizeB', -1, err)
      }
      return this.bake(ppath)
   }

   // itemize, bake and tag, needs itemize to find yaml i dat in path
   _all(path):RetMsg {
      try {
         let t = new Tag(path)
         let lst = t.get()
         t.tag(lst)
         return this.itemizeOnly(path)
      } catch(err) {
         logger.trace(err)
         return new RetMsg(path + ' tagA', -1, err)
      }
      return new RetMsg(path + ' tagA', 1,'ok')
   }
}

export class BakeWrk {
   dir:string
   static bodyHtml = '</body></html>'

   constructor(dir_:string) {
      let dir = Ver.slash(dir_)

      this.dir=dir
      console.log(' processing: '+ this.dir)
   }

   bake() {
      process.chdir(this.dir)

      this.cli(this.dir)//process pug-cli

      if (!fs.existsSync(this.dir+'/index.pug'))
         return ' '

      let m = new Dat(this.dir)

      //static data binding:
      let html = pug.renderFile(this.dir+'/index.pug', m.getAll() )

      let ver = '<!- mB v' + new Ver().ver() +' on '+new Date().toISOString()+' -->'
      html = html.replace(BakeWrk.bodyHtml, ver+BakeWrk.bodyHtml)

      let fn = this.dir + '/index.html'
      fs.writeFileSync(fn, html)
      //console.log(' processed: '+ this.dir)

   }//()

   cli(dir) {
      //logger.trace(dir)
      const files = FileHound.create()
         .depth(0)
         .paths(dir)
         .ext('pug')
         .match('*_d.pug')
         .findSync()

      let obj = {}
      if (fs.existsSync(this.dir+'/dat.yaml')) {
         let m = new Dat(this.dir)
         obj = m.getAll()
      }

      //logger.trace(files)
      for (let fn of files) {
         this.cliEach(fn, obj)
      }
   }//()

   cliEach(fn, obj) { // dynamic data binding
      let foo = this.getNameFromFileName(fn)
      console.log(' _d' ,foo)
      obj.name = foo
      obj.compileDebug = false
      let js = pug.compileFileClient(fn, obj )
      //logger.trace(js)
      let pos = fn.lastIndexOf('.')
      fn = fn.substring(0,pos) + '.js'
      console.log(' _d:', fn)
      fs.writeFileSync(fn, js)

   }//()

   getNameFromFileName(filename) {//lifted from pug cli
      filename =  Ver.slash(filename)

      if (filename.indexOf('/')>-1) {
         let pos = filename.lastIndexOf('/')+1
         filename = filename.substring(pos)
      }
      var file = filename.replace(/\.(?:pug|jade)$/, '')
      return file.toLowerCase().replace(/[^a-z0-9]+([a-z])/g, function (_, character) {
        return character.toUpperCase()
      }) + 'Bind'
    }
}//class

export class Items {
   dir:string
   dirs // array
   feed //rss
   constructor(dir_:string) {
      let dir = Ver.slash(dir_)

      let fn:string = dir +'/dat_i.yaml'
      if (!fs.existsSync(fn)) { //if it does not exist, go up a level
         let n = dir.lastIndexOf('/')
         if(n<0) throw new Error('no dat_i.yaml at ' + dir)
         dir = dir.substring(0,n)
      }

      logger.trace(' IB :', dir)

      fn = dir +'/dat_i.yaml'
      if (!fs.existsSync(fn))
        throw new Error('no dat_i.yaml at ' + dir)

      this.dir=dir
      let d = new Dirs(dir)
      this.dirs =d.get()
   }

   _addAnItem(dn) {
      try {
         if ( !fs.existsSync( dn+'/dat.yaml') )
            return
         let y = yaml.load(fs.readFileSync(dn+'/dat.yaml'))
         if(!y) return
         if(y.hasOwnProperty('publish')) {
            if(y.publish==false) {
               console.log('  skipped')
               return
            }
         }//outer

         Items.clean(y)

         let dl = dn.lastIndexOf('/')

         let url = dn.substring(dl+1)
         console.log('',url)
         y.url = url

         if(!this.feed.items)
            this.feed.items =[]

         y.index =  this.feed.items.length
         console.log('', this.feed.items.length)

         this.feed.items.push(y)
      } catch(err) {
         logger.trace(err)
      }
   }

   itemize():string {
      logger.trace('Itemizing: '+ this.dir)

      const rootDir:string = this.dir
      // header
      let fn:string = rootDir +'/dat_i.yaml'
      let y = yaml.load(fs.readFileSync((fn)))

      Items.clean(y)
      y.nbVer = new Ver().ver()
      y.note = 'This is statically served and visible publicly.'
      this.feed = y

      for (let val of this.dirs) {
         this._addAnItem(val)
      }

      if(!this.feed.items.length)  {
         logger.trace('no items')
         return
      }
      this.feed.count =  this.feed.items.length

      //write
      let json = JSON.stringify(this.feed, null, 2)
      let items = rootDir + '/items.json'
      fs.writeFileSync(items, json)

      console.log(' processed.')
      return ' processed '
   }

   static clean(o:Object) {// remove fields that are pug
      delete o['basedir']
      delete o['ROOT']
      delete o['pretty']
      delete o['publish']
   }

}//class

export class Tag {
   dir:string

   constructor(dir_:string) {
      let dir = Ver.slash(dir_)

      this.dir=dir
   }

   get() {
      const rec = FileHound.create() //recurse
         .paths(this.dir)
         .ext('pug')
         .glob('*-tag.pug')
         .findSync()
      let ret : string[] = [] //empty string array
      for (let val of rec) {//clean the strings
         val = val.split('\\').join('/') // windoze
         ret.push(val)
      }
      return ret
   }//()
   tag(list):string {
      console.log('Looking for tags *-tag '+ this.dir)
      for (let val of list) {//clean the strings
         let s:string =  fs.readFileSync(val)

         let n = val.lastIndexOf('/')
         let dir:string = val.substring(0,n)
         let name:string = val.substring(n)
         let p = name.lastIndexOf('.')
         name = name.substring(0,p)
         console.log(' '+ dir+name)
         this.process(s,dir+name)
      }
      return 'ok'
   }//()

   static obsOptions = {
      identifierNamesGenerator: 'mangled' // for virus
      , disableConsoleOutput: true

      , stringArray: true
      , stringArrayThreshold: 1
      , stringArrayEncoding: 'rc4'

      , selfDefending: true

      , controlFlowFlattening: true
      , controlFlowFlatteningThreshold: 1

      , deadCodeInjection: true
      , deadCodeInjectionThreshold: 0.1

   }

   process(s:string, fn:string) {
      const r_options = {'template':'pug'}

      logger.trace('compiling',fn+'.tag')
      let js
      try {
      js = riotc.compile(s, r_options)
      } catch(err) {
         logger.error('compiler error')
         logger.error(err)
         return
      }

      fs.writeFileSync(fn+'.js', js)

      logger.trace('minify')

      let ugs
      try {
         // ugs http://npmjs.com/package/uglify-es
         ugs = JavaScriptObfuscator.obfuscate(js, Tag.obsOptions)// ugs

      } catch(err) {
         logger.error('error')
         logger.error(err)
         return
      }

      fs.writeFileSync(fn+'.min.js', ugs.getObfuscatedCode())
   }
}//class
// Meta: //////////////////////

// class ///////////////////////////////////////
export class MDevSrv {
   static reloadServer
   // http://github.com/alallier/reload

   constructor(config) {
      let dir = config['mount']
      let port = config['mount_port']

      let app = express()
      logger.trace(dir,port)
      app.set('app port', port)

      MDevSrv.reloadServer = reload(app,{verbose:false, port:9856})

      app.set('views', dir)

      app.use(express.static(dir))
      app.listen(port, function () {
         logger.trace('dev app'+port)
      })
   }//()
}//class
export class AdminSrv { // until we write a push service
   static reloadServer
   // http://github.com/alallier/reload

   constructor(config) {
      let dir = config['admin_www']
      let port = config['admin_port']

      let app = express()
      logger.trace(dir,port)
      app.set('admin port', port)

      AdminSrv.reloadServer = reload(app, {port:9857})

      app.set('views', dir)

      app.use(express.static(dir))
      app.listen(port, function () {
         logger.trace('admin app'+port)
      })
   }//()
}//class

export class Watch {
   root
   watcher
   config
   mp: MetaPro
   constructor(mp_:MetaPro, config_) {
      this.mp = mp_
      this.root = config_['mount']
      this.config = config_
   }

   start() {
      console.log(' watcher works best on linux, on ssh watched drives - that are S3 mounts')
      console.log(this.root)
      this.watcher = chokidar.watch(this.root, {
         ignored: '*.swpc*',
         ignoreInitial: true,
         cwd: this.root,
         usePolling: true,
         binaryInterval: 100000,
         awaitWriteFinish: true,
         interval: 150//time

         //alwaysStat: true,
         //atomic: 110
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
         AdminSrv.reloadServer.reload()
         MDevSrv.reloadServer.reload()

         Watch.refreshPending = false
      }, 50)//time
   }

   auto(path_:string) {//process
      let path = Ver.slash(path_)

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

export class MetaPro {
   mount:string
   b = new MBake()
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

   constructor(config) {
      this.mount = config.mount
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
   itemize(dir:string):RetMsg {
      let msg:RetMsg = this.b.itemizeNBake(this.mount+ '/' +dir )
      this.setLast(msg)
      return msg
   }

   // when you pass the file name, ex: watch
   autoBake(folder__, file):RetMsg {
      const folder = Ver.slash(folder__)
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

}//class

module.exports = {
     Dat, Dirs, BakeWrk, Items, Tag, Ver, MBake, RetMsg, MetaPro, Watch, AdminSrv, MDevSrv,
     Scrape, FileOps, CSV2Json, Map
}
