/**散点图封装**/
import {BaseChart} from './baseChart.js'
import {makeScatterData} from '../tools/makeData.js'

class ScatterChart extends BaseChart {

    constructor(data){
        super(data);
        this.legenddata = [];
        this.valueMax = 0;
        this.valueMax = 0;
        this.xMin = 0;
        this.xMax = 0;
        this.yMin = 0;
        this.yMax = 0;
        this.defaultSymbolSize = 0; //默认散点大小
    }

    //初始化
    _init(scatterConfig){
        let workedData = makeScatterData(this.chartData, this.nUnit);
        this.legenddata = workedData.legenddata;
        this.chartData = workedData.chartData;
        this.valueMax = workedData.valueMax; //value最大值
        this.xMin = workedData.xMin;
        this.xMax = workedData.xMax;
        this.yMin = workedData.yMin;
        this.yMax = workedData.yMax;
        this.defaultSymbolSize = scatterConfig.symbolSize; //默认散点大小
    }

    //基础配置
    _baseScatterOption(){
        let option = {
            legend: {
                data: this.legenddata,
                type: 'scroll',
                top: '8%'
            },
            tooltip: {
                trigger: 'item',
                axisPointer: {
                    show: true,
                    type: 'cross',
                    lineStyle: {
                        type: 'dashed',
                        width: 1
                    },
                },
                formatter: obj => {
                    //console.log(obj);
                    if (obj.componentType == "series") {
                        let result =  '<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 18px;padding-bottom: 7px;margin-bottom: 7px">' +
                            obj.name + '</div>' +
                            '<span>' + this.xTitle + ': ' + obj.data.value[0] + this.xUnit + '</span><br/>' +
                            '<span>' + this.yTitle + ': ' + obj.data.value[1] + this.yUnit + '</span>';
                        //还原value
                        if(this.valueMax){ 
                            result += '<br/><span>' + this.vTitle + ': ' 
                            + (obj.data.symbolSize*this.valueMax/this.defaultSymbolSize).toFixed(2) + this.vUnit +  '</span>'; 
                        }
                        return result;
                    }
                }
            },
            label: {
                normal: {
                    show: true,
                    position: 'bottom',
                    formatter: params => {
                        return params.name
                    }
                },
                emphasis: {
                    show: true,
                    position: 'bottom',
                }
            },
            xAxis: {
                name: this.setTitle(this.xTitle, this.xUnit),
                type: 'value',
                scale: true,
                min: (this.xUnit!="%")? parseInt(0.85*this.xMin): parseInt((this.xMin-15)),
                max: (this.xUnit!="%")? parseInt(1.15*this.xMax): parseInt((this.xMax+15)),
                nameTextStyle:{
                    fontSize: 14
                },
                axisLabel: {
                    formatter: '{value}'
                },
                splitLine: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: '#3259B8'
                    }
                }
            },
            yAxis: {
                name: this.setTitle(this.yTitle, this.yUnit),
                type: 'value',
                scale: true,
                min: (this.yUnit!="%")? parseInt(0.85*this.yMin): parseInt((this.yMin-15)),
                max: (this.yUnit!="%")? parseInt(1.15*this.yMax): parseInt((this.yMax+15)),
                nameTextStyle:{
                    fontSize: 14
                },
                axisLabel: {
                    formatter: '{value}'
                },
                splitLine: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: '#3259B8'
                    }
                }
            },
            grid: {
                top:'20%',
                left: '6%',
                right: '8%',
                bottom: '6%',
                containLabel: true
            }
        };

        return option;
    }

    //设置每一个散点实际大小
    _setItemSymbolSize(value){
        return this.valueMax? (value/this.valueMax)*this.defaultSymbolSize :this.defaultSymbolSize; //实际散点大小
    }
    
    //普通散点图(颜色不同)
    scatter(scatterConfig){
        this._init(scatterConfig);
        let series = [];
        let sourceData = this.chartData;

        //拼接数据
        sourceData.forEach(item => {
            if(item.name=="平均值"){ //平均值
                let av = {
                    name: item.name,
                    type: 'scatter',
                    markLine: {
                        label: {
                            normal: {
                                //fontSize: 14,
                                formatter: (params) => {
                                    return params.name + ": \n" + params.value;
                                }
                            }
                        },
                        lineStyle:{
                            normal:{ type: "solid" }
                        },
                        data: [
                            {
                                name: this.xTitle + item.name,
                                xAxis: item.x
                            },
                            {
                                name: this.yTitle + item.name,
                                yAxis: item.y
                            }
                        ]
                    }  
                }
                series.push(av);

            }else{ //非平均值
                let bs = {
                    name: item.name,
                    type: 'scatter',
                    data: [{
                        name: item.name,
                        value: [item.x, item.y],
                        label:{
                            normal:{
                                fontSize: 14
                            }
                        },
                        symbolSize: this._setItemSymbolSize(item.value) //散点大小
                    }]
                } 
                series.push(bs);
            }
        });

        let option = this._baseScatterOption();
        option.series = series;

        return option;
    }


    //散点图(相同颜色)
    scatterSameColor(scatterConfig){
        this._init(scatterConfig);
        let seriesData = [];
        let series = [];
        let sourceData = this.chartData;

        //拼接数据
        sourceData.forEach(item => {
            if(item.name=="平均值"){ //平均值
                let av = {
                    name: item.name,
                    type: 'scatter',
                    data:[{
                        name: item.name,
                        value: [item.x, item.y],
                        symbolSize: 0
                    }],
                    markLine: {
                        label: {
                            normal: {
                                //fontSize: 14,
                                formatter: (params) => {
                                    return params.name + ": \n" + params.value;
                                }
                            }
                        },
                        lineStyle:{
                            normal:{
                                type: "solid"
                            }
                        },
                        data: [
                            {
                                name: this.xTitle + item.name,
                                xAxis: item.x
                            },
                            {
                                name: this.yTitle + item.name,
                                yAxis: item.y
                            }
                        ]
                    }  
                }
                series.push(av);

            }else{
                let each = {
                    name: item.name,
                    value: [item.x, item.y],
                    label:{
                        normal:{
                            fontSize: 14
                        }
                    },
                    symbolSize: this._setItemSymbolSize(item.value) //散点大小
                }
                seriesData.push(each);
            }
        });

        //所有散点图
        let bs = {
            name: "散点图",
            type: 'scatter',
            data: seriesData
        } 
        series.push(bs);

        //
        let option = this._baseScatterOption();
        option.series = series;

        return option;
    }


    //散点图(自动求平均, 颜色不同)
    scatterAutoAvg(scatterConfig){
        this._init(scatterConfig);
        let legenddata = [];
        let series = [];
        let sourceData = this.chartData;

        let avgX = Enumerable.from(sourceData).sum(o=>parseFloat(o.x)) /sourceData.length;
        let avgY = Enumerable.from(sourceData).sum(o=>parseFloat(o.y)) /sourceData.length;

        let av = {
            name: "平均值",
            type: 'scatter',
            markLine: {
                label: {
                    normal: {
                        formatter: (params) => {
                            return params.name + ": \n" + params.value;
                        }
                    }
                },
                lineStyle:{
                    normal:{ type: "solid" }
                },
                data: [
                    {
                        name: this.xTitle + "平均值",
                        xAxis: avgX
                    },
                    {
                        name: this.yTitle + "平均值",
                        yAxis: avgY
                    }
                ]
            }  
        }
        series.push(av);

        //拼接数据
        sourceData.forEach(item => {
            legenddata.push(item.name);
            let bs = {
                name: item.name,
                type: 'scatter',
                data: [{
                    name: item.name,
                    value: [item.x, item.y],
                    label:{
                        normal:{
                            fontSize: 14
                        }
                    },
                    symbolSize: this._setItemSymbolSize(item.value) //散点大小
                }]
            } 
            series.push(bs);
        });

        let option = this._baseScatterOption();
        option.series = series;

        return option;
    }

}

//导出
export {ScatterChart}
