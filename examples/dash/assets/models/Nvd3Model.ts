class Nvd3Model {

    dataSourceType: string = 'fake';

    read() {
         
         if(this.dataSourceType == 'fake'){
            /**************************************
             * Simple test data generator
             */
            function sinAndCos() {
                var sin = [],sin2 = [],
                      cos = [];
    
                //Data is represented as an array of {x,y} pairs.
                for (var i = 0; i < 100; i++) {
                   sin.push({x: i, y: Math.sin(i/10)});
                   sin2.push({x: i, y: Math.sin(i/10) *0.25 + 0.5});
                   cos.push({x: i, y: .5 * Math.cos(i/10)});
                }
    
                //Line chart data should be sent as an array of series objects.
                return [{
                   values: sin,      //values - represents the array of {x,y} data points
                   key: 'Sine Wave', //key  - the name of the series.
                   color: '#ff7f0e'  //color - optional: choose your own line color.
                },{
                   values: cos,
                   key: 'Cosine Wave',
                   color: '#2ca02c'
                },{
                   values: sin2,
                   key: 'Another sine wave',
                   color: '#7777ff',
                   area: true      //area - set to true if you want this line to turn into a filled area chart.
                }];
            }
            return sinAndCos();
        }
    }

}