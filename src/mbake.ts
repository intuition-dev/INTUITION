#!/usr/bin/env node

declare var require: any
declare var process: any
declare var console: Console
declare var __dirname: any

const AdmZip = require('adm-zip')
const commandLineArgs = require('command-line-args')

import { Ver, MBake, CSV2Json } from './lib/Base'

const clear = require("cli-clear")
clear()

// imports done /////////////////////////////////////////////
const cwd:string = process.cwd()

function version() {
   let b = new Ver()
   console.log()
   console.log('Your node is '+ process.version)
   console.log(' mbake CLI version: '+b.ver()) // tsc
   console.log('  from '+ __dirname)
   console.log('Usage: ')
   console.log('  mbake .')
   console.log('  or mbake any_dir to make(bake) a declarative low code app recursively')
   console.log('  To process Pug and RIOT _tag.pug tags: mbake -t . # . is path')
   console.log('  To process Pug and dat_i items to items.json: mbake -i . # where path is folder containing dat_i.yaml')
   console.log('  To process items.csv to items.json: mbake -j .')

   console.log()
   console.log(' ----------------------------------------------------------------')
   console.log(' Declarative examples:')
   console.log('  For an example dynamic web app with RO Database: mbake -r')
   console.log('  For a starter CRUD and auth: mbake -c')
   console.log('  For a starter SPA/Phonegap app: mbake -s')
   console.log('  For a starter admin/build/Meta cloud service: mbake -a')

   console.log('  For an example web site with navigation: mbake -n')
   console.log('  For a starter blog/linkBlog: mbake -b')

   console.log(' Full docs: http://www.metabake.org and notes on newer versions')
   console.log()

   //process.exit()
}

// args: //////////////////////////////////////////////////////////////////////////////////////////////////////
const optionDefinitions = [
   { name: 'mbake', defaultOption: true},
   { name: 'items', alias: 'i', type: Boolean },
   { name: 'tag', alias: 't', type: Boolean },
   { name: 'csv2Json', alias: 'j', type: Boolean },

   { name: 'crud', alias: 'c', type: Boolean },
   { name: 'RO', alias: 'r', type: Boolean },
   { name: 'blog', alias: 'b', type: Boolean },
   { name: 'admin', alias: 'a', type: Boolean },
   { name: 'spa', alias: 's', type: Boolean },
   { name: 'navSite', alias: 'n', type: Boolean }

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
function unzipC() {
   let src:string =__dirname+ '/CRUDA.zip'
   let zip = new AdmZip(src)
   zip.extractAllTo(cwd , /*overwrite*/true)
   console.log('Extracted a starter web app with CRUD and auth to ./CRUDA')
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
function unzipN() {
   let src:string =__dirname+ '/navSite.zip'
   let zip = new AdmZip(src)
   zip.extractAllTo(cwd , /*overwrite*/true)
   console.log('Extracted an example web site with navigation to ./navSite')
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
else if(argsParsed.navSite)
   unzipN()
else if(argsParsed.crud)
   unzipC()
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
