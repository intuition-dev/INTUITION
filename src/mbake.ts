#!/usr/bin/env node
// License} LGPL 2.1  (c) Metabake.net | Cekvenich

import AdmZip = require('adm-zip')
import commandLineArgs = require('command-line-args')

import { Ver, MBake, CSV2Json, Map ,Dirs} from './lib/Base'
import clear = require("cli-clear")

clear()

// imports done /////////////////////////////////////////////
const cwd:string = process.cwd()

function version() {
   let b = new Ver()
   console.log()
   console.log('╔╗──╔╗╔══╗─╔══╗╔╗╔══╗╔═══╗')
   console.log('║║──║║║╔╗║─║╔╗║║║║╔═╝║╔══╝')
   console.log('║╚╗╔╝║║╚╝╚╗║╚╝║║╚╝║──║╚══╗')
   console.log('║╔╗╔╗║║╔═╗║║╔╗║║╔╗║──║╔══╝')
   console.log('║║╚╝║║║╚═╝║║║║║║║║╚═╗║╚══╗')
   console.log('╚╝──╚╝╚═══╝╚╝╚╝╚╝╚══╝╚═══╝')
   console.log('mbake CLI version: '+b.ver()) // tsc
   console.log()
   console.log('Usage: ')
   console.log('  mbake .')
   console.log('  or process any_dir to make(bake) a declarative low-code app recursively')
   console.log('  To process Pug and RIOT *-tag.pug tags: mbake -t . # . is path')
   console.log('  To process Pug and dat_i items to items.json: mbake -i . # where path is folder containing dat_i.yaml')
   console.log('  To map map.yaml to menu.json, sitemap.xml and FTS.idx: mbake -m .')
   console.log('  To process list.csv to list.json: mbake -j .')
   console.log(' ----------------------------------------------------------------')
   console.log()
   console.log(' Code examples:')
   // w is reserved for watch
   console.log('  For a starter website: mbake -s')
   console.log('  For an example dynamic web app CRUD: mbake -c')

   console.log('  For a starter blog|items: mbake -b')

   console.log('  For an example admin cloud service: mbake -a')
   console.log('  For a starter dash web app: mbake -d')
   console.log('  For example slides markdown: mbake -l')

   console.log(' Full docs: https://www.Metabake.net' )
   console.log('  mbakeW has more options')
   console.log()

   process.exit()
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
   { name: 'slides', alias: 'l', type: Boolean },

   { name: 'auto', alias: 'a', type: Boolean },
   { name: 'website',  alias: 's', type: Boolean },
   { name: 'crud', alias: 'c', type: Boolean },

]
const argsParsed = commandLineArgs(optionDefinitions)
let arg:string = argsParsed.mbake

console.log()

// unzip: ////////////////////////////////////////////////////////////////////////////////////////////
function unzipA() {
   let src:string =__dirname+ '/admin.zip'
   let zip = new AdmZip(src)
   zip.extractAllTo(cwd , /*overwrite*/true)
   console.log('Extracted a starter admin/build/Meta cloud service to ./autoEG')
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
function unzipL() {
   let src:string =__dirname+ '/slidesEx.zip'
   let zip = new AdmZip(src)
   zip.extractAllTo(cwd , /*overwrite*/true)
   console.log('Extracted example of markdown slides to ./slidesEx')
   process.exit()
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
else if(argsParsed.map)
   map(arg)
else if(argsParsed.auto)
   unzipA()
else if(argsParsed.blog)
   unzipB()
else if(argsParsed.dash)
   unzipD()
else if(argsParsed.crud)
   unzipC()
else if(argsParsed.website)
   unzipS()
else if(argsParsed.slides)
   unzipL()
else if(!arg)
   version()
else
   bake(arg)
