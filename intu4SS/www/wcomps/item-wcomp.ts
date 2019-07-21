
declare var depp
declare var Mustache
// we are using 2 different technologies. Mostly Standard Web Comps. They don't have biding so we use DOT.js. or Mustache

depp.require(['poly-wcomp', 'mustache'], function(){ // inside the require

   console.log('loaded')
   var cTemp = document.createElement('template')
   cTemp.innerHTML = `
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/metabake/toolBelt@v2.0.15/bootStrap/css/bootstrapTop.css">
      <a href="{{url}}">
      <div class="card" style="max-width:400px">
         <img class="card-img-top"  />
         <div class="card-footer">
            <p>{{title}}</p>
         </div>
      </div>
      </a>
   `
   var c2Temp = document.createElement('template')
   c2Temp.innerHTML = `
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/metabake/toolBelt@v2.0.15/bootStrap/css/bootstrapTop.css">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/metabake/toolBelt@v2.0.15/bootStrap/css/bootstrap.css">
      <a href="{{url}}">
      <div class="card" style="max-width:400px">
         <img class="card-img-top" src="{{image}}"/>
         <div class="card-footer">
            <p>{{title}}</p>
         </div>
      </div>
      </a>
   `
   
   window.customElements.define('item-wcomp', class extends HTMLElement {
      sr // shadow root var
      tmpl // binding template
      constructor() {
         super()
         console.log('cons')
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
            let image = data.prefix+data.url+'/'+data.image
            var rendered = Mustache.render(this.tmpl, {title: data.title, url: data.url, image: image})
            //console.log(rendered)
            THIZ.sr.innerHTML = rendered     
         }//fi
      }//()
   })//wcomp

})// reqs