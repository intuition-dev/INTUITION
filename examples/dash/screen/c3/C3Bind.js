class C3Bind {

   constructor() {
      this.canvas = '';
      this._data = new C3Model();
   }

   init(canvasId) {
      
      this.canvas = '#'+canvasId;
      if( this._data !=null) {
         let chartData = this._data.read();

         initC(canvasId);
         config = {
            data: {
               columns: chartData[0],
               type : 'donut',
               onclick: function (d, i) { console.info("onclick", d, i); },
               onmouseover: function (d, i) { console.info("onmouseover", d, i); },
               onmouseout: function (d, i) { console.info("onmouseout", d, i); }
            },
            donut: {
               title: "Iris Petal Width"
            }
         }
         onC3(this.canvas, config);

      }

   }

   init2(canvasId2) {
      
      this.canvas = '#'+canvasId2;
      if( this._data !=null) {
         let chartData = this._data.read();

         // console.info('chartData', chartData[1]);
         let date = [];
         let data1 = [];
         let data2 = [];

         for (let i = 0; i < chartData[1].length; i++) {
            date.push(chartData[1][i].date);
         }

         for (let i = 0; i < chartData[1].length; i++) {
            data1.push(chartData[1][i].data1);
         }

         for (let i = 0; i < chartData[1].length; i++) {
            data2.push(chartData[1][i].data2);
         }

         // console.info('date', date);
         // console.info('data1', data1);
         // console.info('data2', data2);

         initC(canvasId2);
         configTimeseries = {
            data: {
               x: 'x',
               columns: [
                  date,
                  data1,
                  data2
               ]
            },
            axis: {
               x: {
                  type: 'timeseries',
                  tick: {
                     format: '%Y-%m-%d'
                  }
               }
            }
         }
         onC3(this.canvas, configTimeseries);

      }

   }

   init3(canvasId3) {
      
      this.canvas = '#'+canvasId3;
      if( this._data !=null) {
         let chartData = this._data.read();

         // console.info('chartData', chartData[2]);
         let data1 = [];
         let data2 = [];

         for (let i = 0; i < chartData[2].length; i++) {
            data1.push(chartData[2][i].data1);
         }

         for (let i = 0; i < chartData[2].length; i++) {
            data2.push(chartData[2][i].data2);
         }

         // console.info('data1', data1);
         // console.info('data2', data2);

         initC(canvasId3);

         config = {
            data: {
               columns: [
                  data1,
                  data2
               ],
               type: 'bar'
            },
            axis: {
               y: {
                  label: { // ADD
                     text: 'Y Label',
                     position: 'outer-middle'
                  }
               },
               x: {
                  label: { // ADD
                     text: 'X Label',
                     position: 'outer-middle'
                  }
               }
            },
            bar: {
               width: {
                     ratio: 0.5 // this makes bar width 50% of length between ticks
               }
               // or
               //width: 100 // this makes bar width 100px
            },
         }

         onC3(this.canvas, config);

      }

   }

   init4(canvasId4) {
      
      this.canvas = '#'+canvasId4;
      if( this._data !=null) {
         let chartData = this._data.read();

         // console.info('chartData', chartData[3]);
         let data1 = [];
         let data2 = [];
         let data3 = [];
         let data4 = [];

         for (let i = 0; i < chartData[3].length; i++) {
            data1.push(chartData[3][i].data1);
         }

         for (let i = 0; i < chartData[3].length; i++) {
            data2.push(chartData[3][i].data2);
         }
         for (let i = 0; i < chartData[3].length; i++) {
            data3.push(chartData[3][i].data3);
         }

         for (let i = 0; i < chartData[3].length; i++) {
            data4.push(chartData[3][i].data4);
         }

         // console.info('data1', data1);
         // console.info('data2', data2);
         // console.info('data1', data3);
         // console.info('data2', data4);

         initC(canvasId4);
         
         configScatter = {
            data: {
               xs: {
                  setosa: 'setosa_x',
                  versicolor: 'versicolor_x',
               },
               // iris data from R
               columns: [
                     ["setosa_x", 3.5, 3.0, 3.2, 3.1, 3.6, 3.9, 3.4, 3.4, 2.9, 3.1, 3.7, 3.4, 3.0, 3.0, 4.0, 4.4, 3.9, 3.5, 3.8, 3.8, 3.4, 3.7, 3.6, 3.3, 3.4, 3.0, 3.4, 3.5, 3.4, 3.2, 3.1, 3.4, 4.1, 4.2, 3.1, 3.2, 3.5, 3.6, 3.0, 3.4, 3.5, 2.3, 3.2, 3.5, 3.8, 3.0, 3.8, 3.2, 3.7, 3.3],
                     ["versicolor_x", 3.2, 3.2, 3.1, 2.3, 2.8, 2.8, 3.3, 2.4, 2.9, 2.7, 2.0, 3.0, 2.2, 2.9, 2.9, 3.1, 3.0, 2.7, 2.2, 2.5, 3.2, 2.8, 2.5, 2.8, 2.9, 3.0, 2.8, 3.0, 2.9, 2.6, 2.4, 2.4, 2.7, 2.7, 3.0, 3.4, 3.1, 2.3, 3.0, 2.5, 2.6, 3.0, 2.6, 2.3, 2.7, 3.0, 2.9, 2.9, 2.5, 2.8],
                     ["setosa", 0.2, 0.2, 0.2, 0.2, 0.2, 0.4, 0.3, 0.2, 0.2, 0.1, 0.2, 0.2, 0.1, 0.1, 0.2, 0.4, 0.4, 0.3, 0.3, 0.3, 0.2, 0.4, 0.2, 0.5, 0.2, 0.2, 0.4, 0.2, 0.2, 0.2, 0.2, 0.4, 0.1, 0.2, 0.2, 0.2, 0.2, 0.1, 0.2, 0.2, 0.3, 0.3, 0.2, 0.6, 0.4, 0.3, 0.2, 0.2, 0.2, 0.2],
                     ["versicolor", 1.4, 1.5, 1.5, 1.3, 1.5, 1.3, 1.6, 1.0, 1.3, 1.4, 1.0, 1.5, 1.0, 1.4, 1.3, 1.4, 1.5, 1.0, 1.5, 1.1, 1.8, 1.3, 1.5, 1.2, 1.3, 1.4, 1.4, 1.7, 1.5, 1.0, 1.1, 1.0, 1.2, 1.6, 1.5, 1.6, 1.5, 1.3, 1.3, 1.3, 1.2, 1.4, 1.2, 1.0, 1.3, 1.2, 1.3, 1.3, 1.1, 1.3],
               ],
               type: 'scatter'
            },
            axis: {
               x: {
                     label: 'Sepal.Width',
                     tick: {
                        fit: false
                     }
               },
               y: {
                     label: 'Petal.Width'
               }
            }
         }
         onC3(this.canvas, configScatter);         

      }

   }


}