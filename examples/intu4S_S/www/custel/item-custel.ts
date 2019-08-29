
declare var depp
declare var Mustache
// we are using 2 different technologies. Mostly Standard Custom Elements. They don't have biding so we use Mustache

depp.require(['poly-custel', 'mustache'], function () { // inside the require

   console.log('loaded')
   var cTemp = document.createElement('template')
   cTemp.innerHTML = `
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/intuition-dev/toolBelt@v1.8.27/bootStrap/css/bootstrapTop.css">
      <a href="{{url}}">
      <div class="card m-1" style="max-width:400px">
         <img class="card-img-top"  />
         <div class="card-footer">
            <p>{{title}}</p>
         </div>
      </div>
      </a>
      <style>
         .card * {
            color: #24242b;
            font-size: 16px;
         }
         .card, .card-footer {
            height: 100%;
         }
      </style>
   `
   var c2Temp = document.createElement('template')
   c2Temp.innerHTML = `
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/intuition-dev/toolBelt@v1.8.27/bootStrap/css/bootstrapTop.css">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/intuition-dev/toolBelt@v1.8.27/bootStrap/css/bootstrap.css">
      <a href="{{url}}">
      <div class="card m-1" style="max-width:400px">
         <img class="card-img-top" src="{{image}}"/>
         <div class="card-footer">
            <p>{{title}}</p>
         </div>
      </div>
      </a>
      <style>
         .card * {
            color: #24242b;
            font-size: 16px;
         }
         .card, .card-footer {
            height: 100%;
         }
      </style>
   `

   window.customElements.define('item-custel', class extends HTMLElement {
      sr // shadow root var
      tmpl // binding template
      constructor() {
         super()
         console.log('cons')
         this.sr = this.attachShadow({ mode: 'open' })
         this.sr.appendChild(cTemp.content.cloneNode(true))
         this.tmpl = c2Temp.innerHTML
      }//cons

      //register properties w/ reflection to attributes
      static get observedAttributes() { return ['data'] }
      attributeChangedCallback(aName, oldVal, newVal) { // handler
         console.log(aName, newVal)

         if ('data' == aName) {
            const THIZ = this
            let data = JSON.parse(newVal)
            let image = data.prefix + data.url + '/' + data.image
            var rendered = Mustache.render(this.tmpl, { title: data.title, url: data.prefix + data.url, image: image })
            THIZ.sr.innerHTML = rendered
         }//fi
      }//()
   })//custel

})// reqs