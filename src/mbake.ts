#!/usr/bin/env node
// All rights reserved by Metabake.org | Cekvenich, licensed under LGPL 3.0

import AdmZip = require('adm-zip')
import commandLineArgs = require('command-line-args')

import { Ver, MBake, Dirs } from './lib/Base'
import clear = require("cli-clear")

import { MinJS,  Sas } from './lib/Sa'

clear()

// imports done /////////////////////////////////////////////
const cwd: string = process.cwd()


function version () {
   let b = new Ver();
   console.info('mbake CLI version: ' + b.ver()) // tsc
}

function help () {
   let b = new Ver()
   console.info();
   console.info('mbake CLI version: ' + b.ver())
   console.info()
   console.info('Usage:')
   console.info('  To process any_dir Pug to html recursively:                 mbake .')

   console.info('  Process SASS/SCSS file into css, requires assets.yaml:      mbake -s .')
   console.info('     or path that has assets.yaml, or any sub-folder under /assets')

   console.info('  Process .ts and .js file to .min:                           mbake -t .')
   
   console.info('  To process Pug and dat_i items to items.json:               mbake -i .')
   console.info('     or any sub-folder, where path is folder containing dat_i.yaml;')
   console.info('     also does regular mbake of Pug')
   
   console.info('     Note: . is current directory, or use any path instead of .')
   console.info(' -------------------------------------------------------------')
   console.info()
   console.info(' Starters:')
   console.info('  For a starter website:                                      mbake -w')
   console.info('  For a starter CMS|items:                                    mbake -e')

   console.info('  For an example dynamic web app CRUD:                        mbake -u')

   console.info()
   console.info('  mbakeX CLI extra has WebCMS, components and more flags and examples: mbakeX')
   console.info()
   console.info(' Full docs: http://docs.Metabake.org')
   console.info()

   process.exit()
}

// args: //////////////////////////////////////////////////////////////////////////////////////////////////////
const optionDefinitions = [
   { name: 'mbake', defaultOption: true },

   { name: 'help', alias: 'h', type: Boolean },
   { name: 'version', alias: 'v', type: Boolean },
   
   { name: 'items', alias: 'i', type: Boolean },
   { name: 'css', alias: 's', type: Boolean },

   { name: 'MinJS', alias: 't', type: Boolean },

   { name: 'CMS', alias: 'e', type: Boolean },

   { name: 'website', alias: 'w', type: Boolean },
   { name: 'CRUD', alias: 'u', type: Boolean },

]
const argsParsed = commandLineArgs(optionDefinitions)
let arg: string = argsParsed.mbake

console.info()

// unzip: ////////////////////////////////////////////////////////////////////////////////////////////
function unzipCRUD () {
   let src: string = __dirname + '/CRUD.zip'
   let zip = new AdmZip(src)
   zip.extractAllTo(cwd, /*overwrite*/true)
   console.info('Extracted an example CRUD to ./CRUD')
   process.exit()
}
function unzipS () {
   let src: string = __dirname + '/website.zip'
   let zip = new AdmZip(src)
   zip.extractAllTo(cwd, /*overwrite*/true)
   console.info('Extracted a starter website to ./website')
   process.exit()
}
function unzipE () {
   let src: string = __dirname + '/CMS.zip'
   let zip = new AdmZip(src)
   zip.extractAllTo(cwd, /*overwrite*/true)
   console.info('Extracted a starter CMS app to ./CMS')
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
   } else if (arg.startsWith('.')) {//cur

      arg = cwd //test ./dd

   } else { // just plain, dir passed
      arg = cwd + '/' + arg
   }
}

// pug: ////////////////////////////////////////////////////////////////////////////////////////////////
function bake (arg) {
   new MBake().bake(arg)
   process.exit()
}

// itemize : /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function itemize (arg) {
   new MBake().itemizeNBake(arg)
   process.exit()
}

function css (arg) {
   new Sas().css(arg)
}

function minJS (arg) {
   new MinJS(arg)
}

// start: /////////////////////////////////////////////////////////////////////////////////////
if (argsParsed.items)
   itemize(arg)
else if (argsParsed.css) 
   css(arg)
else if (argsParsed.CMS)
   unzipE()
else if (argsParsed.CRUD)
   unzipCRUD()
else if (argsParsed.website)
   unzipS()
else if (argsParsed.MinJS)
   minJS(arg)
else if (argsParsed.version)
   version()
else if (argsParsed.help)
   help()
else if (!arg)
   help()
else
   bake(arg)
