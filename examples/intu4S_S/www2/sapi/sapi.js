var Services = (function () {
    function Services() {
        this.serviceRPC = new httpRPC('http', '0.0.0.0', '3000');
    }
    Services.prototype.getSessionId = function (data, address) {
        console.log('getSessionId', JSON.stringify(data), JSON.stringify(address));
        var request = {
            data: data,
            address: address
        };
        return this.serviceRPC.invoke("stripe", "get-session", "createSession", request);
    };
    return Services;
}());
