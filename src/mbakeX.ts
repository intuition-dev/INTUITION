#!/usr/bin/env node
// All rights reserved by mbake.org | Cekvenich, licensed under LGPL 3.0

import AdmZip = require('adm-zip')
import commandLineArgs = require('command-line-args')

import { Ver, Dirs, MBake } from './lib/Base'
import { Wa, CSV2Json, Map } from './lib/Wa'
import { Resize, SFTP } from './lib/Sa'

// imports done /////////////////////////////////////////////
const cwd: string = process.cwd()

function version () {
   let b = new Ver()
   console.info()
   console.info('mbakeX CLI version: ' + b.ver()) // tsc
   console.info('  your node version is ' + process.version)
   console.info('  from ' + __dirname)
   console.info()
   console.info('Usage: ')
   console.info('  For local(non-cloud) watcher and server on port 8090 :      mbakeX -w .')

   console.info('  To process Pug and RIOT *-comp.pug tags/components:         mbakeX -c .')
   console.info('     also does regular mbake of Pug')

   console.info('  To map map.yaml to menu.json, sitemap.xml and FTS.idx:      mbakeX -p .  #')
   console.info('  Compress .jpg images with a default compression level:      mbakeX -i .  #')
   console.info('  To process list.csv to list.json:                           mbakeX -l .  #')
   console.info('  SFTP w/o source code(eg: .js, SASS, pug) - avoid, instead mount: mbakeX -F ./sftp_site_sec.yaml')

   console.info('     . anywhere is current directory, or use any path instead of .')
   console.info(' -------------------------------------------------------------')
   console.info()
   console.info(' Starters:')
   console.info('  For a starter baseCMS :                                     mbakeX -m')
   console.info('  For a starter dash web-app:                                 mbakeX -d')

   console.info('  For example slides markdown:                                mbakeX -k')

   console.info('  For a Electron(pre-PhoneGap) app:                           mbakeX -e')
   console.info('  For a starter hybrid Phonegap app:                          mbakeX -o')
   console.info('  For an example Ad:                                          mbakeX -a')

   console.info()

   console.info(' Full docs: http://docs.mbake.org')
   console.info()

   process.exit()
}

// args: //////////////////////////////////////////////////////////////////////////////////////////////////////
const optionDefinitions = [
   { name: 'mbakeX', defaultOption: true },

   { name: 'watcher', alias: 'w', type: Boolean },
   { name: 'comps', alias: 'c', type: Boolean },
   { name: 'dash', alias: 'd', type: Boolean },

   { name: 'map', alias: 'p', type: Boolean },
   { name: 'img', alias: 'i', type: Boolean },

   { name: 'SFTP', alias: 'F', type: Boolean },
   { name: 'csv2Json', alias: 'l', type: Boolean },

   { name: 'CMS', alias: 'm', type: Boolean },
   { name: 'phonegap', alias: 'o', type: Boolean },
   { name: 'elect', alias: 'e', type: Boolean },
   { name: 'ad', alias: 'a', type: Boolean },
   { name: 'slides', alias: 'k', type: Boolean },
]

const argsParsed = commandLineArgs(optionDefinitions)
let arg: string = argsParsed.mbakeX

// unzip: ////////////////////////////////////////////////////////////////////////////////////////////
function unzipA () {
   let src: string = __dirname + '/CMS.zip'
   let zip = new AdmZip(src)
   zip.extractAllTo(cwd, /*overwrite*/true)
   console.info('Extracted a starter CMS in this folder')
   process.exit()
}

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

function sft (arg) {
   new SFTP(arg)
}
function comps (arg) {
   new MBake().comps(arg)
}
function bake (arg) {
   new MBake().bake(arg)
   process.exit()
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
      bake(arg)
   } catch (err) {
      console.info(err)
   }
} else
if (argsParsed.elect)
   unzipE()
else if (argsParsed.phonegap)
   unzipG()
else if (argsParsed.CMS)
   unzipA()
else if (argsParsed.ad)
   unzipD()
else if (argsParsed.csv2Json)
   csv2Json(arg)
else if (argsParsed.watcher) {
   Wa.watch(arg)
}
else if (argsParsed.img) {
   img(arg)
}
else if (argsParsed.SFTP) {
   sft(arg)
}
else if (argsParsed.dash)
   unzipH()
else if (argsParsed.map)
   map(arg)
else if (argsParsed.slides)
   unzipL()
else if (!arg)
   version()
