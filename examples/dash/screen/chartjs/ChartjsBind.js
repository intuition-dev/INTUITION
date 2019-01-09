class ChartjsBind {
   
   constructor() {
      this.canvas = '';
      this._data = new ChartjsModel();
   }

   init(canvasId){
      
      this.canvas = '#'+canvasId;
      if( this._data !=null){

         let chartData = this._data.read();
         // console.log('chartData', chartData);
         let label = [];
         let bgColor = [];
         let coord = [];

         for (let i = 0; i < chartData.length; i++) {
            label.push(chartData[i].label);
         }

         for (let i = 0; i < chartData.length; i++) {
            bgColor.push(chartData[i].bgColor);
         }

         for (let i = 0; i < chartData.length; i++) {
            coord.push(chartData[i].data);
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
    
}