// All rights reserved by Cekvenich|INTUITION.DEV) |  Cekvenich, licensed under LGPL 3.0


import { TerseB } from "terse-b/terse-b"

const log:any = new TerseB("file ops b")

import fs = require('fs-extra')

import yaml = require('js-yaml')
import FileHound = require('filehound')

const {Dirs} = require('agentg/lib/FileOpsExtra')

export class Dat {
   props: any
   _path: string
   constructor(path__: string) {
      let path_ = Dirs.slash(path__)
      this._path = path_

      let y
      if (fs.existsSync(path_ + '/dat.yaml'))
         y = yaml.load(fs.readFileSync(path_ + '/dat.yaml'))
      if (!y) y = {}
      this.props = y

      let keys = Object.keys(y)
      if (keys.includes('include')) this._addData()
   }
   
   write():Promise<string> {
      return new Promise((resolve, reject) => {
         try {
            let y = yaml.dump(this.props, {
               skipInvalid: true,
               noRefs: true,
               noCompatMode: true,
               condenseFlow: true
            })
            let p = this._path + '/dat.yaml'
            fs.writeFileSync(p, y)
            resolve('OK')
         } catch (err) { log.warn(err); reject(err) }
      })//()
   }

   set(key, val) { // ex: 'title', 'My First Blog'
      this.props[key] = val
   }
   _addData() {
      let jn = this.props.include
      let fn = this._path + '/' + jn
      let jso = fs.readFileSync(fn)
      Object.assign(this.props, JSON.parse(jso.toString())) // merge
   }

   getAll(): Object {
      return this.props
   }//()
}//class

export class FileOps {
   root
   constructor(root_) {
      this.root = Dirs.slash(root_)
   }

   /** returns # of files with the name, used to archive ver */
   count(fileAndExt): number {

      const files = FileHound.create()
         .paths(this.root)
         .depth(0)
         .match(fileAndExt + '*')
         .findSync()

      return files.length
   }

   clone(src, dest): Promise<string> {
      return new Promise((resolve, reject) => {

         fs.copySync(this.root + src, this.root + dest)

         let p = this.root + dest
         const d = new Dat(p)
         d.write()
         log.info('copy!')
         resolve('OK')
      })
   }//()

   write(destFile, txt) {
      log.info(this.root + destFile)
      fs.writeFileSync(this.root + destFile, txt)
   }

   read(file): string {
      return fs.readFileSync(this.root + file).toString()
   }

   remove(path) {
      let dir_path = this.root + path
      log.info('remove:' + dir_path)
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


export class FileMethods {

   // get list of directories
   getDirs(mountPath:string) {
       let dirs = new Dirs(mountPath);
       let dirsToIgnore = ['.', '..'];
       return dirs.getShort()
           .map(el => el.replace(/^\/+/g, '')) //?
           .filter(el => !dirsToIgnore.includes(el));
   }

   // get files in directory
   getFiles(mountPath:string, item:string) { 

       let dirs = new Dirs(mountPath);
       let result = dirs.getInDir(item);
       
       if (item === '/') { // if root directory, remove all dirs from output, leave only files:
           return result.filter(file => file.indexOf('/') === -1 && !fs.lstatSync(mountPath + '/' + file).isDirectory());
       } else {
           return result;
       }
   }
}

