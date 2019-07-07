class VegaBind {

   constructor() {
      this.canvas = '';
      this.vegaViewModel = new VegaViewModel();
   }

   getViewChart(vegaId) {
      let _this = this
      let spec = this.getSpec()

      Promise.all([this.vegaViewModel.read()])
         .then(function () {

            const data = new Array.from(_this.vegaViewModel.getViewChart());

            depp.require(['vega'], function () {

               var view = new vega.View(vega.parse(spec))
                  .logLevel(vega.Warn) // set view logging level
                  .initialize(document.querySelector('#' + vegaId)) // set parent DOM element
                  .renderer('canvas') // set render type (defaults to 'canvas')
                  .hover(); // enable hover event processing, *only call once*!

               view.insert('table', data)

               view.runAsync()
            })


         })
   }

   getSpec() {
      return {
         "width": 600,
         "height": 200,
         "padding": 20,
         "data": [
            {
               "name": "table",
               "values": []
            }],
         "signals": [
            {
               "name": "tooltip",
               "value": {},
               "on": [
                  {
                     "events": "rect:mouseover",
                     "update": "datum"
                  },
                  {
                     "events": "rect:mouseout",
                     "update": "{}"
                  }
               ]
            }
         ],
         "scales": [
            {
               "name": "xscale",
               "type": "band",
               "domain": {
                  "data": "table",
                  "field": "category"
               },
               "range": "width",
               "padding": 0.05,
               "round": true
            },
            {
               "name": "yscale",
               "domain": {
                  "data": "table",
                  "field": "amount"
               },
               "nice": true,
               "range": "height"
            }
         ],
         "axes": [
            {
               "orient": "bottom",
               "scale": "xscale"
            },
            {
               "orient": "left",
               "scale": "yscale"
            }
         ],
         "marks": [
            {
               "type": "rect",
               "from": {
                  "data": "table"
               },
               "encode": {
                  "enter": {
                     "x": {
                        "scale": "xscale",
                        "field": "category"
                     },
                     "width": {
                        "scale": "xscale",
                        "band": 1
                     },
                     "y": {
                        "scale": "yscale",
                        "field": "amount"
                     },
                     "y2": {
                        "scale": "yscale",
                        "value": 0
                     }
                  },
                  "update": {
                     "fill": {
                        "value": "steelblue"
                     }
                  },
                  "hover": {
                     "fill": {
                        "value": "red"
                     }
                  }
               }
            },
            {
               "type": "text",
               "encode": {
                  "enter": {
                     "align": {
                        "value": "center"
                     },
                     "baseline": {
                        "value": "bottom"
                     },
                     "fill": {
                        "value": "#333"
                     }
                  },
                  "update": {
                     "x": {
                        "scale": "xscale",
                        "signal": "tooltip.category",
                        "band": 0.5
                     },
                     "y": {
                        "scale": "yscale",
                        "signal": "tooltip.amount",
                        "offset": -2
                     },
                     "text": {
                        "signal": "tooltip.amount"
                     },
                     "fillOpacity": [
                        {
                           "test": "datum === tooltip",
                           "value": 0
                        },
                        {
                           "value": 1
                        }
                     ]
                  }
               }
            }
         ]
      }
   }
}