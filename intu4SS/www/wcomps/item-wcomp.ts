
declare var depp
declare var Mustache

// we are using 2 different technologies. Mostly Standard Web Comps. They don't have biding so we use DOT.js or mustache

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

   window.customElements.define('c-wcomp', class extends HTMLElement {
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
      static get observedAttributes() { return ['title','image','href'] }
      attributeChangedCallback(aName, oldVal, newVal) { // handler
         console.log('comp received message', aName, newVal)
         //binding:
         switch(aName) {
            case 'title':
               var rendered = Mustache.render(this.tmpl, {Title: newVal})
               //console.log(newVal, rendered)
               this.sr.innerHTML = rendered     
               break
            case 'image':
            case 'href':
         }
   

      }//()
   })//wcomp

})// reqs