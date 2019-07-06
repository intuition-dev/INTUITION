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
var CRUDvm = (function () {
    function CRUDvm() {
        var pro = window.location.protocol;
        pro = pro.replace(':', '');
        var host = window.location.hostname;
        var port = window.location.port;
        this.rpc = new httpRPC(pro, host, 8888);
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
        var guid = GUID();
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
