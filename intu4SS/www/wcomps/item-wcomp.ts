
declare var depp
declare var Mustache
// we are using 2 different technologies. Mostly Standard Web Comps. They don't have biding so we use DOT.js. or Mustache

depp.require(['poly-wcomp', 'mustache'], function(){ // inside the require

   console.log('loaded')
   var cTemp = document.createElement('template')
   cTemp.innerHTML = `
      <b>I'm Comp DOM!</b>
      Title
      Image
      href
      Hello {{ Title }}
   `
   
   window.customElements.define('item-wcomp', class extends HTMLElement {
      sr // shadow root var
      tmpl // binding template
      constructor() {
         super()

         console.log('cons')

         this.sr = this.attachShadow({mode: 'open'})
         this.sr.appendChild(cTemp.content.cloneNode(true))
         this.tmpl =cTemp.innerHTML

      }//cons

      //register properties w/ reflection to attributes
      static get observedAttributes() { return ['data'] }
      attributeChangedCallback(aName, oldVal, newVal) { // handler
         console.log(aName, newVal)

         if('data'==aName) {
           let data = JSON.parse(newVal)
            
            var rendered = Mustache.render(this.tmpl, {Title: data.title})
            //console.log(newVal, rendered)
            this.sr.innerHTML = rendered     

         }//fi

      }//()
   })//wcomp

})// reqs