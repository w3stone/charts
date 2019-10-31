/**折线图封装**/
import {BaseChart} from './baseChart.js'
import {makeLineData} from '../tools/makeData.js'
import {mergeJson} from '../tools/otherFn.js'


class LineChart extends BaseChart{
    //构建器
    constructor(data){
        super(data);
        this.xdata = [];
        this.legenddata = [];
        this.vdata = [];
    }

    _init(){
        let workedData = makeLineData(this.chartData);
        this.xdata = workedData.xdata;
        this.legenddata = workedData.legenddata;
        this.vdata = workedData.vdata;
    }

    //基础配置
    _baseLineOption(lineConfig){
        if(lineConfig.ifMobile){
            return this._baseLineOption_mobile(lineConfig);
        }else{
            return this._baseLineOption_pc(lineConfig);
        }
    }

    //基础配置详情(pc端)
    _baseLineOption_pc(lineConfig){
        let axis_Base = this._setBaseAxis(lineConfig); //x轴/y轴基础配置
        let xAxis_Own = { //x轴配置
            name: this.setTitle(this.xTitle, this.xUnit),
            nameLocation: 'end',
            type: 'category',
            data: this.xdata,
            axisLabel: {
                interval:0, 
                rotate: 30,
                formatter: name => {
                    return this.setxNameOmit(name, lineConfig.xMaxLength);
                }
            }
        }
        let yAxis_Own = { //y轴配置
            name: this.setTitle(this.yTitle , this.yUnit),
            type: 'value',
            axisLabel: {
                formatter: value => {
                    return this.setUnit(value);
                }
            }
        }

        let option = {
            legend: this._setBaseLegend(lineConfig, this.legenddata),
            tooltip: {
                trigger: 'axis',
                axisPointer: {          
                    type: 'shadow'     
                },
                formatter: p => {
                    let result = this._setTooltipTitle(p[0].name, this.xUnit);
                    for(let i=0; i<p.length; i++){
                        if(p[i].seriesName.indexOf("增长率")!=-1){ //???
                            result += p[i].seriesName + ": " + p[i].value + "%</br>";
                        }else{
                            result += p[i].seriesName + ": " + p[i].value + this.vUnit + "</br>";
                        }
                    }
                    return result;
                },
            },
            grid: {
                top:'20%',
                left: '2%',
                right: '6%',
                bottom: '0%',
                containLabel: true
            },
            xAxis: [mergeJson(axis_Base, xAxis_Own)],
            yAxis: [mergeJson(axis_Base, yAxis_Own)],
            series: []
        };
        
        //显示滚动条
        let legenddataLength = !(this.chartType==105 || this.chartType==113)? this.legenddata.length: 1; //如果数据堆叠，legenddata长度算1
        let showMax = 20; //柱图数量超过该数值，显示滚动条
        
        if((this.xdata.length*legenddataLength > showMax) && !this.yearOrMonth(this.xUnit)){ //触发规则?
            let tempIndex = parseInt(showMax/this.legenddata.length);
            let endIndex = !(this.xdata.length>5 && legenddataLength>10)? 
                (this.legenddata.length<showMax? tempIndex-1: tempIndex): 4;

            option.grid.bottom = "5%";
            option.dataZoom = this._setDataZoom(lineConfig, endIndex);
        }

        return option;
    }

    //基础配置详情(移动端)
    _baseLineOption_mobile(lineConfig){
        let option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {          
                    type: 'shadow'     
                },
                formatter: (p)=>{
                    let result = this._setTooltipTitle(p[0].name, this.xUnit);
                    for(let i=0; i<p.length; i++){
                        if(p[i].seriesName.indexOf("增长率")!=-1){ //???
                            result += p[i].seriesName + ": " + p[i].value + "%</br>";
                        }else{
                            result += p[i].seriesName + ": " + p[i].value + this.vUnit + "</br>";
                        }
                    }
                    return result;
                },
            },
            grid: {
                top:'20%',
                left: '5%',
                right: '10%',
                bottom: '10%',
                containLabel: true
            },
            xAxis: [
                {
                    name: this.setTitle(this.xTitle, this.xUnit),
                    nameTextStyle:{
                        color: lineConfig.axisTitleFontColor,
                        fontSize: lineConfig.axisTitleFontSize
                    },
                    nameLocation: 'center', 
                    nameGap: 25,
                    type: 'category',
                    axisLine:{lineStyle:{color:'#000'}},
                    data: this.xdata,
                    axisLabel: {
                        interval:0, 
                        rotate: 0,
                        formatter: (name)=>{
                            return this.setxNameOmit(name, lineConfig.xMaxLength);
                        },
                        textStyle:{
                            color: lineConfig.axisFontColor,
                            fontSize: lineConfig.axisFontSize
                        }
                    }
                }
            ],
            yAxis: [
                {
                    name: this.setTitle(this.yTitle , this.yUnit),
                    nameTextStyle:{
                        color: lineConfig.axisTitleFontColor,
                        fontSize: lineConfig.axisTitleFontSize
                    },
                    type: 'value',
                    axisLine:{lineStyle:{color:'#000'}},
                    axisLabel: {
                        textStyle:{
                            color: lineConfig.axisFontColor,
                            fontSize: lineConfig.axisFontSize
                        },
                        formatter: (value)=>{
                            return this.setUnit(value);
                        }
                    }
                }
            ],
            series: []
        };
        
        //显示滚动条? 
        if(!this.yearOrMonth(this.xUnit)){
            let endIndex = this.xdata.length>4? 3: this.xdata.length-1;
            option.dataZoom = this._setDataZoom(lineConfig, endIndex);
        }

        return option;
    }

    
    //普通折线图
    line(lineConfig, isAvg){
        this._init();
        let series = [];

        //设置series配置项
        this.vdata.forEach((val, index) => {
            let bs = {
                name: this.legenddata[index],
                type: 'line',
                animation: lineConfig.animation, //动画效果
                data: val,
                label: this._setLabelTop(lineConfig)
            };

            //添加平均线
            if(isAvg){
                bs.markLine = {
                    lineStyle: {
                        normal: {color:'#fc97af'}
                    },
                    label: {
                        normal: {
                            position: 'start',
                            formatter: (data)=>{
                                return this.setUnit(data.value);
                            }
                        }
                    },
                    data: [{
                        name: '平均值',
                        type: 'average'
                    }]
                };
            }
            series.push(bs);
        });
        
        let option = this._baseLineOption(lineConfig);
        option.series = series;
        
        return option;
    }

}

//导出
export { LineChart }