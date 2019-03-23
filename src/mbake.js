#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AdmZip = require("adm-zip");
const commandLineArgs = require("command-line-args");
const Base_1 = require("./lib/Base");
const clear = require("cli-clear");
const Sa_1 = require("./lib/Sa");
clear();
const cwd = process.cwd();
function version() {
    let b = new Base_1.Ver();
    console.info();
    console.info('mbake CLI version: ' + b.ver());
    console.info();
    console.info('Usage:');
    console.info('  To process any_dir Pug to html recursively:                      mbake .    # . or path');
    console.info('  Process SASS/SCSS file into css, requires assets.yaml:           mbake -s .  # . ');
    console.info('     or path that has assets.yaml, or any sub-folder under /assets');
    console.info('  Process .ts and .js file to .min:                                mbake -t . # . or path');
    console.info('  To process Pug and dat_i items to items.json:                    mbake -i . # . or path,');
    console.info('     or any sub-folder, where path is folder containing dat_i.yaml; also does regular mbake of Pug');
    console.info(' ----------------------------------------------------------------');
    console.info();
    console.info(' Starters:');
    console.info('  For a starter website:                                           mbake -w');
    console.info('  For a starter blog|items:                                        mbake -b');
    console.info('  For a starter dash web app:                                      mbake -d');
    console.info('  For an example dynamic web app CRUD:                             mbake -u');
    console.info();
    console.info('  mbakeX extra has CMS, components and more flags and examples: mbakeX');
    console.info();
    console.info(' Full docs: http://doc.mbake.org');
    console.info();
    process.exit();
}
const optionDefinitions = [
    { name: 'mbake', defaultOption: true },
    { name: 'items', alias: 'i', type: Boolean },
    { name: 'css', alias: 's', type: Boolean },
    { name: 'MinJS', alias: 't', type: Boolean },
    { name: 'blog', alias: 'b', type: Boolean },
    { name: 'dash', alias: 'd', type: Boolean },
    { name: 'website', alias: 'w', type: Boolean },
    { name: 'CRUD', alias: 'u', type: Boolean },
];
const argsParsed = commandLineArgs(optionDefinitions);
let arg = argsParsed.mbake;
console.info();
function unzipCRUD() {
    let src = __dirname + '/CRUD.zip';
    let zip = new AdmZip(src);
    zip.extractAllTo(cwd, true);
    console.info('Extracted an example CRUD to ./CRUD');
    process.exit();
}
function unzipS() {
    let src = __dirname + '/website.zip';
    let zip = new AdmZip(src);
    zip.extractAllTo(cwd, true);
    console.info('Extracted a starter website to ./website');
    process.exit();
}
function unzipB() {
    let src = __dirname + '/blog.zip';
    let zip = new AdmZip(src);
    zip.extractAllTo(cwd, true);
    console.info('Extracted a starter blog app to ./blog');
    process.exit();
}
function unzipD() {
    let src = __dirname + '/dash.zip';
    let zip = new AdmZip(src);
    zip.extractAllTo(cwd, true);
    console.info('Extracted an starter Dash web app to ./dash');
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
    else if (arg.startsWith('.')) {
        arg = cwd;
    }
    else {
        arg = cwd + '/' + arg;
    }
}
function bake(arg) {
    new Base_1.MBake().bake(arg);
    process.exit();
}
function itemize(arg) {
    new Base_1.MBake().itemizeNBake(arg);
    process.exit();
}
function css(arg) {
    new Sa_1.Sas().css(arg);
}
function minJS(arg) {
    new Sa_1.MinJS(arg);
}
if (argsParsed.items)
    itemize(arg);
else if (argsParsed.css)
    css(arg);
else if (argsParsed.blog)
    unzipB();
else if (argsParsed.dash)
    unzipD();
else if (argsParsed.CRUD)
    unzipCRUD();
else if (argsParsed.website)
    unzipS();
else if (argsParsed.MinJS)
    minJS(arg);
else if (!arg)
    version();
else
    bake(arg);
