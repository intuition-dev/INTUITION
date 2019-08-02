
declare var depp
declare var Mustache
// we are using 2 different technologies. Mostly Standard Web Comps. They don't have biding so we use DOT.js. or Mustache

depp.require(['poly-wcomp', 'mustache'], function(){ // inside the require

   console.log('loaded')
   var cTemp = document.createElement('template')
   cTemp.innerHTML = `
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/intuition-dev/toolBelt@v1.2.1/bootStrap/css/bootstrapTop.css">
      <div itemId={{id}}>
         <span>{{itemData.item.name}}</span>
         <span>{{size}}</span>
         <span>{{quantity}}</span>
      </div>
   `
   var c2Temp = document.createElement('template')
   c2Temp.innerHTML = `
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/intuition-dev/toolBelt@v1.2.1/bootStrap/css/bootstrapTop.css">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/intuition-dev/toolBelt@v1.2.1/bootStrap/css/bootstrap.css">
      <div itemId={{id}}>
         <span>{{itemData.item.name}}</span>
         <span>{{size}}</span>
         <span>{{quantity}}</span>
      </div>
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
            var rendered = Mustache.render(this.tmpl, {id: data.id, quantity: data.quantity, size: data.size, itemData: data.itemData})
            THIZ.sr.innerHTML = rendered     
         }//fi
      }//()
   })//wcomp

})// reqs