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
        
        if(this.dataSourceType == 'fake'){
            return data;
        }


    }

}