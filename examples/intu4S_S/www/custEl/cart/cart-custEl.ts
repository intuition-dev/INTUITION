
declare var depp
declare var Mustache
// we are using 2 different technologies. Mostly Standard Custom Elements. They don't have biding so we use Mustache

depp.require(['poly-custEl', 'mustache'], function(){ // inside the require
   var c2Temp = document.createElement('template')
   c2Temp.innerHTML = `
      {{#items}}
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/intuition-dev/toolBelt@v1.8.19/bootStrap/css/bootstrapTop.css">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/intuition-dev/toolBelt@v1.8.19/bootStrap/css/bootstrap.css">
      <div class="card d-flex row mb-2" itemId={{id}}>
         <div class="col-3">
            <img src={{image}} alt="Card image cap">
         </div>
         <div class="card-body col-9">
            <h5 class="card-title">{{itemData.item.name}}</h5>
            <h6 class="card-subtitle mb-2 text-muted">Size: {{size}}</h6>
            <p class="card-text">Quantity: <a href="#" class="card-link quantity d-inline-flex p-0 text-center justify-content-center align-items-center mx-2" data-action="quantity-increase" data-item-id={{id}} data-item-size={{size}}>-</a>{{quantity}}<a href="#" class="card-link quantity d-inline-flex p-0 text-center justify-content-center align-items-center ml-2" data-action="quantity-reduce" data-item-id={{id}} data-item-size={{size}}>+</a></p>
            <p class="card-text font-weight-bold">Price: $\{{cost}}</p>
            <a href={{url}} class="card-link mt-3">View item</a>
         </div>
      </div>
      {{/items}}

      <style>
         img {
            width: 200px;
            max-width: 100%;
         }
         .card {
            flex-direction: row;
            border-radius: 0px;
         }
         .card-link {
            border-radius: 0px;
            font-size: 13px;
            border: 0;
            display: inline-block;
            width: auto;
            text-decoration: none;
            vertical-align: middle;
            white-space: nowrap;
            padding: 13px 20px;
            border: solid 1px #24242b;
            text-transform: uppercase;
            color: #24242b;
            letter-spacing: .075em;
            font-weight: 400;
            transition: all 0.3s cubic-bezier(0.215,0.61,0.355,1);
            background: transparent;
            line-height: 1.4;
            transition: all .3s ease-in-out;
         }
         .card-link:hover {
            color: white;
            background: rgba(36,36,43,.7);
         }
         .quantity {
            width: 24px;
            height: 24px;
            max-width: 24px;
         }
         a, a:hover, a:active, a:focus {
            outline: none;
         }
      </style>
   `
   
   window.customElements.define('cart-custEl', class extends HTMLElement {
      sr // shadow root var
      tmpl // binding template
      constructor() {
         super()
         console.log('CART WCOMP')
         this.sr = this.attachShadow({mode: 'open'})
         this.tmpl =c2Temp.innerHTML
      }//cons

      //register properties w/ reflection to attributes
      static get observedAttributes() { return ['data'] }
      attributeChangedCallback(aName, oldVal, newVal) { // handler
         console.log(aName, newVal)

         if('data'==aName) {
            const THIZ = this
            let data = JSON.parse(newVal)
            data = {
               url: function() { 
                  let data = this.itemData.prefix + this.itemData.url;
                  return data;
               },
               image: function() { 
                  let data = this.itemData.prefix + this.itemData.url + '/' + this.itemData.image;
                  return data;
               },
               cost: function() { 
                  let data = this.itemData.item.price * this.quantity;
                  return data;
               },
            }
            data.items = [];
            
            JSON.parse(newVal).forEach(element => {
               data.items.push({
                  id: element.id,
                  quantity: element.quantity,
                  size: element.size,
                  itemData: element.itemData,
               })
            });

            var rendered = Mustache.render(this.tmpl, data)
            THIZ.sr.innerHTML = rendered     

            THIZ.sr.querySelectorAll('[data-action^=quantity]').forEach(function(e) {
               e.addEventListener('click', function(e){
                  e.preventDefault();
                  let action = this.getAttribute('data-action');
                  let itemId = this.getAttribute('data-item-id');
                  let cart = JSON.parse(localStorage.getItem('cart'));
                  if (action === 'quantity-increase' && cart[itemId]['quantity'] > 1) {
                     cart[itemId]['quantity']--;
                  } else if (action === 'quantity-reduce' && cart[itemId]['quantity'] < 10) {
                     cart[itemId]['quantity']++;
                  }
                  localStorage.setItem('cart', JSON.stringify(cart));
                  window.dispatchEvent(new Event('cart-storage-changed'));
               })
            })
         }//fi
      }//()
   })//wcomp

})// reqs