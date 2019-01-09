class Nvd3Model {
    constructor() {
        this.dataSourceType = 'fake';
    }
    read() {
        if (this.dataSourceType == 'fake') {
            function sinAndCos() {
                var sin = [], sin2 = [], cos = [];
                for (var i = 0; i < 100; i++) {
                    sin.push({ x: i, y: Math.sin(i / 10) });
                    sin2.push({ x: i, y: Math.sin(i / 10) * 0.25 + 0.5 });
                    cos.push({ x: i, y: .5 * Math.cos(i / 10) });
                }
                return [{
                        values: sin,
                        key: 'Sine Wave',
                        color: '#ff7f0e'
                    }, {
                        values: cos,
                        key: 'Cosine Wave',
                        color: '#2ca02c'
                    }, {
                        values: sin2,
                        key: 'Another sine wave',
                        color: '#7777ff',
                        area: true
                    }];
            }
            return sinAndCos();
        }
    }
}
