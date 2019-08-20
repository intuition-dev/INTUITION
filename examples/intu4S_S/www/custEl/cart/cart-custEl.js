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
depp.require(['poly-custel', 'mustache'], function () {
    var c2Temp = document.createElement('template');
    c2Temp.innerHTML = "\n      {{#items}}\n      <link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/gh/intuition-dev/toolBelt@v1.8.20/bootStrap/css/bootstrapTop.css\">\n      <link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/gh/intuition-dev/toolBelt@v1.8.20/bootStrap/css/bootstrap.css\">\n      <div class=\"card d-flex row mb-2\" itemId={{id}}>\n         <div class=\"col-3\">\n            <img src={{image}} alt=\"Card image cap\">\n         </div>\n         <div class=\"card-body col-9\">\n            <h5 class=\"card-title\">{{itemData.item.name}}</h5>\n            <h6 class=\"card-subtitle mb-2 text-muted\">Size: {{size}}</h6>\n            <p class=\"card-text\">Quantity: <a href=\"#\" class=\"card-link quantity d-inline-flex p-0 text-center justify-content-center align-items-center mx-2\" data-action=\"quantity-increase\" data-item-id={{id}} data-item-size={{size}}>-</a>{{quantity}}<a href=\"#\" class=\"card-link quantity d-inline-flex p-0 text-center justify-content-center align-items-center ml-2\" data-action=\"quantity-reduce\" data-item-id={{id}} data-item-size={{size}}>+</a></p>\n            <p class=\"card-text font-weight-bold\">Price: ${{cost}}</p>\n            <a href={{url}} class=\"card-link mt-3\">View item</a>\n         </div>\n      </div>\n      {{/items}}\n\n      <style>\n         img {\n            width: 200px;\n            max-width: 100%;\n         }\n         .card {\n            flex-direction: row;\n            border-radius: 0px;\n         }\n         .card-link {\n            border-radius: 0px;\n            font-size: 13px;\n            border: 0;\n            display: inline-block;\n            width: auto;\n            text-decoration: none;\n            vertical-align: middle;\n            white-space: nowrap;\n            padding: 13px 20px;\n            border: solid 1px #24242b;\n            text-transform: uppercase;\n            color: #24242b;\n            letter-spacing: .075em;\n            font-weight: 400;\n            transition: all 0.3s cubic-bezier(0.215,0.61,0.355,1);\n            background: transparent;\n            line-height: 1.4;\n            transition: all .3s ease-in-out;\n         }\n         .card-link:hover {\n            color: white;\n            background: rgba(36,36,43,.7);\n         }\n         .quantity {\n            width: 24px;\n            height: 24px;\n            max-width: 24px;\n         }\n         a, a:hover, a:active, a:focus {\n            outline: none;\n         }\n      </style>\n   ";
    window.customElements.define('cart-custel', (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            var _this = _super.call(this) || this;
            console.log('CART WCOMP');
            _this.sr = _this.attachShadow({ mode: 'open' });
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
                var data_1 = JSON.parse(newVal);
                data_1 = {
                    url: function () {
                        var data = this.itemData.prefix + this.itemData.url;
                        return data;
                    },
                    image: function () {
                        var data = this.itemData.prefix + this.itemData.url + '/' + this.itemData.image;
                        return data;
                    },
                    cost: function () {
                        var data = this.itemData.item.price * this.quantity;
                        return data;
                    },
                };
                data_1.items = [];
                JSON.parse(newVal).forEach(function (element) {
                    data_1.items.push({
                        id: element.id,
                        quantity: element.quantity,
                        size: element.size,
                        itemData: element.itemData,
                    });
                });
                var rendered = Mustache.render(this.tmpl, data_1);
                THIZ.sr.innerHTML = rendered;
                THIZ.sr.querySelectorAll('[data-action^=quantity]').forEach(function (e) {
                    e.addEventListener('click', function (e) {
                        e.preventDefault();
                        var action = this.getAttribute('data-action');
                        var itemId = this.getAttribute('data-item-id');
                        var cart = JSON.parse(localStorage.getItem('cart'));
                        if (action === 'quantity-increase' && cart[itemId]['quantity'] > 1) {
                            cart[itemId]['quantity']--;
                        }
                        else if (action === 'quantity-reduce' && cart[itemId]['quantity'] < 10) {
                            cart[itemId]['quantity']++;
                        }
                        localStorage.setItem('cart', JSON.stringify(cart));
                        window.dispatchEvent(new Event('cart-storage-changed'));
                    });
                });
            }
        };
        return class_1;
    }(HTMLElement)));
});
