#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AdmZip = require("adm-zip");
const commandLineArgs = require("command-line-args");
const Base_1 = require("./lib/Base");
const Wa_1 = require("./lib/Wa");
const Sa_1 = require("./lib/Sa");
const cwd = process.cwd();
function version() {
    let b = new Base_1.Ver();
    console.info();
    console.info('mbakeX CLI version: ' + b.ver());
    console.info('  your node version is ' + process.version);
    console.info('  from ' + __dirname);
    console.info();
    console.info('Usage: ');
    console.info('  For local(non-cloud) watcher and server on port 8090 :           mbakeX -w .  # . or path');
    console.info('  To process Pug and RIOT *-comp.pug tags/components:              mbakeX -c . # . or path;');
    console.info('     also does regular mbake of Pug');
    console.info('  To map map.yaml to menu.json, sitemap.xml and FTS.idx:           mbakeX -p .  # . or path');
    console.info('  Compress .jpg images with a default compression level:           mbakeX -i .  # . or path');
    console.info('  To process list.csv to list.json:                                mbakeX -l .  # . or path');
    console.info('  SFTP w/o source code(eg: .js, SASS, pug) - avoid, instead mount: mbakeX -F ./sftp_site_sec.yaml');
    console.info('    # . or path');
    console.info(' ----------------------------------------------------------------');
    console.info();
    console.info(' Starters:');
    console.info('  For a starter baseCMS :                                           mbakeX -m');
    console.info('  For example slides markdown:                                      mbakeX -d');
    console.info('  For a Electron(pre-PhoneGap) app:                                 mbakeX -e');
    console.info('  For a starter hybrid Phonegap app:                                mbakeX -o');
    console.info('  For an example Ad:                                                mbakeX -a');
    console.info();
    console.info(' Full docs: http://docs.mBake.org');
    console.info();
    process.exit();
}
const optionDefinitions = [
    { name: 'mbakeX', defaultOption: true },
    { name: 'watcher', alias: 'w', type: Boolean },
    { name: 'comps', alias: 'c', type: Boolean },
    { name: 'map', alias: 'p', type: Boolean },
    { name: 'img', alias: 'i', type: Boolean },
    { name: 'SFTP', alias: 'F', type: Boolean },
    { name: 'csv2Json', alias: 'l', type: Boolean },
    { name: 'CMS', alias: 'm', type: Boolean },
    { name: 'phonegap', alias: 'o', type: Boolean },
    { name: 'elect', alias: 'e', type: Boolean },
    { name: 'ad', alias: 'a', type: Boolean },
    { name: 'slides', alias: 'd', type: Boolean },
];
const argsParsed = commandLineArgs(optionDefinitions);
let arg = argsParsed.mbakeX;
function unzipA() {
    let src = __dirname + '/CMS.zip';
    let zip = new AdmZip(src);
    zip.extractAllTo(cwd, true);
    console.info('Extracted a starter CMS in this folder');
    process.exit();
}
function unzipG() {
    let src = __dirname + '/PGap.zip';
    let zip = new AdmZip(src);
    zip.extractAllTo(cwd, true);
    console.info('Extracted a starter Phonegap app to ./PG');
    process.exit();
}
function unzipE() {
    let src = __dirname + '/elect.zip';
    let zip = new AdmZip(src);
    zip.extractAllTo(cwd, true);
    console.info('Extracted a starter Electron app to ./elect');
    process.exit();
}
function unzipD() {
    let src = __dirname + '/ad.zip';
    let zip = new AdmZip(src);
    zip.extractAllTo(cwd, true);
    console.info('Extracted an example ad  ./ad');
    process.exit();
}
function unzipL() {
    let src = __dirname + '/slidesEx.zip';
    let zip = new AdmZip(src);
    zip.extractAllTo(cwd, true);
    console.info('Extracted example of markdown slides to ./slidesEx');
    process.exit();
}
function csv2Json(arg) {
    new Wa_1.CSV2Json(arg).convert();
}
function map(arg) {
    new Wa_1.Map(arg).gen();
}
function img(arg) {
    new Sa_1.Resize().do(arg);
}
function sft(arg) {
    new Sa_1.SFTP(arg);
}
function comps(arg) {
    new Base_1.MBake().comps(arg);
}
function bake(arg) {
    new Base_1.MBake().bake(arg);
    process.exit();
}
if (arg) {
    arg = Base_1.Dirs.slash(arg);
    if (arg.startsWith('/')) {
    }
    else if (arg.startsWith('..')) {
        arg = arg.substring(2);
        let d = cwd;
        d = Base_1.Dirs.slash(d);
        let n = d.lastIndexOf('/');
        d = d.substring(0, n);
        arg = d + arg;
    }
    else {
        arg = cwd + '/' + arg;
    }
}
if (argsParsed.comps) {
    try {
        comps(arg);
        bake(arg);
    }
    catch (err) {
        console.info(err);
    }
}
else if (argsParsed.elect)
    unzipE();
else if (argsParsed.phonegap)
    unzipG();
else if (argsParsed.CMS)
    unzipA();
else if (argsParsed.ad)
    unzipD();
else if (argsParsed.csv2Json)
    csv2Json(arg);
else if (argsParsed.watcher) {
    Wa_1.Wa.watch(arg);
}
else if (argsParsed.img) {
    img(arg);
}
else if (argsParsed.SFTP) {
    sft(arg);
}
else if (argsParsed.map)
    map(arg);
else if (argsParsed.slides)
    unzipL();
else if (!arg)
    version();
