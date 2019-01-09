class ChartjsBind {
   
   constructor() {
      this.canvas = '';
      this._data = new ChartjsModel();
   }

   init(canvasId){
      
      this.canvas = '#'+canvasId;
      if( this._data !=null) {

         let chartData = this._data.read();
         // console.log('chartData', chartData[0]);
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

         // console.log('label', label);
         // console.log('bgColor', bgColor);
         // console.log('coord', coord);

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
         // console.log('chartData', chartData[1]);
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

         // console.log('label', label);
         // console.log('bgColor', bg);
         // console.log('border', border);
         // console.log('coord', coord);

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
                  }
               }
            }
            initC(canvasId, config);

         });
      }
   }
    
}