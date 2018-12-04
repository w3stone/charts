//默认配置表
let defaultConfig = {
    ifTitle: false, //标题
    ifToolBox: true, //工具栏
    //柱状图配置项
    barConfig:{
        barWidth: '' //柱状图宽度
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
        labelFontSize: 14, //label字体大小
        scatterGroup: [{"name":"三级医院", "type":3}, {"name":"二级医院", "type":2}] //分组
    }
}

export{
    defaultConfig
}