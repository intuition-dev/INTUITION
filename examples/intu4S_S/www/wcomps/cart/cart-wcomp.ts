
declare var depp
declare var Mustache
// we are using 2 different technologies. Mostly Standard Web Comps. They don't have biding so we use DOT.js. or Mustache

depp.require(['poly-wcomp', 'mustache'], function(){ // inside the require

   console.log('loaded')
   var cTemp = document.createElement('template')
   cTemp.innerHTML = `
      {{#items}}
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/intuition-dev/toolBelt@v1.2.3/bootStrap/css/bootstrapTop.css">
      <div class="card d-flex row mb-2" itemId={{id}}>
         <div class="col-3">
            <img src={{image}} alt="Card image cap">
         </div>
         <div class="card-body col-9">
            <h5 class="card-title">{{itemData.item.name}}</h5>
            <h6 class="card-subtitle mb-2 text-muted">Size: {{size}}</h6>
            <p class="card-text">Quantity: {{quantity}}</p>
            <p class="card-text">Price: $\{{cost}}</p>
            <a href={{url}} class="card-link mt-3">View item</a>
         </div>
      </div>

      <style>
         img {
            width: 200px;
            max-width: 100%;
         }
         .card {
            flex-direction: row;
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
      </style>
      {{/items}}
   `
   var c2Temp = document.createElement('template')
   c2Temp.innerHTML = `
      {{#items}}
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/intuition-dev/toolBelt@v1.2.3/bootStrap/css/bootstrapTop.css">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/intuition-dev/toolBelt@v1.2.3/bootStrap/css/bootstrap.css">
      <div class="card d-flex row mb-2" itemId={{id}}>
         <div class="col-3">
            <img src={{image}} alt="Card image cap">
         </div>
         <div class="card-body col-9">
            <h5 class="card-title">{{itemData.item.name}}</h5>
            <h6 class="card-subtitle mb-2 text-muted">Size: {{size}}</h6>
            <p class="card-text">Quantity: {{quantity}}</p>
            <p class="card-text">Price: $\{{cost}}</p>
            <a href={{url}} class="card-link mt-3">View item</a>
         </div>
      </div>

      <style>
         img {
            width: 200px;
            max-width: 100%;
         }
         .card {
            flex-direction: row;
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
      </style>
      {{/items}}
   `
   
   window.customElements.define('cart-wcomp', class extends HTMLElement {
      sr // shadow root var
      tmpl // binding template
      constructor() {
         super()
         console.log('CART WCOMP')
         this.sr = this.attachShadow({mode: 'open'})
         this.sr.appendChild(cTemp.content.cloneNode(true))
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
                  // console.log('DATA.url', data, this);
                  return data;
               },
               image: function() { 
                  let data = this.itemData.prefix + this.itemData.url + '/' + this.itemData.image;
                  // console.log('DATA.image', data, this);
                  return data;
               },
               cost: function() { 
                  let data = this.itemData.item.price * this.quantity;
                  // console.log('DATA.cost', data, this);
                  return data;
               }
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
            console.log('DATA ====> ', data)

            var rendered = Mustache.render(this.tmpl, data)
            THIZ.sr.innerHTML = rendered     
         }//fi
      }//()
   })//wcomp

})// reqs