#!/usr/bin/env node
// All rights reserved by Metabake.org | Cekvenich, licensed under AGPL 3.0

import AdmZip = require('adm-zip')
import commandLineArgs = require('command-line-args')

import { Ver, Dirs, MBake, DownloadFrag } from './lib/Base'
import { Wa, CSV2Json, Map } from './lib/Wa'
import { Resize, GitDown } from './lib/Sa'

// imports done /////////////////////////////////////////////
const cwd: string = process.cwd()

function version () {
   let b = new Ver();
   console.info('mbakeX CLI version: ' + b.ver()) // tsc
}

function help () {
   let b = new Ver()
   console.info()
   console.info('mbakeX CLI version: ' + b.ver()) // tsc
   console.info('  your node version is ' + process.version)
   console.info('  from ' + __dirname)
   console.info()
   console.info('Usage: ')
   console.info('  For local(non-cloud) watcher and server on port:            mbakeX -w .')
   console.info('     (default 8090, default reload 9856)')
   console.info('    -p, --port to specify port for watcher:                   mbakeX -w . -p 8091 -r 9857')
   console.info('     (must be used with -r)')
   console.info('    -r, --reload-port to specify port for live reload :       mbakeX -w . --port=8091 --reload-port=9857')
   console.info()

   console.info('  To process Pug and RIOT *-comp.pug components:              mbakeX -c .')
   console.info('    -c also does regular mbake of Pug, not just comps.')
   console.info('  To bake with dev. ENV flag(1) in prod(default is 0):        mbakeX --bakeD .')
   console.info('  To bake with staging ENV flag(2) in prod:                   mbakeX --bakeS .')
   console.info('  To bake with production ENV flag(3) in prod:                mbakeX --bakeP .')

   console.info()
   console.info('  Download fragment to setup the app devOps:                  mbake --devOps .')

   console.info('  To map map.yaml to menu.json, sitemap.xml and FTS.idx:      mbakeX -m .')
   console.info('  Compress 3200 or larger .jpg images to 2 sizes:             mbakeX -i .')
   console.info('  To process list.csv to list.json:                           mbakeX -l .')
   console.info('  To download branch from git, in folder with gitdown.yaml:   mbakeX --gitDown GIT-PSWD')
   console.info('     passing the git password of gitdown user')
   console.info('  To recursively remove source files:                         mbakeX --prod .')

   console.info('    Note: . is current directory, or use any path instead of .')
   console.info(' -------------------------------------------------------------')
   console.info()
   console.info(' Starters:')
   console.info('  For a starter dash web-app:                                 mbakeX -d')

   console.info('  For example slides markdown:                                mbakeX -k')

   console.info('  For a Electron(pre-PhoneGap) app:                           mbakeX -e')
   console.info('  For a starter hybrid Phonegap app:                          mbakeX -o')
   console.info('  For an example Ad:                                          mbakeX -a')

   //TODO: check latest version via open of browser to npm
   console.info()

   process.exit()
}

// args: //////////////////////////////////////////////////////////////////////////////////////////////////////
const optionDefinitions = [
   { name: 'mbakeX', defaultOption: true },

   { name: 'help', alias: 'h', type: Boolean },
   { name: 'version', alias: 'v', type: Boolean },

   { name: 'watcher', alias: 'w', type: Boolean },

   { name: 'port', alias: 'p', type: String },
   { name: 'reload-port', alias: 'r', type: String },

   { name: 'prod', type: Boolean },
   { name: 'comps', alias: 'c', type: Boolean },

   { name: 'bakeP', type: Boolean },
   { name: 'bakeS', type: Boolean },
   { name: 'bakeD', type: Boolean },

   { name: 'devOps', type: Boolean },
   { name: 'gitDown', type: Boolean },

   { name: 'map', alias: 'm', type: Boolean },
   { name: 'img', alias: 'i', type: Boolean },
   { name: 'csv2Json', alias: 'l', type: Boolean },
   
   { name: 'dash', alias: 'd', type: Boolean },
   { name: 'slides', alias: 'k', type: Boolean },
   { name: 'elect', alias: 'e', type: Boolean },
   { name: 'phonegap', alias: 'o', type: Boolean },
   { name: 'ad', alias: 'a', type: Boolean },
]

const argsParsed = commandLineArgs(optionDefinitions)
let arg: string = argsParsed.mbakeX
console.info()

