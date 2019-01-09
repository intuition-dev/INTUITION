class ChartjsModel {

    dataSourceType: string = 'fake';

    read() {
        let data = [{
            label: 'Africa',
            bgColor: '#3e95cd',
            data: 2478
        },{
            label: 'Asia',
            bgColor: '#8e5ea2',
            data: 5267
        },{
            label: 'Europe',
            bgColor: '#3cba9f',
            data: 734
        },{
            label: 'Latin America',
            bgColor: '#e8c3b9',
            data: 784
        },{
            label: 'North America',
            bgColor: '#c45850',
            data: 433
        }];

        let data2 = [{
            label: 'China',
            bg: 'rgba(255,221,50,0.2)',
            border: 'rgba(255,221,50,1)',
            data: {
                x: 21269017,
                y: 5.245,
                r: 15
            }
        },{
            label: 'Denmark',
            bg: 'rgba(60,186,159,0.2)',
            border: 'rgba(60,186,159,1)',
            data: {
                x: 258702,
                y: 7.526,
                r: 10
            }
        },{
            label: 'Germany',
            bg: 'rgba(0,0,0,0.2)',
            border: '#000',
            data: {
                x: 3979083,
                y: 6.994,
                r: 15
            }
        },{
            label: 'Japan',
            bg: 'rgba(193,46,12,0.2)',
            border: 'rgba(193,46,12,1)',
            data: {
                x: 4931877,
                y: 5.921,
                r: 15
            }
        }];
        
        if(this.dataSourceType == 'fake'){
            return [data, data2];
        }


    }

}