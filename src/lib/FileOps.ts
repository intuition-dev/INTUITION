
import { Ver } from './Base'

import FileHound = require('filehound')
const execa = require('execa')

const logger = require('tracer').console()

import fs = require('fs-extra')

import csv2JsonV2 = require('csvtojson')

import download = require('download')

import yaml = require('js-yaml')

import path = require("path")

import { firestoreExport, firestoreImport } from 'node-firestore-import-export';
import * as firebase from 'firebase-admin';

export class DownloadFrag {
   constructor(dir, ops: boolean) {
      console.log('Extracting to', dir)
      if (!ops) download('https://unpkg.com/mtool-belt@1.3.35/template/headFrag.pug').then(data => {
         fs.writeFileSync(dir + '/headFrag.pug', data)
      })
      if (ops) {
         console.log('Ops')
         download('https://unpkg.com/mtool-belt@1.3.35/template/ops.pug').then(data => {
            fs.writeFileSync(dir + '/ops.pug', data)
         })
         download('https://unpkg.com/mtool-belt@1.3.35/template/ops.js').then(data => {
            fs.writeFileSync(dir + '/ops.js', data)
         })
      }//fi
   }//()
}


export class YamlConfig {
   constructor(fn) {
      let cfg = yaml.load(fs.readFileSync(fn))
      console.info(cfg)
      return cfg
   }//()
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
      return new Promise( (resolve, reject) => {
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




// //////////////////////////////////////////////////////////////////
export class ExportFS {
   args: string
   serviceAccountConfig: string
   collectionRef: any
   name: string
   config: string
   constructor(config) {
      this.args = config.split(':')
      this.serviceAccountConfig = this.args[0]
      this.name = this.args[1]
      this.config = require(this.serviceAccountConfig + '.json');

      firebase.initializeApp({
         credential: firebase.credential.cert(this.config),
      });

      this.collectionRef = firebase.firestore()

   }//()


   export() {
      let _this = this
      firestoreExport(this.collectionRef)
         .then(data => {
            console.log(data)
            fs.writeJsonSync(_this.name + '.json', data, 'utf8')
         });
   }
}

export class ImportFS {
   args: string
   config: string
   collectionRef: any
   pathToData: string
   serviceAccountConfig: string
   pathToImportedFile: string
   constructor(config) {
      this.args = config.split(':')
      this.serviceAccountConfig = this.args[0]
      this.pathToImportedFile = this.args[1]
      this.config = require(this.serviceAccountConfig + '.json');


      firebase.initializeApp({
         credential: firebase.credential.cert(this.config),
      });

      this.collectionRef = firebase.firestore()

   }//()

   import() {
      let _this = this
      fs.readJson(this.pathToImportedFile + '.json', function (err, result) {

         firestoreImport(result, _this.collectionRef)
            .then(() => {
               console.log('Data was imported.')
            });
      })
   }
}

module.exports = {
   FileOps, CSV2Json, GitDown,  ExportFS, ImportFS, DownloadFrag, Dat, Dirs,  YamlConfig
}

