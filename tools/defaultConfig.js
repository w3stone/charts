let labelFontSize = 16; //label字体大小
let labelFontWeight = "normal";
//let labelColor = "#303133"; //label颜色
let labelColor = "auto";


//默认配置表
let defaultConfig = {
    ifTitle: false, //标题
    ifToolBox: true, //工具栏
    //柱状图配置项
    barConfig:{
        labelFontSize: labelFontSize, //label字体大小
        labelFontWeight: labelFontWeight,
        labelColor: labelColor,
        barWidth: "30%", //柱状图宽度
        barMaxWidth: "25%" //最大宽度
    },
    //折线图配置
    lineConfig:{
        labelFontSize: labelFontSize, //label字体大小
        labelFontWeight: labelFontWeight,
        labelColor: labelColor
    },
    //饼图配置项
    pieConfig: {
        innerRadius: '0', //内圈半径
        outerRadius: '60%', //外圈半径
        pieLabelShow: true, //饼图数据显示
        xCenter: '50%', //
        yCenter: '60%' //
    },
    //散点图配置项
    scatterConfig:{
        symbolSize: 30, //默认散点大小
        labelFontSize: labelFontSize, //label字体大小
        labelFontWeight: labelFontWeight,
        labelColor: labelColor,
        scatterGroup: [{"name":"三级医院", "type":3}, {"name":"二级医院", "type":2}] //分组
    }
}

export{
    defaultConfig
}