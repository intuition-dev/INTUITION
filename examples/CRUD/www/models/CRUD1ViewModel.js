console.log('VMLoaded');
var tableData = [
    { id: 1, name: 'Mary May', age: '1', col: 'blue' },
    { id: 2, name: 'Christine Lobowski', age: '42', col: 'green' },
    { id: 3, name: 'Brendon Philips', age: '125', col: 'orange' },
    { id: 4, name: 'Margret Marmajuke', age: '16', col: 'yellow' },
];
disE1('gotData', tableData);
var CRUDvm = (function () {
    function CRUDvm(arg) {
        if (42 !== arg)
            throw new Error('use static inst()');
    }
    CRUDvm.prototype.getData = function () {
        throw new Error("Method not implemented.");
    };
    CRUDvm.prototype.log = function () {
        var a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            a[_i] = arguments[_i];
        }
        throw new Error("Method not implemented.");
    };
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
            depp.require(['RPC', 'spin-custel'], function () {
                console.log('MODEL!');
                CRUDvm._instance = new CRUDvm(42);
                CRUDvm._instance.setup();
                res(CRUDvm._instance);
            });
        });
    };
    CRUDvm.prototype._all = function () {
        var prom = this.rpc.invoke('capi', 'CRUD1Pg', 'selectAll', { a: 5, b: 2 });
        console.log('***', 'data in flight', Date.now() - _start);
        disE1('spin-stop', 'stop');
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
}());
