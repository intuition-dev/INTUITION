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
    cTemp.innerHTML = "\n      <link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/gh/intuition-dev/toolBelt@v1.2.2/bootStrap/css/bootstrapTop.css\">\n      <div class=\"card d-flex row mb-2\" itemId={{id}}>\n         <div class=\"col-3\">\n            <img src={{image}} alt=\"Card image cap\">\n         </div>\n         <div class=\"card-body col-9\">\n            <h5 class=\"card-title\">{{itemData.item.name}}</h5>\n            <h6 class=\"card-subtitle mb-2 text-muted\">Size: {{size}}</h6>\n            <p class=\"card-text\">Quantity: {{quantity}}</p>\n            <p class=\"card-text\">Price: ${{cost}}</p>\n            <a href={{url}} class=\"card-link mt-3\">View item</a>\n         </div>\n      </div>\n\n      <style>\n         img {\n            width: 200px;\n            max-width: 100%;\n         }\n         .card {\n            flex-direction: row;\n         }\n         .card-link {\n            border-radius: 0px;\n            font-size: 13px;\n            border: 0;\n            display: inline-block;\n            width: auto;\n            text-decoration: none;\n            vertical-align: middle;\n            white-space: nowrap;\n            padding: 13px 20px;\n            border: solid 1px #24242b;\n            text-transform: uppercase;\n            color: #24242b;\n            letter-spacing: .075em;\n            font-weight: 400;\n            transition: all 0.3s cubic-bezier(0.215,0.61,0.355,1);\n            background: transparent;\n            line-height: 1.4;\n            transition: all .3s ease-in-out;\n         }\n      </style>\n   ";
    var c2Temp = document.createElement('template');
    c2Temp.innerHTML = "\n      <link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/gh/intuition-dev/toolBelt@v1.2.2/bootStrap/css/bootstrapTop.css\">\n      <link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/gh/intuition-dev/toolBelt@v1.2.2/bootStrap/css/bootstrap.css\">\n      <div class=\"card d-flex row mb-2\" itemId={{id}}>\n         <div class=\"col-3\">\n            <img src={{image}} alt=\"Card image cap\">\n         </div>\n         <div class=\"card-body col-9\">\n            <h5 class=\"card-title\">{{itemData.item.name}}</h5>\n            <h6 class=\"card-subtitle mb-2 text-muted\">Size: {{size}}</h6>\n            <p class=\"card-text\">Quantity: {{quantity}}</p>\n            <p class=\"card-text\">Price: ${{cost}}</p>\n            <a href={{url}} class=\"card-link mt-3\">View item</a>\n         </div>\n      </div>\n\n      <style>\n         img {\n            width: 200px;\n            max-width: 100%;\n         }\n         .card {\n            flex-direction: row;\n         }\n         .card-link {\n            border-radius: 0px;\n            font-size: 13px;\n            border: 0;\n            display: inline-block;\n            width: auto;\n            text-decoration: none;\n            vertical-align: middle;\n            white-space: nowrap;\n            padding: 13px 20px;\n            border: solid 1px #24242b;\n            text-transform: uppercase;\n            color: #24242b;\n            letter-spacing: .075em;\n            font-weight: 400;\n            transition: all 0.3s cubic-bezier(0.215,0.61,0.355,1);\n            background: transparent;\n            line-height: 1.4;\n            transition: all .3s ease-in-out;\n         }\n      </style>\n   ";
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
                var url = data.prefix + data.itemData.url;
                var image = url + '/' + data.itemData.image;
                var cost = data.itemData.item.price * data.quantity;
                console.log('cost ---> ', cost);
                var rendered = Mustache.render(this.tmpl, { id: data.id, quantity: data.quantity, size: data.size, itemData: data.itemData, url: url, image: image, cost: cost });
                THIZ.sr.innerHTML = rendered;
            }
        };
        return class_1;
    }(HTMLElement)));
});
