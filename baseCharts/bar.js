/**柱状图封装**/
import {BaseChart} from './baseChart.js'
import {makeBarData} from '../tools/makeData.js'
import {mergeJson, rotateArr} from '../tools/otherFn.js'

class BarChart extends BaseChart {
    
    constructor(data){
        super(data);
        this.xdata = [];
        this.legenddata = [];
        this.vdata = [];
        this.extraChartData = [];
    }

    _init(perMode){
        let workedData = makeBarData(this, perMode);
        this.xdata = workedData.xdata;
        this.legenddata = workedData.legenddata;
        this.vdata = workedData.vdata;
        this.extraChartData = workedData.extraChartData;
    }

    //基础配置
    _baseBarOption(barConfig, isPer){
        if(barConfig.ifMobile){
            return this._baseBarOption_mobile(barConfig, isPer);
        }else{
            return this._baseBarOption_pc(barConfig, isPer);
        }
    }

    //基础配置详情(pc端)
    _baseBarOption_pc(barConfig, isPer){
        let axis_Base = this._setBaseAxis(barConfig); //x轴/y轴基础配置
        let xAxis_Own = { //x轴配置
            name: this.setTitle(this.xTitle, this.xUnit),
            nameLocation: 'end',
            type: 'category',
            data: this.xdata,
            axisLabel: {
                interval:0, 
                rotate: 30,
                formatter: (name=>{
                    return this.setxNameOmit(name);
                })
            }
        }
        let yAxis_Own = { //y轴配置
            name: this.setTitle(this.yTitle , this.yUnit),
            type: 'value',
            axisLabel: {
                formatter: (value)=>{
                    return this.setUnit(value);
                }
            }
        }

        let option = {
            legend: this._setBaseLegend(barConfig, this.legenddata),
            tooltip: {
                trigger: 'axis',
                axisPointer: {          
                    type: 'shadow'     
                },
                formatter: (p)=>{
                    let result = this._setTooltipTitle(p[0].name, this.xUnit);

                    if(isPer){ //需要转成百分比
                        for(let i=0;i<p.length;i++){
                            if(p[i].value>0){
                                result += p[i].seriesName + ": " + p[i].value + "%</br>";
                            }
                        }
                    }else{ //不需要转成百分比
                        for(let i=0;i<p.length;i++){
                            if(p[i].seriesName.indexOf("增长率")!=-1){ //？
                                result += p[i].seriesName + ": " + p[i].value + "%</br>";
                            }else{
                                result += p[i].seriesName + ": " + p[i].value + this.vUnit + "</br>";
                            }
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
        
        //如果是百分比y轴最多为100
        if(isPer) {
            option.yAxis[0].max = 100;
        }
        
        //显示滚动条
        let legenddataLength = !(this.chartType==105 || this.chartType==113)? this.legenddata.length: 1; //如果数据堆叠，legenddata长度算1
        
        if((this.xdata.length*legenddataLength > 20) && !this.yearOrMonth(this.xUnit)){ //触发规则?
            let endIndex = !(this.xdata.length>5 && legenddataLength>10)? parseInt(20/this.legenddata.length)-1: 4;

            option.grid.bottom = "5%";
            option.dataZoom = this._setDataZoom(barConfig, endIndex);
        }

        return option;
    }

    //基础配置详情(移动端)
    _baseBarOption_mobile(barConfig, isPer){
        let option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {          
                    type: 'shadow'     
                },
                formatter: (p)=>{
                    let result = this._setTooltipTitle(p[0].name, this.xUnit);

                    if(isPer){ //需要转成百分比
                        for(let i=0;i<p.length;i++){
                            if(p[i].value>0){
                                result += p[i].seriesName + ": " + p[i].value + "%</br>";
                            }
                        }
                    }else{ //不需要转成百分比
                        for(let i=0;i<p.length;i++){
                            if(p[i].seriesName.indexOf("增长率")!=-1){ //？
                                result += p[i].seriesName + ": " + p[i].value + "%</br>";
                            }else{
                                result += p[i].seriesName + ": " + p[i].value + this.vUnit + "</br>";
                            }
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
                        color: barConfig.axisTitleFontColor,
                        fontSize: barConfig.axisTitleFontSize
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
                            return this.setxNameOmit(name);
                        },
                        textStyle:{
                            color: barConfig.axisFontColor,
                            fontSize: barConfig.axisFontSize
                        }
                    }
                }
            ],
            yAxis: [
                {
                    name: this.setTitle(this.yTitle , this.yUnit),
                    nameTextStyle:{
                        color: barConfig.axisTitleFontColor,
                        fontSize: barConfig.axisTitleFontSize
                    },
                    type: 'value',
                    axisLine:{lineStyle:{color:'#000'}},
                    axisLabel: {
                        textStyle:{
                            color: barConfig.axisFontColor,
                            fontSize: barConfig.axisFontSize
                        },
                        formatter: (value)=>{
                            return this.setUnit(value);
                        }
                    }
                }
            ],
            series: []
        };
        
        //如果是百分比y轴最多为100
        if(isPer) {
            //option.yAxis[0].max = 100;
        }
        //显示滚动条? 
        if(!this.yearOrMonth(this.xUnit)){
            let endIndex = this.xdata.length>4? 3: this.xdata.length-1;
            option.dataZoom = this._setDataZoom(barConfig, endIndex);
        }

        return option;
    }

    //设置缩放
    _setDataZoom(barConfig, endIndex){ //zoomObj:{height:0, bottom:0, startValue:0, endValue:0}
        endIndex = barConfig.dataRange || endIndex; //默认取配置项里的dataRange

        let config = {};
        if(!barConfig.ifMobile){ //PC端
            config = {
                height: 30,
                bottom: 10,
                handleSize: '110%'
            };

        }else{ //移动端
            config = {
                height: 20,
                bottom: 0
            };
        }

        config.show = !barConfig.dataRange? true: false;
        //config.show = true;
        config.startValue = 0;
        config.endValue = endIndex;

        return [config, {type: 'inside'}];

    }

    //设置label
    _setLabelTop(barConfig, unit){
        unit = unit || "";
        return {
            show: !barConfig.ifMobile,
            position: 'top',
            fontSize: barConfig.labelFontSize,
            fontWeight: barConfig.labelFontWeight,
            color: barConfig.labelFontColor,
            formatter: ((p)=>{
                return this.setUnit(p.value) + unit;
            })
        }
    }


    //普通柱状图
    barNormal(barConfig, perMode, isAvg){
        this._init(perMode);
        let series = [];
        let isPer = (perMode=="ex" || perMode=="ey")? true: false;

        //设置series配置项
        this.vdata.forEach((val, index) => {
            let bs = {
                name: this.legenddata[index],
                type: 'bar',
                animation: barConfig.animation, //动画效果
                data: val,
                barMaxWidth: barConfig.barMaxWidth,
                label: this._setLabelTop(barConfig)
            };

            //添加平均线
            if(isAvg && 0==index){
                bs.markLine = {
                    animation: barConfig.animation, //动画效果
                    lineStyle: {
                        normal: { color: '#fc97af'}
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
        
        
        let option = this._baseBarOption(barConfig, isPer);
        option.series = series;
        
        return option;
    }


    //柱状图+增长率
    barWithRate(barConfig, perMode, rateMode){
        //rateMode: true:相同legend, 后一x相较前一x的增长率; 
        //false:相同x, 后一legend相较前一legend的增长率
        
        this._init(perMode);
        let legenddata = [];
        let series = [];
        let newVdata = [];
        
        let tempData = rateMode? rotateArr(this.vdata): this.vdata;
        let rateData = []; //增长率数组集合

        //重新拼legenddata
        this.legenddata.forEach(val => {
            legenddata.push(val);
            legenddata.push(val+"增长率");
        });
        //求增长率集合
        tempData.forEach(arr => { //
            let lastval = 0;
            let raiseArr = [];
            arr.forEach(val => {
                if(lastval != 0){
                    let rate = ((val-lastval)/lastval*100).toFixed(2);
                    raiseArr.push( parseFloat(rate) );
                }else{
                    raiseArr.push(0);
                }
                lastval = val;
            });
            rateData.push(raiseArr);
        });
        
        rateData = rateMode? rotateArr(rateData): rateData; //最终增长率集合
        this.vdata.forEach((val, index)=>{
            //柱图
            newVdata.push(val);
            let bs = {
                name: legenddata[2*index],
                type: 'bar',
                animation: barConfig.animation, //动画效果
                data: val,
                barMaxWidth: barConfig.barMaxWidth,
                itemStyle:{normal:{color:''}},
                label: this._setLabelTop(barConfig)
            };
            series.push(bs);
            
            //线图
            newVdata.push(rateData[index]);
            if(rateMode && index==0) return true;
            let rs = {
                name: legenddata[2*index+1],
                type: 'line',
                itemStyle:{normal:{color:''}},
                yAxisIndex: 1,
                smooth: true,
                animation: barConfig.animation, //动画效果 
                data: rateData[index],
                label: this._setLabelTop(barConfig, "%")
            }
            series.push(rs);  
        });

        let option = this._baseBarOption(barConfig, false);
        
        //重新赋值对象实例的legenddata, vdata
        this.legenddata = legenddata;
        this.vdata = newVdata;
        
        //重新赋值option.legend.data
        if(option.hasOwnProperty("legend"))
            option.legend.data = legenddata;
        
        if(option.xAxis[0].nameLocation=="end")
            option.xAxis[0].nameGap = 40;
        
        //右坐标轴
        option.yAxis[1] = {   
            name:'增长率(%)',
            type:'value',
            axisLine:{lineStyle:{color:'#000'}},
            axisLabel: {textStyle:{color:'#000'}}
        };
        option.series = series;

        return option;
    }


    //柱状图百分比(相同xdata和为100%, 数据堆叠)
    barPercentStack(barConfig){
        this._init("ex");
        let series = [];
        
        this.vdata.forEach((val, index)=>{
            let bs = {
                name: this.legenddata[index],
                type: 'bar',
                animation: barConfig.animation, //动画效果
                stack:'堆积',
                data: val,
                barMaxWidth: barConfig.barMaxWidth,
                label: this._setLabelTop(barConfig)
            };
            //修改覆盖
            bs.label.position = index%2 ? 'left': 'right';
            bs.label.formatter = (p)=>{
                return (p.value=="0.00")? "": p.value + "%";
            };

            series.push(bs);
        });

        let option = this._baseBarOption(barConfig, true);
        option.series = series;
        
        return option;
    }


    //各类占比柱状图(动态求和)
    barDynamic(chart, barConfig){
        this._init();
        let selected = {};
        let series = [];
        let sumData = []; //存放每一列的和

        //求每一列的和,并存放于sumData
        (() => {
            for (let i=0; i<this.vdata[0].length; i++){
                let sum = 0;
                for(let j=0; j<this.vdata.length; j++){
                    sum += this.vdata[j][i];
                }
                sumData[i] = parseFloat(sum.toFixed(2));
            }
        })();

        this.vdata.forEach((val, index) => {
            let bs = {
                name: this.legenddata[index],
                type: 'bar',
                animation: barConfig.animation, //动画效果
                smooth: true,
                data: val,
                barMaxWidth: barConfig.barMaxWidth,
                stack: '总量'
            };
            series.push(bs);
        });

        //series总体配置项
        let config = {
            name: '总量',
            type: 'line',
            data: sumData,
            lineStyle: {
                normal:{ color: "none" }
            },
            label: this._setLabelTop(barConfig),
            markLine: {
                animation: barConfig.animation, //动画效果
                lineStyle: {
                    normal: { color: '#fc97af'}
                },
                label: {
                    normal: { position: 'start' }
                },
                data: [{
                    name: '年平均',
                    type: 'average'
                }]
            }
        };
        series.push(config);

        let option = this._baseBarOption(barConfig, false);
        option.series = series;

        //lengend点击事件
        chart.on("legendselectchanged", (params)=>{
            selected = params.selected; //legenddata被选中的实时状态
            //循环
            for (let i=0; i<this.vdata[0].length; i++){
                let sum = 0;
                for (let key in selected){
                    if(selected[key]){ //如果被选中
                        let j = this.legenddata.indexOf(key); //找到被选中键值在legenddata中的索引
                        sum += this.vdata[j][i]; //实时求每一列的和
                    }
                }
                sumData[i] = parseFloat(sum.toFixed(2));
            }
            chart.setOption(option);
        });

        return option;
    }


    //柱状图+折线图(手动区分)
    barAndLine(barConfig){
        let bar_vdata=[], line_vdata = [];
        let series = [];
        let chartData = this.chartData;
        
        this.xdata = Enumerable.from(chartData).select(o=>o.x).distinct().toArray(); 
        let barChartData = chartData.filter((o)=>{return o.name=="BarChart"});
        let lineChartData = chartData.filter((o)=>{return o.name=="LineChart"});
        
        let bar_legenddata = Enumerable.from(barChartData).select(o=>o.y).distinct().toArray();
        let line_legenddata = Enumerable.from(lineChartData).select(o=>o.y).distinct().toArray();

        bar_legenddata.forEach((valy)=>{
            let barArr = [];
    
            this.xdata.forEach((valx)=>{
                let eachBarValue = Enumerable.from(barChartData).where((o)=>{return o.x==valx && o.y==valy}).sum(o=>o.value);
                barArr.push(eachBarValue);   
            });
            if(barArr.length>0) bar_vdata.push(barArr);
        });

        line_legenddata.forEach((valy)=>{
            let lineArr = [];
    
            this.xdata.forEach((valx)=>{
                let eachLineValue = Enumerable.from(lineChartData).where((o)=>{return o.x==valx && o.y==valy}).sum(o=>o.value);
                lineArr.push(eachLineValue);
            });
            
            if(lineArr.length>0) line_vdata.push(lineArr);
        });

        //设置series配置项
        bar_vdata.forEach((val, index) => {
            let bs = {
                name: bar_legenddata[index],
                type: 'bar',
                animation: barConfig.animation, //动画效果
                yAxisIndex: 0,
                data: val,
                barMaxWidth: barConfig.barMaxWidth,
                label: this._setLabelTop(barConfig)
            };
            series.push(bs);
        });

        line_vdata.forEach((val, index)=>{
            let ls = {
                name: line_legenddata[index],
                type: 'line',
                animation: barConfig.animation, //动画效果
                yAxisIndex: 1,
                data: val,
                label: this._setLabelTop(barConfig)
            };
            series.push(ls);
        });

        this.legenddata = bar_legenddata.concat(line_legenddata);
        this.vdata = bar_vdata.concat(line_vdata);
        let option = this._baseBarOption(barConfig, false);
        
        option.xAxis[0].nameGap = 40;
        option.yAxis[1] = {
            name: this.xUnit,
            type: 'value',
            axisLine:{lineStyle:{color:'#000'}},
            axisLabel: {
                textStyle:{color:'#000'},
                formatter: (value)=>{
                    return this.setUnit(value);
                },
            }
        };
        option.series = series;

        return option;
    }

}

//导出
export { BarChart }
