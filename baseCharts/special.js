/**柱状图封装**/
import {BaseChart} from './baseChart.js'
import {makeBarData} from '../tools/makeData.js'
import {mergeJson} from '../tools/otherFn.js'

class SpecialChart extends BaseChart {
    
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

    //数量&增长率分开
    special01(){
        this._init();
        let series1 = [];
        let series2 = [];
        let raiseVdata = []; //增长率数组

        this.vdata.forEach((arr, index) => {
            //设置数量series配置项
            let bs = {
                name: this.legenddata[index],
                type: 'bar',
                xAxisIndex: 0,
                yAxisIndex: 0,
                itemStyle: {normal: {}},
                data: arr,
                label: {
                    normal: {
                        show: true,
                        position: 'top'
                    }
                }
            };
            series1.push(bs);
            
            //求增长率
            let lastval = 0;
            let raiseArr = [];
            arr.forEach((val)=>{
                if(lastval != 0){
                    raiseArr.push( ((val-lastval)/lastval*100).toFixed(2) );
                }else{
                    raiseArr.push(0);
                }
                lastval = val;
            });
            raiseVdata.push(raiseArr);
        });

        //设置增长率series配置项
        raiseVdata.forEach((val, index) => {
            let bs = {
                name: this.legenddata[index],
                type: 'line',
                xAxisIndex: 1,
                yAxisIndex: 1,
                itemStyle: {normal: {}},
                data: val,
                label: {
                    normal: {
                        show: true,
                        position: 'top'
                    }
                }
            };
            series2.push(bs);
        });
        
        let option = {
            legend: {
                data: this.legenddata, type:'scroll', top:'10%'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {          
                    type: 'shadow'     
                }
            },
            grid:[{
                top:'24%',
                left: '6%',
                right: '52%',
                bottom: '6%',
                containLabel: true
            },{
                top:'24%',
                left: '52%',
                right: '6%',
                bottom: '6%',
                containLabel: true
            }],
            xAxis: [
                {
                    gridIndex:0,
                    type: 'category',
                    axisLine:{lineStyle:{color:'#000'}},
                    data: this.xdata,
                    axisLabel: {interval:0, rotate:50, textStyle:{color:'#000'}}
                },
                {
                    gridIndex:1,
                    type: 'category',
                    axisLine:{lineStyle:{color:'#000'}},
                    data: this.xdata,
                    axisLabel: {interval:0, rotate:50, textStyle:{color:'#000'}}
                }
            ],
            yAxis: [
                {
                    gridIndex:0,
                    name: "数量",
                    type: 'value',
                    axisLine:{lineStyle:{color:'#000'}},
                    axisLabel: {
                        textStyle:{color:'#000'},
                        formatter: (value)=>{
                            return this.setUnit(value);
                        },
                    }
                },
                {
                    gridIndex:1,
                    name: "增长率",
                    type: 'value',
                    axisLine:{lineStyle:{color:'#000'}},
                    axisLabel: {
                        textStyle:{color:'#000'},
                        formatter: (value)=>{
                            return this.setUnit(value);
                        },
                    }
                }
            ],
            series: series1.concat(series2)
        };

        return option;
    }

    //高级百分比
    special02(){
        this._init("ex");
  
        var series = [];
        var placeHoledStyle = {
            normal:{
                barBorderColor:'rgba(0,0,0,0)',
                color:'rgba(0,0,0,0)'
            },
            emphasis:{
                barBorderColor:'rgba(0,0,0,0)',
                color:'rgba(0,0,0,0)'
            }
        };
        var dataStyle = { 
            normal: {
                label : {
                    show: true,
                    position: 'insideLeft',
                    formatter: '{c}%'
                }
            }
        };

        this.vdata.forEach((arr,index)=>{
            var bs = {
                name: this.legenddata[index],
                type:'bar',
                stack: '总量',
                itemStyle : dataStyle,
                data: arr
            }
            series.push(bs);

            //console.log(arr);
            let tempArr = arr.map((val)=>{
                return 100-val;
            });

            var ts = {
                name: this.legenddata[index],
                type:'bar',
                stack: '总量',
                itemStyle: placeHoledStyle,
                data: tempArr
            }
            series.push(ts);
        })

        let option = {
            tooltip : {
                trigger: 'axis',
                axisPointer : { // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                },
                formatter: (params)=>{
                    var res = params[0].axisValueLabel+"<br/>";
                    params.forEach((item)=>{
                        if(item.seriesIndex%2==0)
                            res+=item.marker + item.seriesName + ": " + item.value + "%<br/>";
                    });
                    return res;
                }
            },
            legend: {
                data: this.legenddata, type:'scroll', top:'10%'
            },
            grid: {
                y: 60,
                y2: 20
            },
            xAxis : [
                {
                    type : 'value',
                    position: 'top',
                    splitLine: {show: false},
                    axisLabel: {show: false}
                }
            ],
            yAxis : [
                {
                    type : 'category',
                    splitLine: {show: false},
                    data : this.xdata
                }
            ],
            series: series
        };
        
        //console.log(JSON.stringify(option));
        return option;
    }

    //饼图百分比
    special03(pieConfig){
        this._init("ex");

        let xdata = this.xdata;
        let newxdata = [];

        
        //验证数据，如果每一年的小数据都为0，则删除该x
        xdata.forEach(xitem => {
            let xSum = Enumerable.from(this.chartData).where(o=>o.x==xitem).sum(o=>o.value);
            //console.log(xSum);
            if(xSum!=0) newxdata.push(xitem);
        });

        let length = xdata.length;
        let space = parseInt( 100 / (length+1) ); //间距
        let series = [];

        newxdata.forEach((xitem, index)=>{
            let useableData = this.chartData.filter(o => o.x==xitem);
            let data = useableData.map(o => ({'name':o.y, 'value':o.value}));
            
            let xCenter = space*(index+1) + "%";

            let ps = {
                name: xdata[index],
                type: 'pie',
                //roseType:'radius',
                radius : '40%',
                center: [xCenter, '55%'],
                data: data,
                label: {
                    normal: {
                        position: 'outside',
                        formatter: '{d}%',
                        textStyle: {
                            color: pieConfig.labelFontColor,
                            fontSize: pieConfig.labelFontSize,
                            fontWeight: pieConfig.labelFontWeight
                        }
                    }
                },
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            };
            series.push(ps);

        });

        let axis_Base = this._setBaseAxis(pieConfig); //x轴&y轴基础配置
        let xAxis_Own = { //x轴配置
            name: this.setTitle(this.xTitle, this.xUnit),
            nameLocation: 'end',
            type: 'category',
            data: newxdata,
            axisLabel: {
                interval:0, 
                rotate: 30,
                formatter: (name => {
                    return this.setxNameOmit(name, pieConfig.xMaxLength);
                })
            }
        }

        let option = {
            tooltip : {
                trigger: 'item',
                formatter: '{a} {b}: {c}' + this.vUnit + ' ({d}%)',
                textStyle: {
                    fontSize:14
                }
            },
            legend:this._setBaseLegend(pieConfig, this.legenddata),
            xAxis: [mergeJson(axis_Base, xAxis_Own)],
            yAxis: {gridIndex: 0, name:'year', show: false},
            series:series
        };

        return option;

    }

}

//导出
export { SpecialChart }

