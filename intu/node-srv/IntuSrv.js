"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var Serv_1 = require("mbake/lib/Serv");
var editorRoutes_1 = require("./routes/editorRoutes");
var adminRoutes_1 = require("./routes/adminRoutes");
var uploadRoute_1 = require("./routes/uploadRoute");
var Setup_1 = require("./Setup");
var FileOpsExtra_1 = require("mbake/lib/FileOpsExtra");
var IntuApp = (function (_super) {
    __extends(IntuApp, _super);
    function IntuApp(db, origins) {
        var _this = _super.call(this) || this;
        _this.makeInstance(origins);
        _this.db = db;
        _this.uploadRoute = new uploadRoute_1.UploadRoute();
        FileOpsExtra_1.VersionNag.isCurrent('intu', db.veri()).then(function (isCurrent_) {
            try {
                if (!isCurrent_)
                    console.log('There is a newer version of MetaBake\'s intu(Intuition), please update.');
                else
                    console.log('You have the current version of MetaBake\'s intu(Intuition)');
            }
            catch (err) {
                console.log(err);
            }
        });
        return _this;
    }
    IntuApp.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!this.db.dbExists()) return [3, 2];
                        return [4, this.db.init()];
                    case 1:
                        _a.sent();
                        this._runNormal();
                        return [3, 3];
                    case 2:
                        console.log('run setup');
                        this._runSetup();
                        _a.label = 3;
                    case 3: return [3, 5];
                    case 4:
                        err_1 = _a.sent();
                        console.warn(err_1);
                        return [3, 5];
                    case 5: return [2];
                }
            });
        });
    };
    IntuApp.prototype._runSetup = function () {
        this._run(8090, true);
        var setup = new Setup_1.Setup(this.db, this);
        setup.setup();
    };
    IntuApp.prototype._runNormal = function () {
        return __awaiter(this, void 0, void 0, function () {
            var port;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.db.getPort()];
                    case 1:
                        port = _a.sent();
                        console.log('_runNormal port:', port);
                        this._run(port, false);
                        return [2];
                }
            });
        });
    };
    IntuApp.prototype._run = function (port, setup) {
        return __awaiter(this, void 0, void 0, function () {
            var ar, er, appPath;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ar = new adminRoutes_1.AdminRoutes(this.db);
                        er = new editorRoutes_1.EditorRoutes(this.db);
                        this.handleRRoute('admin', 'admin', ar.route.bind(ar));
                        this.handleRRoute('api', 'editors', er.route.bind(er));
                        this.appInst.post('/upload', this.uploadRoute.upload);
                        this.serveStatic('../WWW');
                        if (!!setup) return [3, 2];
                        return [4, this.db.getAppPath()];
                    case 1:
                        appPath = _a.sent();
                        console.log(appPath);
                        this.serveStatic(appPath);
                        _a.label = 2;
                    case 2:
                        this.appInst.get('/monitor', function (req, res) {
                            _this.db.monitor()
                                .then(function (count) {
                                return res.send('OK');
                            }).catch(function (error) {
                                console.info('monitor error: ', error);
                                res.status(400);
                                return res.send = (error);
                            });
                        });
                        this.appInst.get('/ver', function (req, res) {
                            return res.send(_this.db.veri);
                        });
                        this.listen(port);
                        return [2];
                }
            });
        });
    };
    return IntuApp;
}(Serv_1.ExpressRPC));
exports.IntuApp = IntuApp;
module.exports = {
    IntuApp: IntuApp
};
