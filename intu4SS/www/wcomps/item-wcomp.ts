

console.log('loaded')
// we are using 2 different technologies. Mostly Standard Web Comps. They don't have biding so we use DOT.js - but could have used mustache

var cTemp = document.createElement('template')
cTemp.innerHTML = `
   <b>I'm Comp DOM!</b>
   Title
   Image
   href
`

window.customElements.define('c-wcomp', class extends HTMLElement {
   sr // shadow root var
   constructor() {
      super()
      console.log('cons')

      this.sr = this.attachShadow({mode: 'open'})
      this.sr.appendChild(cTemp.content.cloneNode(true))

   }//cons
      
   //register properties w/ reflection to attributes
   static get observedAttributes() { return ['bla'] }
   attributeChangedCallback(aName, oldVal, newVal) { // handler
      console.log('comp received message', aName, newVal)
   }//()

})//wcomp