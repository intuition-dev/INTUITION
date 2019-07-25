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
console.log('VM');
depp.require(['jquery'], spin);
var spinDiv = "\n   <div class=\"centerSpin\" id='spin'>\n      <div class=\"spinner-border\"></div>\n   </div>";
function spin() {
    $('body').append(spinDiv);
}
function spinStop() {
    $('#spin').remove();
}
setTimeout(function () {
    spinStop();
}, 2000);
var tableData = [
    { id: 1, name: 'Mary May', age: '1', col: 'blue' },
    { id: 2, name: 'Christine Lobowski', age: '42', col: 'green' },
    { id: 3, name: 'Brendon Philips', age: '125', col: 'orange' },
    { id: 4, name: 'Margret Marmajuke', age: '16', col: 'yellow' },
];
disE1('gotData', tableData);
depp.require(['RPC'], function () {
    depp.done('VM');
});
var CRUDvm = (function (_super) {
    __extends(CRUDvm, _super);
    function CRUDvm() {
        var _this = _super.call(this) || this;
        var pro = window.location.protocol;
        pro = pro.replace(':', '');
        var host = window.location.hostname;
        var port = window.location.port;
        _this.rpc = new httpRPC(pro, host, 8888);
        return _this;
    }
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
