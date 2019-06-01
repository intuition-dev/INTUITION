
import FileHound = require('filehound')

const logger = require('tracer').console()

import fs = require('fs-extra')

import csv2JsonV2 = require('csvtojson')


import yaml = require('js-yaml')

import path = require("path")


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


module.exports = {
  Dat, Dirs
}

