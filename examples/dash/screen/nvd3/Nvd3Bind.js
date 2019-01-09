class Nvd3Bind {
    
   constructor() {
      this.canvas = '';
      this._data = new Nvd3Model();
   }

   init(canvasId) {

      if( this._data !=null){

         // console.info('this._data.read()', this._data.read());
         let chartData = this._data.read();

         /*These lines are all chart setup.  Pick and choose which chart features you want to utilize. */
         nv.addGraph(function() {
            var chart = nv.models.lineChart()
               .margin({left: 100})  //Adjust chart margins to give the x-axis some breathing room.
               .useInteractiveGuideline(true)  //We want nice looking tooltips and a guideline!
               //.transitionDuration(350)  //how fast do you want the lines to transition?
               .showLegend(true)       //Show the legend, allowing users to turn on/off line series.
               .showYAxis(true)        //Show the y-axis
               .showXAxis(true)        //Show the x-axis
            ;

            chart.xAxis     //Chart x-axis settings
               .axisLabel('Time (ms)')
               .tickFormat(d3.format(',r'));

            chart.yAxis     //Chart y-axis settings
               .axisLabel('Voltage (v)')
               .tickFormat(d3.format('.02f'));

            /* Done setting the chart up? Time to render it!*/
            var myData = chartData;   //You need data...

            d3.select('#'+canvasId+' svg')    //Select the <svg> element you want to render the chart in.
               .datum(myData)         //Populate the <svg> element with chart data...
               .call(chart);          //Finally, render the chart!

            //Update the chart when window resizes.
            nv.utils.windowResize(function() { chart.update() });
            return chart;
         });

      }
      
   }
     
}