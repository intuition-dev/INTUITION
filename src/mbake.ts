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

//new Map('/Users/uptim/Documents/GitHub/examples-plugins/navSiteS').gen()

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
   console.log('  To process list.csv to list.json: mbake -j .')

   console.log()
   console.log(' ----------------------------------------------------------------')
   console.log(' Declarative low code examples:')
   console.log('  For an example dynamic web app with RO Database: mbake -r')
   console.log('  For a starter blog/linkBlog: mbake -b')
   console.log('  For a starter Dash web app: mbake -d')
   console.log('  For a starter SPA/Phonegap app: mbake -s')
   console.log('  For a starter admin/build/Meta cloud service: mbake -a')

   console.log(' Full docs: http://www.metabake.org , more examples and notes on newer versions')
   console.log()

   //process.exit()
}

// args: //////////////////////////////////////////////////////////////////////////////////////////////////////
const optionDefinitions = [
   { name: 'mbake', defaultOption: true},
   { name: 'items', alias: 'i', type: Boolean },
   { name: 'tag', alias: 't', type: Boolean },
   { name: 'csv2Json', alias: 'j', type: Boolean },

   { name: 'RO', alias: 'r', type: Boolean },
   { name: 'blog', alias: 'b', type: Boolean },
   { name: 'dash', alias: 'd', type: Boolean },
   { name: 'spa', alias: 's', type: Boolean },
   { name: 'admin', alias: 'a', type: Boolean },

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
function unzipS() {
   let src:string =__dirname+ '/SPA.zip'
   let zip = new AdmZip(src)
   zip.extractAllTo(cwd , /*overwrite*/true)
   console.log('Extracted a starter SPA/Phonegap app to ./SPA')
   process.exit()
}
function unzipR() {
   let src:string =__dirname+ '/fireRO.zip'
   let zip = new AdmZip(src)
   zip.extractAllTo(cwd , /*overwrite*/true)
   console.log('Extracted an example dynamic app with RO DB ./fireRO')
   process.exit()
}
function unzipB() {
   let src:string =__dirname+ '/linkBlog.zip'
   let zip = new AdmZip(src)
   zip.extractAllTo(cwd , /*overwrite*/true)
   console.log('Extracted a starter blog app to ./linkBlog')
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
else if(argsParsed.admin)
   unzipA()
else if(argsParsed.RO)
   unzipR()
else if(argsParsed.blog)
   unzipB()
else if(argsParsed.spa)
   unzipS()
else if(!arg)
   version()
else
   bake(arg)
