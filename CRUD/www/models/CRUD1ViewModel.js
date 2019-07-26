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
console.log('VMLoaded');
var tableData = [
    { id: 1, name: 'Mary May', age: '1', col: 'blue' },
    { id: 2, name: 'Christine Lobowski', age: '42', col: 'green' },
    { id: 3, name: 'Brendon Philips', age: '125', col: 'orange' },
    { id: 4, name: 'Margret Marmajuke', age: '16', col: 'yellow' },
];
disE1('gotData', tableData);
var CRUDvm = (function (_super) {
    __extends(CRUDvm, _super);
    function CRUDvm(arg) {
        var _this = _super.call(this) || this;
        if (42 !== arg)
            throw new Error('use static inst()');
        return _this;
    }
    CRUDvm.prototype.setup = function () {
        var pro = window.location.protocol;
        pro = pro.replace(':', '');
        var host = window.location.hostname;
        var port = window.location.port;
        this.rpc = new httpRPC(pro, host, 8888);
    };
    CRUDvm.inst = function () {
        return new Promise(function (res, rej) {
            if (CRUDvm._instance)
                res(CRUDvm._instance);
            depp.require(['RPC', 'spin-wcomp'], function () {
                console.log('MODEL!');
                CRUDvm._instance = new CRUDvm(42);
                CRUDvm._instance.setup();
                res(CRUDvm._instance);
            });
        });
    };
    CRUDvm.prototype._all = function () {
        var prom = this.rpc.invoke('api', 'CRUD1Pg', 'selectAll', { a: 5, b: 2 });
        console.log('***', 'data in flight', Date.now() - _start);
        prom.then(function (resp) {
            console.log('resp', resp, Date.now() - _start);
        }).catch(function (err) {
            console.log('err', err);
        });
    };
    CRUDvm.prototype.ins = function (name, topics) {
        var guid = getGUID();
        var prom = this.rpc.invoke('api', 'CRUD1Pg', 'insert', { guid: guid, name: name, topics: topics });
        prom.then(function (resp) {
            console.log('resp', resp);
        }).catch(function (err) {
            console.log('err', err);
        });
    };
    CRUDvm.prototype.validate = function () {
        return 'OK';
    };
    return CRUDvm;
}(BaseViewModel));
