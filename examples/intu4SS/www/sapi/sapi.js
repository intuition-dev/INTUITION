var Services = (function () {
    function Services() {
        this.serviceRPC = new httpRPC('http', '0.0.0.0', '3000');
    }
    Services.prototype.getSessionId = function (id, name, description, image, amount, currency, quantity) {
        return this.serviceRPC.invoke("stripe", "get-session", "createSession", { id: id, name: name, description: description, image: image, amount: amount, currency: currency, quantity: quantity });
    };
    return Services;
}());
