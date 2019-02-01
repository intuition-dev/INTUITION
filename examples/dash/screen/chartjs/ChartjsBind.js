class ChartjsBind {

   constructor() {
      this.canvas = '';
      this.chartjsviewModel = new ChartjsViewModel();
   }

   getViewChart(chartId, chartId2) {
      let _this = this

      Promise.all([this.chartjsviewModel.read()])
         .then(function () {
            let data1 = _this.chartjsviewModel.getViewChart(chartId)
            let data2 = _this.chartjsviewModel.getViewChart(chartId2)
            _this.setChart(data1, chartId)
            _this.setChart2(data2, chartId2)
         })
   }

   getConfig(data) {
      let chartData = data;
      let label = [];
      let bgColor = [];
      let border = [];
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
      for (let i = 0; i < chartData.length; i++) {
         border.push(chartData[i].border);
      }

      return {label: label, bgColor: bgColor, coord: coord, border: border}
   }

   setChart(data, canvasId) {
      let _this = this
      this.canvas = '#' + canvasId;
      let configData = this.getConfig(data)

      depp.require(['chartjs'], function () {
         let config = {
            type: 'polarArea',

            data: {
               labels: configData.label,
               datasets: [{
                  backgroundColor: configData.bgColor,
                  data: configData.coord
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
               onClick: function (c, i) {
                  e = i[0];
                  let label = this.data.labels[e._index];
                  let data = this.data.datasets[0].data[e._index];
                  let bgcolor = this.data.datasets[0].backgroundColor[e._index];

                  let maxVal = Math.max.apply(Math, this.data.datasets[0].data.map(function (o) {return o;}));

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
                     color: bgcolor + 45,
                     trailColor: '#fff',
                     trailWidth: 1,
                     svgStyle: {width: '100px', height: '100%'},
                     text: {
                        value: data,
                        style: style
                     }
                  });
                  bar.animate(data / maxVal);  // bar width according to data percent from max value
               }
            }
         }
         _this.initC(canvasId, config);
      });

   }

   setChart2(data, canvasId) {
      let _this = this
      this.canvas = '#' + canvasId;
      let configData = this.getConfig(data)

      depp.require(['chartjs'], function () {

         let config = {
            type: 'bubble',
            data: {
               datasets: [{
                  label: configData.label,
                  backgroundColor: configData.bgColor,
                  borderColor: configData.border,
                  data: configData.coord
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
               onClick: function (c, i) {
                  e = i[0];
                  let label = this.data.datasets[0].label[e._index];
                  let data = this.data.datasets[0].data[e._index].r;
                  let bgcolor = this.data.datasets[0].backgroundColor[e._index];

                  let maxVal = Math.max.apply(Math, this.data.datasets[0].data.map(function (o) {return o.r;}));

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
                  bar.animate(data / maxVal);  // bar width according to data percent from max value
               }
            }
         }
         _this.initC(canvasId, config);
      });
   }

   initC(chart, config) {
      var mc = document.getElementById(chart)
      let w = (window.innerWidth - 400) / 2
      let h = (window.innerHeight - 120) / 2
      mc.width = w
      mc.height = h

      var ctx = mc.getContext('2d')
      ctx.canvas.parentNode.style.width = w + 'px'
      ctx.canvas.parentNode.style.height = h + 'px'

      var myChart = new Chart(ctx, config)
      //myChart.update()
   }//()

}