var Services = (function () {
    function Services() {
        this.serviceRPC = new httpRPC('http', '0.0.0.0', '3000');
    }
    Services.prototype.getSessionId = function () {
        return this.serviceRPC.invoke("stripe", "get-session", "createSession", {});
    };
    return Services;
}());
