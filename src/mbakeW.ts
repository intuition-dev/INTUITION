#!/usr/bin/env node
// License} LGPL 2.1  (c) Metabake.net | Cekvenich

import AdmZip = require('adm-zip')
import commandLineArgs = require('command-line-args')

import { Ver,  Dirs} from './lib/Base'
import { Wa, CSV2Json, Map} from './lib/Wa'
import { Sas } from './lib/Sa'


// imports done /////////////////////////////////////////////
const cwd:string = process.cwd()

function version() {
   let b = new Ver()
   console.log()
   console.log('mbakeW CLI version: '+b.ver()) // tsc
   console.log('  your node version is '+ process.version)
   console.log('  from '+ __dirname)
   console.log()
   console.log('Usage: ')
   console.log('  For local(non-cloud) GUI watcher:                        mbakeW -g')
   console.log('  Process SASS/SCSS file into css:                         mbakeW -c path/filename.ext')
   console.log('  To process list.csv to list.json:                        mbake -j .')
   console.log('  To map map.yaml to menu.json, sitemap.xml and FTS.idx:   mbake -m . # or path')
   console.log(' ----------------------------------------------------------------')
   console.log()
   console.log(' Code examples:')
   console.log('  For a Electron(pre-PhoneGap) app:                        mbake -e')
   console.log('  For a starter hybrid Phonegap app:                       mbake -p')
   console.log('  For an example ad:                                       mbake -d')

   console.log()
   console.log(' Full docs: https://www.Metabake.net' )
   console.log()

   process.exit()
}

// args: //////////////////////////////////////////////////////////////////////////////////////////////////////
const optionDefinitions = [
   { name: 'mbakeW', defaultOption: true},

   { name: 'csv2Json', alias: 'j', type: Boolean },
   { name: 'gwatcher',  alias: 'g', type: Boolean },
   { name: 'css',       alias: 'c', type: Boolean },
   { name: 'map',    alias: 'm', type: Boolean },

   { name: 'phonegap',  alias: 'p', type: Boolean },
   { name: 'elect',     alias: 'e', type: Boolean },
   { name: 'ad',        alias: 'd', type: Boolean }
]

const argsParsed = commandLineArgs(optionDefinitions)
let arg:string = argsParsed.mbakeW



// unzip: ////////////////////////////////////////////////////////////////////////////////////////////
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

function unzipD() {
   let src:string =__dirname+ '/ad.zip'
   let zip = new AdmZip(src)
   zip.extractAllTo(cwd , /*overwrite*/true)
   console.log('Extracted an example ad  ./ad')
   process.exit()
}

function css(arg) {
   new Sas().trans(arg)
}
// CSV2Json: ////////////////////////////////////////////////////////////////////////////////////////////////
function csv2Json(arg) {
   new CSV2Json(arg).convert()
}

function map(arg) {
   new Map(arg).gen()
}

// get folder to be processed: ///////////////////////////////////////////////////////////////////////////////////////////////////////
if(arg) {
   arg = Dirs.slash(arg)
   if(arg.startsWith('/'))  {
      //do nothing, full path is arg
   } else if (arg.startsWith('..')) { // few  cases to test
      arg = arg.substring(2)
      let d = cwd
      d = Dirs.slash(d)
      // find offset
      let n = d.lastIndexOf('/')
      d = d.substring(0,n)
      arg = d + arg
    } else  { // just plain, dir passed
      arg = cwd + '/' + arg
   }
}

// start: /////////////////////////////////////////////////////////////////////////////////////
if(argsParsed.elect)
   unzipE()
else if(argsParsed.phonegap)
   unzipG()
else if(argsParsed.ad)
   unzipD()
else if(argsParsed.csv2Json)
   csv2Json(arg)
else if(argsParsed.gwatcher) {
   Wa.gwatch()
}
else if(argsParsed.map)
   map(arg)
else if(argsParsed.css) {
   css(arg)
} else if(!arg)
   version()