// ///////////////////////////////////////////////////////////////////////////////////////////
function git(arg) {
   let gg = new GitDown(arg)
   gg.process()
}//()

function frag(arg) {
   new DownloadFrag(arg, true)
}
// unzip: ////////////////////////////////////////////////////////////////////////////////////////////
function unzipG () {
   let src: string = __dirname + '/PGap.zip'
   let zip = new AdmZip(src)
   zip.extractAllTo(cwd, /*overwrite*/true)
   console.info('Extracted a starter Phonegap app to ./PG')
   process.exit()
}
function unzipE () {
   let src: string = __dirname + '/elect.zip'
   let zip = new AdmZip(src)
   zip.extractAllTo(cwd, /*overwrite*/true)
   console.info('Extracted a starter Electron app to ./elect')
   process.exit()
}

function unzipD () {
   let src: string = __dirname + '/ad.zip'
   let zip = new AdmZip(src)
   zip.extractAllTo(cwd, /*overwrite*/true)
   console.info('Extracted an example ad  ./ad')
   process.exit()
}

function unzipL () {
   let src: string = __dirname + '/slidesEx.zip'
   let zip = new AdmZip(src)
   zip.extractAllTo(cwd, /*overwrite*/true)
   console.info('Extracted example of markdown slides to ./slidesEx')
   process.exit()
}
function unzipH () {
   let src: string = __dirname + '/dash.zip'
   let zip = new AdmZip(src)
   zip.extractAllTo(cwd, /*overwrite*/true)
   console.info('Extracted an starter Dash web app to ./dash')
   process.exit()
}

//  ////////////////////////////////////////////////////////////////////////////////////////////////
function csv2Json (arg) {
   new CSV2Json(arg).convert()
}

function map (arg) {
   new Map(arg).gen()
}

function img (arg) {
   new Resize().do(arg)
}

function comps (arg) {
   let pro:Promise<string> = new MBake().compsNBake(arg, 0)
   pro.then(function(val){
      console.log(val)
      process.exit()
   })
}

function prod (arg) {
   new MBake().clearToProd(arg)
   process.exit()
}
function bakeP(arg) {
   let pro:Promise<string> = new MBake().bake(arg, 3)
   pro.then(function(val){
      console.log(val)
      process.exit()
   })
}
function bakeS(arg) {
   let pro:Promise<string> = new MBake().bake(arg, 2)
   pro.then(function(val){
      console.log(val)
      process.exit()
   })
}
function bakeD(arg) {
   let pro:Promise<string> = new MBake().bake(arg, 1)
   pro.then(function(val){
      console.log(val)
      process.exit()
   })
}

// get folder to be processed: ///////////////////////////////////////////////////////////////////////////////////////////////////////
if (arg) {
   arg = Dirs.slash(arg)
   if (arg.startsWith('/')) {
      //do nothing, full path is arg
   } else if (arg.startsWith('..')) { // few  cases to test
      arg = arg.substring(2)
      let d = cwd
      d = Dirs.slash(d)
      // find offset
      let n = d.lastIndexOf('/')
      d = d.substring(0, n)
      arg = d + arg
   } else { // just plain, dir passed
      arg = cwd + '/' + arg
   }
}

// start: /////////////////////////////////////////////////////////////////////////////////////
if (argsParsed.comps) {
   try {
      comps(arg)
   } catch (err) {
      console.info(err)
   }
} else
if (argsParsed.elect)
   unzipE()
else if (argsParsed.phonegap)
   unzipG()
else if (argsParsed.ad)
   unzipD()
else if (argsParsed.csv2Json)
   csv2Json(arg)
else if (argsParsed.watcher) {
   Wa.watch(arg, argsParsed.port, argsParsed['reload-port']);
}
else if (argsParsed.img) {
   img(arg)
}
else if (argsParsed.dash)
   unzipH()
else if (argsParsed.map)
   map(arg)
else if (argsParsed.slides)
   unzipL()
else if (argsParsed.prod)
   prod(arg)
else if (argsParsed.bakeP)
   bakeP(arg)
else if (argsParsed.bakeS)
   bakeS(arg)
else if (argsParsed.bakeD)
   bakeD(arg)
else if (argsParsed.devOps)
   frag(arg)
else if (argsParsed.gitDown)
   git(arg)
else if (argsParsed.version)
   version()
else if (argsParsed.help)
   help()
else if (!arg)
   help()
