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
                formatter: name => {
                    return this.setxNameOmit(name);
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
            legend: this._setBaseLegend(barConfig, this.legenddata),
            tooltip: {
                trigger: 'axis',
                axisPointer: {          
                    type: 'shadow'     
                },
                formatter: p => {
                    let result = this._setTooltipTitle(p[0].name, this.xUnit);
                    // if(isPer){ //需要转成百分比
                    //     for(let i=0;i<p.length;i++){
                    //         if(p[i].value>0){
                    //             result += p[i].seriesName + ": " + p[i].value + "%</br>";
                    //         }
                    //     }
                    // }else{ //不需要转成百分比
                    //     for(let i=0;i<p.length;i++){
                    //         if(p[i].seriesName.indexOf("增长率")!=-1){ //???
                    //             result += p[i].seriesName + ": " + p[i].value + "%</br>";
                    //         }else{
                    //             result += p[i].seriesName + ": " + p[i].value + this.vUnit + "</br>";
                    //         }
                    //     }
                    // }
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
                    // if(isPer){ //需要转成百分比
                    //     for(let i=0;i<p.length;i++){
                    //         if(p[i].value>0){
                    //             result += p[i].seriesName + ": " + p[i].value + "%</br>";
                    //         }
                    //     }
                    // }else{ //不需要转成百分比
                    //     for(let i=0;i<p.length;i++){
                    //         if(p[i].seriesName.indexOf("增长率")!=-1){ //？
                    //             result += p[i].seriesName + ": " + p[i].value + "%</br>";
                    //         }else{
                    //             result += p[i].seriesName + ": " + p[i].value + this.vUnit + "</br>";
                    //         }
                    //     }
                    // }
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
    _setLabelTop(barConfig, unit, forceShow){
        unit = unit || "";
        return {
            show: typeof forceShow!='undefined'? forceShow: !barConfig.ifMobile,
            position: 'top',
            fontSize: barConfig.labelFontSize,
            fontWeight: barConfig.labelFontWeight,
            color: barConfig.labelFontColor,
            formatter: (p => {
                //return p.value? this.setUnit(p.value) + unit: ""; //?
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


    //柱状图堆叠
    barStack(barConfig, perMode){
        this._init(perMode);
        let series = [];
        let isPer = (perMode=="ex" || perMode=="ey")? true: false;
        
        this.vdata.forEach((val, index) => {
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

        let option = this._baseBarOption(barConfig, isPer);
        option.series = series;

        if(isPer) option.yAxis[0].max = 100; //y轴最多为100
        
        return option;
    }


    //柱状图+增长率
    barWithRate(barConfig, perMode, rateMode){
        /** rateMode: 
         * false:相同legend, 后一x相较前一x的增长率; 
         * true:相同x, 后一legend相较前一legend的增长率 **/
        
        this._init(perMode);
        let new_legenddata = [];
        let series = [];
        let new_vdata = [];
        
        let tempData = rateMode? rotateArr(this.vdata): this.vdata;
        let rateData = []; //增长率数组集合
        let tempBol = this.legenddata.filter(o=>o.indexOf("(对比)")>-1).length>0? true: false; //是否有对比(临时)

        //重新拼legenddata
        this.legenddata.forEach(name => {
            new_legenddata.push(name);
            new_legenddata.push(name+"增长率");
        });

        //求增长率集合
        tempData.forEach(arr => {
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
        
        //最终增长率集合
        rateData = rateMode? rotateArr(rateData): rateData;

        this.vdata.forEach((val, index)=>{
            //柱图
            new_vdata.push(val);
            let bs = {
                name: new_legenddata[2*index],
                type: 'bar',
                animation: barConfig.animation, //动画效果
                data: val,
                barMaxWidth: barConfig.barMaxWidth,
                itemStyle: {normal:{color:''}},
                label: this._setLabelTop(barConfig)
            };
            series.push(bs);

            //线图
            new_vdata.push(rateData[index]);

            if(rateMode) return true; //跳出本次循环
            
            let rs = {
                name: new_legenddata[2*index+1],
                type: 'line',
                yAxisIndex: 1,
                smooth: true,
                animation: barConfig.animation, //动画效果 
                data: rateData[index],
                label: rateMode==false? this._setLabelTop(barConfig, "%"): this._setLabelTop(barConfig, "%", false)
            }
            series.push(rs);  
        });

        //重新赋值对象实例的legenddata, vdata
        this.legenddata = rateMode? this.legenddata: new_legenddata;
        
        let option = this._baseBarOption(barConfig, false);
        
        if(option.xAxis[0].nameLocation=="end")
            option.xAxis[0].nameGap = 40;
        
        //右坐标轴
        if(!rateMode){
            option.yAxis[1] = {   
                name:'增长率(%)',
                type:'value',
                axisLine:{lineStyle:{color:'#000'}},
                axisLabel: {textStyle:{color:'#000'}}
            };
        }

        option.series = series;

        //设置最终legenddata, 用于表格
        if(!(tempBol && rateMode)){ //???如果有对比且rateMode为true(不显示增长率)
            this.legenddata = new_legenddata;
            this.vdata =  new_vdata;
        }
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
                    let value = this.vdata[j][i]? this.vdata[j][i]: 0;
                    sum += value;
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
            animation: barConfig.animation, //动画效果
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
        let barChartData = chartData.filter(o => o.name=="BarChart");
        let lineChartData = chartData.filter(o => o.name=="LineChart");
        
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


    //柱状图(原始&占比切换)
    barNormalAndPer(chart, barConfig, perMode, rateMode){
        /** rateMode: 
         * false:相同legend, 后一x相较前一x的增长率; 
         * true:相同x, 后一legend相较前一legend的增长率 **/
        //this._init(perMode);

        let workedData_normal = makeBarData(this);
        let workedData_per = makeBarData(this, perMode);
        this.xdata = workedData_per.xdata;
        this.legenddata = workedData_per.legenddata;
        let vdata_normal = workedData_normal.vdata;
        let vdata_per = workedData_per.vdata;
        //
        let legenddata_bak = this.legenddata;
        let yUnit_bak = this.yUnit;
        let vUnit_bak = this.vUnit;


        //
        let type = true; //type: true占比;false:原始
        let isPer = (perMode=="ex" || perMode=="ey")? true: false;

        let option = this._baseBarOption(barConfig, isPer);
        option.toolbox = {
            feature: {
                mySwitch: {
                    show: true,
                    title: '原始&占比切换',
                    icon: 'path d="M830.6 732.8H287.3c-24.4 0-47.5-9.6-65-27-17.4-17.4-27-40.5-27-65V505.6l20.1 20.1c10.9 10.9 28.7 10.9 39.6 0 10.9-10.9 10.9-28.7 0-39.6l-66.5-66.5c-11.7-11.7-30.7-11.7-42.4 0l-66.5 66.5c-10.9 10.9-10.9 28.7 0 39.6 10.9 10.9 28.7 10.9 39.6 0l20.1-20.1v135.2c0 81.7 66.3 148 148 148h543.3c15.5 0 28-12.5 28-28 0-15.4-12.5-28-28-28zM946.3 499.1c-10.9-10.9-28.7-10.9-39.6 0l-20.1 20.1V387c0-81.7-66.3-148-148-148H195.3c-15.5 0-28 12.5-28 28s12.5 28 28 28h543.3c24.4 0 47.5 9.6 65 27 17.4 17.4 27 40.5 27 65v132.2l-20.1-20.1c-10.9-10.9-28.7-10.9-39.6 0-10.9 10.9-10.9 28.7 0 39.6l66.5 66.5c11.7 11.7 30.7 11.7 42.4 0l66.5-66.5c10.9-10.9 10.9-28.6 0-39.6z"',
                    onclick: ()=>{
                        type = !type;
                        //还原
                        this.legenddata = legenddata_bak;
                        this.yUnit = yUnit_bak;
                        this.vUnit = vUnit_bak;
                        makeSeries(false);
                        setUnit();
                        //setTooltipLabel();
                        chart.setOption(option);
                    }
                }
            }
        }

        //设置series配置项
        let makeSeries = (ifFirst)=>{
            let series = [];
            this.vdata = [];

            vdata_per.forEach((val, index) => {
                let bs = {
                    name: this.legenddata[index],
                    type: 'bar',
                    animation: barConfig.animation, //动画效果
                    data: type? val: vdata_normal[index],
                    barMaxWidth: barConfig.barMaxWidth,
                    label: this._setLabelTop(barConfig)
                };
                if(ifFirst){
                    this.vdata.push(vdata_normal[index]);
                    this.vdata.push(vdata_per[index]);
                }
                series.push(bs);
            });
            option.series = series;
        }

        //设置单位
        let setUnit = ()=>{
            if(type){
                option.yAxis[0].name = this.setTitle(this.yTitle+'占比', '%');
            }else{
                option.yAxis[0].name = this.setTitle(this.yTitle, this.yUnit);
            }
        }
        let setTooltipLabel = ()=>{
            //let vUnit = type? "%": this.vUnit;
            option.tooltip.formatter = (p)=>{
                let result = this._setTooltipTitle(p[0].name, this.xUnit);
        
                for(let i=0;i<p.length;i++){
                    if(p[i].seriesName.indexOf("增长率")!=-1){ //???
                        result += p[i].seriesName + ": " + p[i].value + "%</br>";
                    }else{
                        result += p[i].seriesName + ": " + p[i].value + "</br>";
                    }
                }
                return result;
            };
        }

        makeSeries(true);
        setUnit();
        setTooltipLabel();

        //覆盖部分默认参数，用于表格
        let new_legenddata = [];
        this.legenddata.forEach(name=>{
            new_legenddata.push(this.setTitle(name, this.yUnit));
            new_legenddata.push(this.setTitle(name+"占比", "%"));
        })
        this.legenddata = new_legenddata;
        this.yUnit = "";
        this.vUnit = "";
        
        return option;
    }

}

//导出
export { BarChart }
