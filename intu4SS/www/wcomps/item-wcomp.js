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
    cTemp.innerHTML = "\n      <b>I'm Comp DOM!</b>\n      Title\n      Image\n      href\n   ";
    window.customElements.define('c-wcomp', (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            var _this = _super.call(this) || this;
            console.log('cons');
            _this.sr = _this.attachShadow({ mode: 'open' });
            _this.sr.appendChild(cTemp.content.cloneNode(true));
            return _this;
        }
        Object.defineProperty(class_1, "observedAttributes", {
            get: function () { return ['title', 'image', 'href']; },
            enumerable: true,
            configurable: true
        });
        class_1.prototype.attributeChangedCallback = function (aName, oldVal, newVal) {
            console.log('comp received message', aName, newVal);
        };
        return class_1;
    }(HTMLElement)));
});
