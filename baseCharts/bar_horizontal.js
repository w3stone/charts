/**横向柱状图封装**/
import {BaseChart} from './baseChart.js';
import {BarChart} from "./bar.js";
import {makeBarData} from '../tools/makeData.js'

class BarChart_horizontal extends BaseChart {
    
    constructor(data){
        super(data);
        this.xdata = [];
        this.legenddata = [];
        this.vdata = [];
    }

    _init(perMode){
        let workedData = makeBarData(this, perMode);
        this.xdata = workedData.xdata;
        this.legenddata = workedData.legenddata;
        this.vdata = workedData.vdata;
    }

    //xAxis和yAxis互换
    _changeAxis(option){
        let temp_xAxis = JSON.parse(JSON.stringify(option.xAxis));
        option.xAxis = option.yAxis;
        option.yAxis = temp_xAxis;
    }

    //重置dataZoom
    _resetDataZoom(dataZoom){
        let dataZoom0 = dataZoom[0];
        delete dataZoom0.height;
        delete dataZoom0.bottom;
        dataZoom0.width = 30;
        dataZoom0.left = 10;
        dataZoom0.orient = "vertical";
        return [dataZoom0, dataZoom[1]];
    }


    //普通柱状图
    barNormal(barConfig, perMode, isAvg){
        this._init(perMode);

        let _data = this;
        let chartObj = new BarChart(_data);
        let option = chartObj.barNormal(barConfig, perMode, isAvg);
        this._changeAxis(option);
        
        //替换series的label位置
        let temp_series = JSON.stringify(option.series);
        temp_series = temp_series.replace(/"top"/g, '"right"');
        option.series = JSON.parse(temp_series);
        //重置dataZoom
        option.dataZoom = this._resetDataZoom(option.dataZoom);
        
        //console.log(option);
        return option;
    }

    //柱状图堆叠
    barStack(barConfig, perMode){
        this._init(perMode);

        let _data = this;
        let chartObj = new BarChart(_data);
        let option = chartObj.barStack(barConfig, perMode);
        this._changeAxis(option);

        //替换series的label位置
        let temp_series = JSON.stringify(option.series);
        temp_series = temp_series.replace(/"left"/g, '"top"');
        temp_series = temp_series.replace(/"right"/g, '"bottom"');
        option.series = JSON.parse(temp_series);
        
        //console.log(option);
        return option;
    }

    //各类占比柱状图(动态求和)
    barDynamic(chart, barConfig){
        this._init();

        let _data = this;
        let chartObj = new BarChart(_data);
        let option = chartObj.barDynamic(chart, barConfig);
        this._changeAxis(option);

        //重置dataZoom
        option.dataZoom = this._resetDataZoom(option.dataZoom);

        return option;
    }
}

//导出
export { BarChart_horizontal }
