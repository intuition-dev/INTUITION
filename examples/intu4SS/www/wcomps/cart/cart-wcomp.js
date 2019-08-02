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
depp.require(['poly-wcomp', 'mustache'], function () {
    console.log('loaded');
    var cTemp = document.createElement('template');
    cTemp.innerHTML = "\n      <link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/gh/intuition-dev/toolBelt@v1.2.1/bootStrap/css/bootstrapTop.css\">\n      <div itemId={{id}}>\n         <span>{{itemData.item.name}}</span>\n         <span>{{size}}</span>\n         <span>{{quantity}}</span>\n      </div>\n   ";
    var c2Temp = document.createElement('template');
    c2Temp.innerHTML = "\n      <link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/gh/intuition-dev/toolBelt@v1.2.1/bootStrap/css/bootstrapTop.css\">\n      <link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/gh/intuition-dev/toolBelt@v1.2.1/bootStrap/css/bootstrap.css\">\n      <div itemId={{id}}>\n         <span>{{itemData.item.name}}</span>\n         <span>{{size}}</span>\n         <span>{{quantity}}</span>\n      </div>\n   ";
    window.customElements.define('cart-wcomp', (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            var _this = _super.call(this) || this;
            console.log('CART WCOMP');
            _this.sr = _this.attachShadow({ mode: 'open' });
            _this.sr.appendChild(cTemp.content.cloneNode(true));
            _this.tmpl = c2Temp.innerHTML;
            return _this;
        }
        Object.defineProperty(class_1, "observedAttributes", {
            get: function () { return ['data']; },
            enumerable: true,
            configurable: true
        });
        class_1.prototype.attributeChangedCallback = function (aName, oldVal, newVal) {
            console.log(aName, newVal);
            if ('data' == aName) {
                var THIZ = this;
                var data = JSON.parse(newVal);
                var rendered = Mustache.render(this.tmpl, { id: data.id, quantity: data.quantity, size: data.size, itemData: data.itemData });
                THIZ.sr.innerHTML = rendered;
            }
        };
        return class_1;
    }(HTMLElement)));
});
