/**折线图封装**/
import {BaseChart} from './baseChart.js'
import {makeLineData} from '../tools/makeData.js'

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
    _baseLineOption(){
        let option = {
            legend: {
                data: this.legenddata, 
                type:'scroll', 
                top:'8%'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {          
                    type: 'shadow'     
                },
                formatter: (p)=>{
                    let result = this.setTooltipTitle(p[0].name);
                    for(let i=0;i<p.length;i++){
                        result += p[i].seriesName + ":" + p[i].value + "("+ this.vUnit + ")</br>";
                    }
                    return result;
                },
            },
            grid: {
                top:'20%',
                left: '6%',
                right: '8%',
                bottom: '0%',
                containLabel: true
            },
            xAxis: [
                {
                    name: this.setTitle(this.xTitle, this.xUnit),
                    type: 'category',
                    axisLine:{lineStyle:{color:'#000'}},
                    data: this.xdata,
                    axisLabel: {
                        interval:0, 
                        rotate: 30,
                        formatter: (name)=>{
                            return this.setNameOmit(name);
                        },
                        textStyle:{color:'#000'}
                    }
                }
            ],
            yAxis: [
                {
                    name: this.setTitle(this.yTitle, this.yUnit),
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
            series: []
        };
        
        //显示滚动条
        if(this.xdata.length > 12){
            option.grid.bottom = "12%";
            option.dataZoom = [{
                show: true,
                height: 30,
                bottom: 10,
                startValue: this.xdata[0],
                endValue: this.xdata[12-1],
                handleSize: '110%',
            }, {type: 'inside'}];
        }

        return option;
    }

    
    //普通折线图
    line(isAvg){
        this._init();
        let series = [];

        //设置series配置项
        this.vdata.forEach((val, index) => {
            let bs = {
                name: this.legenddata[index],
                type: 'line',
                itemStyle: {normal: {}},
                data: val,
                label: {
                    normal: {
                        show: true,
                        position: 'top'
                    }
                }
            };

            //添加平均线
            if(isAvg && 0==index){
                bs.markLine = {
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
        
        let option = this._baseLineOption();
        option.series = series;
        
        return option;
    }

}

//导出
export { LineChart }