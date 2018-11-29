/**散点图封装**/
import {BaseChart} from './baseChart.js'

class ScatterChart extends BaseChart {

    constructor(data){
        super(data);
    }

    //基础配置
    _baseScatterOption(defaultSymbolSize, max, legenddata){
        let option = {
            legend: {
                data: legenddata,
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
                        var result =  '<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 18px;padding-bottom: 7px;margin-bottom: 7px">' +
                            obj.name + '</div>' +
                            '<span>' + this.xTitle + ':' + obj.data.value[0] + this.xUnit + '</span><br/>' +
                            '<span>' + this.yTitle + ':' + obj.data.value[1] + this.yUnit + '</span>';
                        //还原value
                        if(max){ result += '<br/><span>' + this.vTitle + ':' + (obj.data.symbolSize*max/defaultSymbolSize).toFixed(2) + this.vUnit +  '</span>'; }
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
    
    //普通散点图(颜色不同)
    scatter(scatterConfig){
        let legenddata = [];
        let series = [];

        let sourceData = this.chartData;
        let defaultSymbolSize = scatterConfig.symbolSize; //默认气泡图大小

        let max = sourceData.length>0? Enumerable.from(sourceData).select(o=>o.value).max(): 0; //value最大值

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
                        symbolSize: max? (item.value/max)*defaultSymbolSize :defaultSymbolSize //散点大小
                    }]
                } 
                series.push(bs);
            }
            legenddata.push(item.name);
        });

        let option = this._baseScatterOption(defaultSymbolSize, max, legenddata);
        option.series = series;

        return option;
    }


    //散点图(相同颜色)
    scatterSameColor(scatterConfig){
        let legenddata = [];
        let seriesData = [];
        let series = [];

        let sourceData = this.chartData;
        let defaultSymbolSize = scatterConfig.symbolSize; //默认气泡图大小
        
        let max = sourceData.length>0? Enumerable.from(sourceData).select(o=>o.value).max(): 0; //value最大值

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
                    symbolSize: max? (item.value/max)*defaultSymbolSize :defaultSymbolSize //散点大小
                }
                seriesData.push(each);
            }
            legenddata.push(item.name); 
        });

        //所有散点图
        let bs = {
            name: "散点图",
            type: 'scatter',
            data: seriesData
        } 
        series.push(bs);

        //
        let option = this._baseScatterOption(defaultSymbolSize, max, legenddata);
        option.series = series;

        return option;
    }


    //散点图(自动求平均, 颜色不同)
    scatterAutoAvg(scatterConfig){
        let legenddata = [];
        let series = [];

        let sourceData = this.chartData;
        let defaultSymbolSize = scatterConfig.symbolSize; //默认气泡图大小
        let max = sourceData.length>0? Enumerable.from(sourceData).select(o=>o.value).max(): 0; //value最大值

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
                    symbolSize: max? (item.value/max)*defaultSymbolSize :defaultSymbolSize //散点大小
                }]
            } 
            series.push(bs);
        });

        let option = this._baseScatterOption(defaultSymbolSize, max, legenddata);
        option.series = series;

        return option;
    }

}

//导出
export {ScatterChart}