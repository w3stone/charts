class BaseChart{
    
    //构建器
    constructor(data){
        this.chartData = data.chartdata || data.chartData || []; //主要数据源
        this.title = data.title || ""; //标题
        this.xTitle = data.xtitle || data.xTitle || ""; //x轴标题
        this.yTitle = data.ytitle || data.yTitle  || ""; //y轴标题
        this.vTitle = data.vtitle || data.vTitle || ""; //value标题
        this.nTitle = data.ntitle || data.nTitle || ""; //name标题
        this.xUnit = data.xunit || data.xUnit || ""; //x轴单位
        this.yUnit = data.yunit || data.yUnit || ""; //y轴单位
        this.vUnit = data.vunit || data.vUnit || ""; //value单位
        this.nUnit = data.nunit || data.nUnit || ""; //name单位
        this.chartType = data.charttype || data.chartType || 0;
        this.dataType = data.datatype || data.dataType || 0; //是否需要过滤数据
    }

    //设置tooltip标题(option相关)
    _setTooltipTitle(name, unit){
        return '<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 18px;padding-bottom: 7px;margin-bottom: 7px">' +
        this.setVisibleName(name, unit) + '</div>';
    }

    //设置legend基础配置
    _setBaseLegend(config, legenddata){
        return {
            data: legenddata, 
            type: 'scroll', 
            top: '8%',
            formatter: (name => {
                return this.setVisibleName(name, this.nUnit)
            }),
            textStyle: {
                color: config.legendFontColor,
                fontSize: config.legendFontSize
            }
        };
    }

    //设置x轴/y轴基础配置
    _setBaseAxis(config){
        return {
            nameTextStyle:{
                color: config.axisTitleFontColor,
                fontSize: config.axisTitleFontSize
            },
            axisLine:{
                lineStyle:{color:'#000'}
            },
            axisLabel: {
                interval: 0,
                textStyle:{
                    color: config.axisFontColor,
                    fontSize: config.axisFontSize
                }
            }
        };
    }

    //设置单位
    setUnit(value) {
        let reg = new RegExp("^[-+]?[0-9]+(\\.[0-9]+)?$"); //正负整数或小数
        if(typeof value!="number" && !reg.test(value)) return value;
        value = parseFloat(value);

        if(value>=100000000) {
            return parseFloat((value/100000000).toFixed(2)) + '亿';
        } else if(value>=10000) {
            return parseFloat((value/10000).toFixed(2)) + '万';
        } else {
            return parseFloat(value.toFixed(2)) + '';
        }
    }

    //设置标题
    setTitle(title, unit) {
        if(title && unit){
            return title + "(" + unit + ")";
        }else if(title && !unit){
            return title;
        }else if(!title && unit){
            return unit;
        }else{
            return "";
        }
    }

    //单位是否为年或月
    yearOrMonth(unit){
        return (unit=="月" || unit=="年")? true: false;
    }

    //设置显示的名称(如果单位为年或月,在数字后插入单位)
    setVisibleName(name, unit){
        if(this.yearOrMonth(unit)){
            let strNum = name.replace(/[^0-9]/g,"");
            return strNum!=""? name.replace(strNum, strNum+unit): name; 
        }else{
            return name;
        }
    }

    //设置显示(长度大于5省略，xUnit为年或月舔加单位)
    setxNameOmit(name){
        if(!this.yearOrMonth(this.xUnit)){
            return name.length>5? name.slice(0,5)+"...": name;
        }else{
            return this.setVisibleName(name, this.xUnit);
        }
    }

    //保留小数
    round(value, decimal){
        return parseFloat(value.toFixed(decimal));
    }
    
}

//导出
export {BaseChart}
