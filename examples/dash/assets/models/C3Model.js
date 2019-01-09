class C3Model {
    constructor() {
        this.dataSourceType = 'fake';
    }
    read() {
        let data = [
            ['data1', 30],
            ['data2', 120],
        ];
        let data2 = [{
                date: 'x',
                data1: 'data1',
                data2: 'data2'
            }, {
                date: '2013-01-01',
                data1: 30,
                data2: 130
            }, {
                date: '2013-01-02',
                data1: 200,
                data2: 340
            }, {
                date: '2013-01-03',
                data1: 100,
                data2: 200
            }, {
                date: '2013-01-04',
                data1: 400,
                data2: 500
            }, {
                date: '2013-01-05',
                data1: 150,
                data2: 250
            }, {
                date: '2013-01-06',
                data1: 250,
                data2: 350
            }];
        let data3 = [];
        let data4 = [];
        if (this.dataSourceType == 'fake') {
            return [data, data2, data3, data4];
        }
    }
}
