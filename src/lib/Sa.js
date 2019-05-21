"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Base_1 = require("./Base");
const yaml = require("js-yaml");
const findUp = require("find-up");
const sass = require("node-sass");
const autoprefixer = require("autoprefixer");
const postcss = require("postcss");
const stripCssComments = require("strip-css-comments");
const path = require("path");
const fs = require("fs-extra");
const FileHound = require("filehound");
const sharp = require("sharp");
const probe = require("probe-image-size");
const JavaScriptObfuscator = require("javascript-obfuscator");
const ts = __importStar(require("typescript"));
const Terser = require("terser");
const execa = require('execa');
const logger = require('tracer').console();
class GitDown {
    constructor(pass_) {
        const last = pass_.lastIndexOf('/');
        this.pass = pass_.substring(last + 1);
        this.dir = pass_.substring(0, last);
        this.config = yaml.load(fs.readFileSync('gitdown.yaml'));
        console.log(this.dir, this.config.BRANCH);
        logger.trace(this.config);
        this.remote = 'https://' + this.config.LOGINName + ':';
        this.remote += this.pass + '@';
        this.remote += this.config.REPO + '/';
        this.remote += this.config.PROJECT;
        this._emptyFolders();
    }
    async process() {
        try {
            let b = this.config.BRANCH;
            await this._branchExists(b);
            console.log(this.exists);
            if (this.exists)
                await this._getEXISTINGRemoteBranch(b);
            else
                await this._getNEWRemoteBranch(b);
            this._moveTo(b);
        }
        catch (err) {
            console.error(err);
        }
    }
    _moveTo(branch) {
        let dir = this.config.PROJECT;
        dir = this.dir + '/' + dir + '/' + this.config.REPOFolder;
        let dirTo = this.config.PROJECT;
        dirTo = this.dir + '/' + this.config.LOCALFolder;
        console.log(dir, dirTo);
        fs.moveSync(dir, dirTo);
        let dirR = this.config.PROJECT;
        dirR = this.dir + '/' + dirR;
        fs.removeSync(dirR);
        console.log('removed', dirR);
        console.log();
        fs.writeJsonSync(dirTo + '/branch.json', { branch: branch, syncedOn: Base_1.Ver.date() });
        console.log('DONE!');
        console.log('Maybe time to make/bake', dirTo);
        console.log('and then point http server to', dirTo);
        console.log();
    }
    _emptyFolders() {
        let dirR = this.config.PROJECT;
        dirR = this.dir + '/' + dirR;
        console.log('remove', dirR);
        fs.removeSync(dirR);
        let dirTo = this.config.PROJECT;
        dirTo = this.dir + '/' + this.config.LOCALFolder;
        console.log('remove', dirTo);
        fs.removeSync(dirTo);
    }
    async _getNEWRemoteBranch(branch) {
        const { stdout } = await execa('git', ['clone', this.remote]);
        let dir = this.config.PROJECT;
        dir = this.dir + '/' + dir;
        const { stdout2 } = await execa('git', ['remote', 'add', branch, this.remote], { cwd: dir });
        const { stdout3 } = await execa('git', ['checkout', '-b', branch], { cwd: dir });
        const { stdout4 } = await execa('git', ['push', '-u', 'origin', branch], { cwd: dir });
    }
    async _getEXISTINGRemoteBranch(branch) {
        const { stdout } = await execa('git', ['clone', this.remote]);
        let dir = this.config.PROJECT;
        dir = this.dir + '/' + dir;
        const { stdout2 } = await execa('git', ['checkout', branch], { cwd: dir });
        console.log(dir, branch);
    }
    async _branchExists(branch) {
        let cmd = this.remote;
        cmd += '.git';
        logger.info(cmd);
        const { stdout } = await execa('git', ['ls-remote', cmd]);
        this.exists = stdout.includes(branch);
        logger.trace(stdout);
    }
}
exports.GitDown = GitDown;
class MinJS {
    ts(dir) {
        logger.info(dir);
        const THIZ = this;
        return new Promise(function (resolve, reject) {
            const rec = FileHound.create()
                .paths(dir)
                .ext("ts")
                .findSync();
            if (rec.length < 1)
                resolve('OK');
            THIZ.compile(rec, {
                target: ts.ScriptTarget.ES5,
                removeComments: true
            });
            resolve('OK');
        });
    }
    min(dir) {
        const THIZ = this;
        return new Promise(async function (resolve, reject) {
            const rec = FileHound.create()
                .paths(dir)
                .ext("js")
                .addFilter(function (fn) {
                if (fn._pathname.endsWith('.min.js')) {
                    return false;
                }
                if (fn._pathname.endsWith('-comp.js')) {
                    return false;
                }
                return true;
            })
                .findSync();
            for (let fn of rec) {
                try {
                    await THIZ._minOneJS(fn);
                }
                catch (err) {
                    logger.warn(err);
                    reject(err);
                }
            }
            console.info('Done!'.green);
            resolve('OK');
        });
    }
    _minOneJS(fn) {
        return new Promise(async function (resolve, reject) {
            let result;
            try {
                console.log(fn);
                let code = fs.readFileSync(fn).toString('utf8');
                let optionsCompJS = Object.assign({}, MinJS.CompOptionsJS);
                let _output = { indent_level: 0, quote_style: 0, semicolons: false };
                _output['mangle'] = true;
                optionsCompJS['output'] = _output;
                if (fn.includes('-wcomp'))
                    result = Terser.minify(code, MinJS.CompOptionsJS);
                else
                    result = Terser.minify(code, optionsCompJS);
                let txt = result.code;
                txt = txt.replace(/(\r\n\t|\n|\r\t)/gm, '\n');
                txt = txt.replace(/\n\s*\n/g, '\n');
                txt = txt.trim();
                if (fn.includes('-wcomp')) {
                    let ugs;
                    try {
                        logger.info('obs');
                        ugs = JavaScriptObfuscator.obfuscate(txt, MinJS.getCompOptions());
                        txt = ugs.getObfuscatedCode();
                    }
                    catch (err) {
                        logger.error('error');
                        logger.error(err);
                        reject(err);
                    }
                }
                txt = MinJS.ver + txt;
                let fn2 = fn.slice(0, -3);
                fn2 = fn2 + '.min.js';
                fs.writeFileSync(fn2, txt);
                resolve('OK');
            }
            catch (err) {
                logger.warn(err, result);
                reject(err);
            }
        });
    }
    static getCompOptions() {
        let t = {
            identifierNamesGenerator: 'hexadecimal',
            disableConsoleOutput: false,
            target: 'browser-no-eval',
            stringArray: true,
            stringArrayThreshold: 1,
            stringArrayEncoding: 'rc4',
            selfDefending: true,
            controlFlowFlattening: true,
            controlFlowFlatteningThreshold: 1,
            deadCodeInjection: true,
            deadCodeInjectionThreshold: 0.2
        };
        return t;
    }
    compile(fileNames, options_) {
        let program = ts.createProgram(fileNames, options_);
        let emitResult = program.emit();
        let allDiagnostics = ts
            .getPreEmitDiagnostics(program)
            .concat(emitResult.diagnostics);
        allDiagnostics.forEach(diagnostic => {
            if (diagnostic.file) {
                let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
                let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
                console.info(`${diagnostic.file.fileName}:`.cyan, `${line + 1}:${character + 1}`.yellow, `${message}`);
            }
            else {
                console.info(`${ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`);
            }
        });
        let exitCode = emitResult.emitSkipped ? 1 : 0;
        console.info(`status code '${exitCode}'.`);
    }
}
MinJS.ver = '// mB ' + Base_1.Ver.ver() + ' on ' + Base_1.Ver.date() + '\r\n';
MinJS.CompOptionsJS = {
    parse: { html5_comments: false },
    compress: { drop_console: true,
        keep_fargs: true, reduce_funcs: false },
    output: { indent_level: 1, quote_style: 3, semicolons: false },
    ecma: 5,
    mangle: false,
    keep_classnames: true,
    keep_fnames: true
};
exports.MinJS = MinJS;
class YamlConfig {
    constructor(fn) {
        let cfg = yaml.load(fs.readFileSync(fn));
        console.info(cfg);
        return cfg;
    }
}
exports.YamlConfig = YamlConfig;
class Resize {
    do(dir) {
        logger.info(dir);
        const rec = FileHound.create()
            .paths(dir)
            .ext('jpg')
            .findSync();
        let ret = [];
        for (let s of rec) {
            let n = s.slice(0, -4);
            if (n.includes('.min'))
                continue;
            ret.push(n);
        }
        for (let s of ret) {
            this.smaller(s);
        }
    }
    isWide(file) {
        let data = fs.readFileSync(file + '.jpg');
        let p = probe.sync(data);
        if (p.width && p.width > 3200)
            return true;
        logger.info(file, ' is low res');
        return false;
    }
    smaller(file) {
        logger.info(file);
        if (!this.isWide(file))
            return;
        sharp(file + '.jpg')
            .resize(1680 * 1.9)
            .jpeg({
            quality: 74,
            progressive: true,
            trellisQuantisation: true
        })
            .blur()
            .toFile(file + '.2K.min.jpg');
        sharp(file + '.jpg')
            .resize(320 * 2)
            .jpeg({
            quality: 78,
            progressive: true,
            trellisQuantisation: true
        })
            .toFile(file + '.32.min.jpg');
    }
}
exports.Resize = Resize;
class Sas {
    css(dir) {
        const THIZ = this;
        return new Promise(async function (resolve, reject) {
            let a;
            let fn = dir + '/assets.yaml';
            if (fs.existsSync(fn))
                a = yaml.load(fs.readFileSync(fn));
            else {
                let dir2 = findUp.sync('assets.yaml', { cwd: dir });
                a = yaml.load(fs.readFileSync(dir2));
                dir = dir2.slice(0, -12);
            }
            logger.info(dir);
            const css = a.css;
            const set = new Set(css);
            logger.info(set);
            for (let item of set) {
                await THIZ._trans(item, dir);
            }
            console.info();
            console.info(' Done!'.green);
            resolve('OK');
        });
    }
    _trans(fn2, dir) {
        let css = sass.renderSync({
            file: dir + '/' + fn2,
            outputStyle: 'compact'
        });
        postcss([autoprefixer({ browsers: ['> 0.5%', 'cover 99.5%', 'last 2 major versions', 'Firefox ESR', 'ios_saf >= 10', 'ie >= 11'] })]).process(css.css, { from: undefined }).then(function (result) {
            console.info('autoprefixer');
            result.warnings().forEach(function (warn) {
                console.warn(warn.toString());
            });
            let res = stripCssComments(result.css, { preserve: false });
            res = res.replace(/(\r\n\t|\n|\r\t)/gm, '\n');
            res = res.replace(/\n\s*\n/g, '\n');
            res = res.trim();
            res = res.replace(/  /g, ' ');
            res = res.replace(/; /g, ';');
            res = res.replace(/: /g, ':');
            res = res.replace(/ }/g, '}');
            res = res.replace(/ { /g, '{');
            res = res.replace(/, /g, ',');
            const ver = ' /* mB ' + Base_1.Ver.ver() + ' on ' + Base_1.Ver.date() + " */";
            res = res + ver;
            let filename2 = path.basename(fn2);
            filename2 = filename2.split('.').slice(0, -1).join('.');
            let filename = filename2.split('\\').pop().split('/').pop();
            fs.ensureDirSync(dir + '/css');
            fs.writeFileSync(dir + '/css/' + filename + '.css', res);
        });
    }
}
exports.Sas = Sas;
module.exports = {
    Sas, Resize, YamlConfig, MinJS, GitDown
};
