/**饼图封装**/
import {BaseChart} from './baseChart.js'
import {makePieData} from '../tools/makeData.js'

class PieChart extends BaseChart {
    
    constructor(data){
        super(data);
        this.legenddata = [];
    }

    _init(){
        let workedData = makePieData(this.chartData);
        this.legenddata = workedData.legenddata;
        this.chartData = workedData.chartData;
    }

    //占比饼图
    pie(pieConfig){
        this._init();
        let series = [];

        //其它series配置项
        let config = {
            name: '占比',
            type: 'pie',
            label: { 
                normal: { 
                    show: pieConfig.pieLabelShow,
                    formatter: '{b}({d}%)',
                    fontSize: 16
                } 
            },
            radius: [pieConfig.innerRadius, pieConfig.outerRadius],
            center: [pieConfig.xCenter, pieConfig.yCenter],
            data: this.chartData
        }
        series.push(config);

        let option = {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            series: series
        };
        
        return option;
    }

}

//导出
export { PieChart }