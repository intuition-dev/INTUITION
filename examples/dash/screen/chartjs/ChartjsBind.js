class ChartjsBind {
   
   constructor() {
      this.canvas = '';
      this._data = new ChartjsModel();
   }

   init(canvasId){
      
      this.canvas = '#'+canvasId;
      if( this._data !=null) {

         let chartData = this._data.read();
         let label = [];
         let bgColor = [];
         let coord = [];

         for (let i = 0; i < chartData[0].length; i++) {
            label.push(chartData[0][i].label);
         }

         for (let i = 0; i < chartData[0].length; i++) {
            bgColor.push(chartData[0][i].bgColor);
         }

         for (let i = 0; i < chartData[0].length; i++) {
            coord.push(chartData[0][i].data);
         }

         depp.require(['chartjs'], function(){

            config = {
               type: 'polarArea',
               
               data: {
                  labels: label,
                  datasets: [{
                     backgroundColor: bgColor,
                     data: coord
                  }]
               },
   
               options: {
                  responsive: false,
                  layout: {
                     padding: 20
                  },
                  maintainAspectRatio: false,
                  animation: {
                     duration: 350,
                     animateRotate: false
                  },
                  title: {
                     display: true,
                     text: 'Predicted world population (millions) in 2050'
                  },
                  legend: {
                     display: false,
                     reverse: true
                  },
                  onClick: function(c,i) {
                     e = i[0];
                     let label = this.data.labels[e._index];
                     let data = this.data.datasets[0].data[e._index];
                     let bgcolor = this.data.datasets[0].backgroundColor[e._index];

                     let maxVal = Math.max.apply(Math, this.data.datasets[0].data.map(function(o) { return o; }));

                     let style = {
                        color: 'rgb(121, 118, 118)',
                        position: 'absolute',
                        left: '5px',
                        top: '50%',
                        padding: '0 0 2px 0',
                        margin: 0,
                        transform: 'translate(-0%, -50%)',
                        fontSize: '10px'
                     };
                     let container = '#progress-bar .data';
                     $('#progress-bar').removeClass('d-hide');
                     $(container).html('');
                     $('#progress-bar .label-name').text(label);

                     let bar = new ProgressBar.Line(container, {
                        strokeWidth: 15,
                        easing: 'linear',
                        duration: 600,
                        color: bgcolor+45,
                        trailColor: '#fff',
                        trailWidth: 1,
                        svgStyle: {width: '100px', height: '100%'},
                        text: {
                           value: data,
                           style: style
                        }
                     });
                     bar.animate(data/maxVal);  // bar width according to data percent from max value
                  }
               }
            }
            initC(canvasId, config);
         });

      }
   }

   init2(canvasId){
      
      this.canvas = '#'+canvasId;
      if( this._data !=null){

         let chartData = this._data.read();
         let label = [];
         let bg = [];
         let border = [];
         let coord = [];

         for (let i = 0; i < chartData[1].length; i++) {
            label.push(chartData[1][i].label);
         }

         for (let i = 0; i < chartData[1].length; i++) {
            bg.push(chartData[1][i].bg);
         }

         for (let i = 0; i < chartData[1].length; i++) {
            border.push(chartData[1][i].border);
         }

         for (let i = 0; i < chartData[1].length; i++) {
            coord.push(chartData[1][i].data);
         }

         depp.require(['chartjs'], function(){

            config = {
               type: 'bubble',
               data: {
                  datasets: [{
                     label: label,
                     backgroundColor: bg,
                     borderColor: border,
                     data: coord
                  }]
               },
   
               options: {
                  responsive: false,
                  layout: {
                     padding: 30
                  },
                  maintainAspectRatio: false,
                  animation: {
                     duration: 350
                  },
                  title: {
                     display: true,
                     text: 'Predicted world population (millions) in 2050'
                  },
                  scales: {
                     yAxes: [{
                        scaleLabel: {
                           display: true,
                           labelString: 'Happiness'
                        }
                     }],
                     xAxes: [{
                        scaleLabel: {
                           display: true,
                           labelString: 'GDP (PPP)'
                        }
                     }]
                  },
                  onClick: function(c,i) {
                     e = i[0];
                     let label = this.data.datasets[0].label[e._index];
                     let data = this.data.datasets[0].data[e._index].r;
                     let bgcolor = this.data.datasets[0].backgroundColor[e._index];

                     let maxVal = Math.max.apply(Math, this.data.datasets[0].data.map(function(o) { return o.r; }));

                     let style = {
                        color: 'rgb(121, 118, 118)',
                        position: 'absolute',
                        left: '5px',
                        top: '50%',
                        padding: '0 0 2px 0',
                        margin: 0,
                        transform: 'translate(-0%, -50%)',
                        fontSize: '10px'
                     };
                     let container = '#progress-bar-2 .data';
                     $('#progress-bar-2').removeClass('d-hide');
                     $(container).html('');
                     $('#progress-bar-2 .label-name').text(label);

                     let bar = new ProgressBar.Line(container, {
                        strokeWidth: 15,
                        easing: 'linear',
                        duration: 600,
                        color: bgcolor,
                        trailColor: '#fff',
                        trailWidth: 1,
                        svgStyle: {width: '100px', height: '100%'},
                        text: {
                           value: data,
                           style: style
                        }
                     });
                     bar.animate(data/maxVal);  // bar width according to data percent from max value
                  }
               }
            }
            initC(canvasId, config);

         });
      }
   }
    
}