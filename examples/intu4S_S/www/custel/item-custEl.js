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
    console.log('loaded');
    var cTemp = document.createElement('template');
    cTemp.innerHTML = "\n      <link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/gh/intuition-dev/toolBelt@v1.8.21/bootStrap/css/bootstrapTop.css\">\n      <a href=\"{{url}}\">\n      <div class=\"card m-1\" style=\"max-width:400px\">\n         <img class=\"card-img-top\"  />\n         <div class=\"card-footer\">\n            <p>{{title}}</p>\n         </div>\n      </div>\n      </a>\n      <style>\n         .card * {\n            color: #24242b;\n            font-size: 16px;\n         }\n         .card, .card-footer {\n            height: 100%;\n         }\n      </style>\n   ";
    var c2Temp = document.createElement('template');
    c2Temp.innerHTML = "\n      <link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/gh/intuition-dev/toolBelt@v1.8.21/bootStrap/css/bootstrapTop.css\">\n      <link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/gh/intuition-dev/toolBelt@v1.8.21/bootStrap/css/bootstrap.css\">\n      <a href=\"{{url}}\">\n      <div class=\"card m-1\" style=\"max-width:400px\">\n         <img class=\"card-img-top\" src=\"{{image}}\"/>\n         <div class=\"card-footer\">\n            <p>{{title}}</p>\n         </div>\n      </div>\n      </a>\n      <style>\n         .card * {\n            color: #24242b;\n            font-size: 16px;\n         }\n         .card, .card-footer {\n            height: 100%;\n         }\n      </style>\n   ";
    window.customElements.define('item-custel', (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            var _this = _super.call(this) || this;
            console.log('cons');
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
                var image = data.prefix + data.url + '/' + data.image;
                var rendered = Mustache.render(this.tmpl, { title: data.title, url: data.prefix + data.url, image: image });
                THIZ.sr.innerHTML = rendered;
            }
        };
        return class_1;
    }(HTMLElement)));
});
