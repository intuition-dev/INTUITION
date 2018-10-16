#!/usr/bin/env node

declare var require: any
declare var process: any
declare var console: Console
declare var __dirname: any

const AdmZip = require('adm-zip')
const commandLineArgs = require('command-line-args')

import { Ver, MBake, CSV2Json, Map } from './lib/Base'

const clear = require("cli-clear")
clear()

//process.exit()

// imports done /////////////////////////////////////////////
const cwd:string = process.cwd()

function version() {
   let b = new Ver()
   console.log()
   console.log('mbake CLI version: '+b.ver()) // tsc
   console.log('  your node version is '+ process.version)
   console.log('  from '+ __dirname)
   console.log('Usage: ')
   console.log('  mbake .')
   console.log('  or process any_dir to make(bake) a declarative low code app recursively')
   console.log('  To process Pug and RIOT *-tag.pug tags: mbake -t . # . is path')
   console.log('  To process Pug and dat_i items to items.json: mbake -i . # where path is folder containing dat_i.yaml')
   console.log('  To map map.yaml to menu.json, sitemap.xml and FTS.idx: mbake -m .')
   console.log('  To process list.csv to list.json: mbake -j .')
   console.log('  For local(non-cloud) watcher: mbake -w')

   console.log()
   console.log(' ----------------------------------------------------------------')
   console.log(' Code examples:')
   console.log('  For a starter website: mbake -s')
   console.log('  For an example dynamic web app CRUD: mbake -c')

   console.log('  For a starter blog/linkBlog: mbake -b')
   // w is reserved for watch
   console.log('  For a starter Dash web app: mbake -d')

   console.log('  For a training Electron(pre-PhoneGap) app: mbake -e')
   console.log('  For a hybrid Phonegap app: mbake -p')
   console.log('  For an example auto admin/build/Meta cloud service: mbake -a')

   console.log(' Full docs: http://www.Metabake.org , more examples and notes on newer versions')
   console.log()

   //process.exit()
}

// args: //////////////////////////////////////////////////////////////////////////////////////////////////////
const optionDefinitions = [
   { name: 'mbake', defaultOption: true},
   { name: 'items', alias: 'i', type: Boolean },
   { name: 'tag', alias: 't', type: Boolean },
   { name: 'map', alias: 'm', type: Boolean },
   { name: 'csv2Json', alias: 'j', type: Boolean },

   { name: 'blog', alias: 'b', type: Boolean },
   { name: 'dash', alias: 'd', type: Boolean },
   { name: 'phonegap',  alias: 'p', type: Boolean },
   { name: 'elect',  alias: 'e', type: Boolean },
   { name: 'auto', alias: 'a', type: Boolean },
   { name: 'website',  alias: 's', type: Boolean },
   { name: 'crud', alias: 'c', type: Boolean },

   { name: 'watcher', alias: 'w', type: Boolean }

]
const argsParsed = commandLineArgs(optionDefinitions)
let arg:string = argsParsed.mbake

console.log()

// unzip: ////////////////////////////////////////////////////////////////////////////////////////////
function unzipA() {
   let src:string =__dirname+ '/autoEG.zip'
   let zip = new AdmZip(src)
   zip.extractAllTo(cwd , /*overwrite*/true)
   console.log('Extracted a starter admin/build/Meta cloud service to ./autoEG')
   process.exit()
}

function unzipG() {
   let src:string =__dirname+ '/PGap.zip'
   let zip = new AdmZip(src)
   zip.extractAllTo(cwd , /*overwrite*/true)
   console.log('Extracted a starter Phonegap app to ./PG')
   process.exit()
}
function unzipE() {
   let src:string =__dirname+ '/elect.zip'
   let zip = new AdmZip(src)
   zip.extractAllTo(cwd , /*overwrite*/true)
   console.log('Extracted a starter Electron app to ./elect')
   process.exit()
}

function unzipC() {
   let src:string =__dirname+ '/crud.zip'
   let zip = new AdmZip(src)
   zip.extractAllTo(cwd , /*overwrite*/true)
   console.log('Extracted an example auth/crud to ./crud')
   process.exit()
}
function unzipS() {
   let src:string =__dirname+ '/website.zip'
   let zip = new AdmZip(src)
   zip.extractAllTo(cwd , /*overwrite*/true)
   console.log('Extracted a starter website to ./website')
   process.exit()
}
function unzipB() {
   let src:string =__dirname+ '/blog.zip'
   let zip = new AdmZip(src)
   zip.extractAllTo(cwd , /*overwrite*/true)
   console.log('Extracted a starter blog app to ./blog')
   process.exit()
}
function unzipD() {
   let src:string =__dirname+ '/dash.zip'
   let zip = new AdmZip(src)
   zip.extractAllTo(cwd , /*overwrite*/true)
   console.log('Extracted an starter Dash web app to ./dash')
   process.exit()
}

// get folder to be processed: ///////////////////////////////////////////////////////////////////////////////////////////////////////
if(arg) {
   arg = Ver.slash(arg)
   if(arg.startsWith('/'))  {
      //do nothing, full path is arg
   } else if (arg.startsWith('..')) { // few  cases to test
      arg = arg.substring(2)
      let d = cwd
      d = Ver.slash(d)
      // find offset
      let n = d.lastIndexOf('/')
      d = d.substring(0,n)
      arg = d + arg
   } else if (arg.startsWith('.')) {//cur

      arg = cwd //test ./dd

   } else  { // just plain, dir passed
      arg = cwd + '/' + arg
   }
}

// CSV2Json: ////////////////////////////////////////////////////////////////////////////////////////////////
function csv2Json(arg) {
   new CSV2Json(arg).convert()
}

function map(arg) {
   new Map(arg).gen()
}

// pug: ////////////////////////////////////////////////////////////////////////////////////////////////
function bake(arg) {
   new MBake().bake(arg)
   process.exit()
}

// itemize : /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function itemize(arg) {
   new MBake().itemizeNBake(arg)
   process.exit()
}

// tag:  ///////////////////////////////////////////////////////////////////////////////////////////////
function tag(arg) {
   new MBake().tag(arg)
}
// watch: /////////////////////////////////////////////////////////////////////////////////////////////////#endregion
function watch() {
   const path = require('path')
   const appDir = path.dirname(require.main.filename)
   const electron = require('electron' )
   const proc = require('child_process')
   console.log(appDir)

   const fp = appDir+'/ewApp/main.js'

   /*const options = {
      stdio: [ 'pipe', 'pipe', 'pipe', 'ipc' ]
      , windowsHide: true
    }*/
   const child = proc.spawn(electron, [fp, appDir] )
   child.stdout.on('data', function(data) { // log of child to show
      console.log(data.toString()); 
   })
   child.on('exit',onWaExit) 
}// watch
function onWaExit(){
   console.log('Watcher child exited')
}

// start: /////////////////////////////////////////////////////////////////////////////////////
if(argsParsed.tag) {
   try {
      tag(arg)
      bake(arg)
   } catch(err) {
      console.log(err)
   }
}
else if(argsParsed.items)
   itemize(arg)
else if(argsParsed.csv2Json)
   csv2Json(arg)
else if(argsParsed.map)
   map(arg)
else if(argsParsed.auto)
   unzipA()
else if(argsParsed.blog)
   unzipB()
else if(argsParsed.dash)
   unzipD()
else if(argsParsed.elect)
   unzipE()
else if(argsParsed.phonegap)
   unzipG()
else if(argsParsed.crud)
   unzipC()
else if(argsParsed.website)
   unzipS()
else if(argsParsed.watcher)
   watch()
else if(!arg)
   version()
else
   bake(arg)
