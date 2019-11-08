//默认配置表
let defaultConfig = {
    ifMobile: false, //是否手机端
    ifTitle: false, //标题
    ifToolBox: true, //工具栏
    ifDataZoom: true, //默认自动
    animation: true, //动画效果
    titleFontSize: 18,
    titleFontColor: "#000", 
    labelFontSize: 16, //label字体大小
    labelFontWeight: "normal",
    labelFontColor: "auto",
    axisFontSize: 13, //坐标轴字体大小
    axisFontColor: "#000", //坐标轴字体颜色
    axisTitleFontSize: 13, //坐标轴标题大小
    axisTitleFontColor: "#000", //坐标轴标题颜色
    legendFontSize: 13, //图例组件字体大小
    legendFontColor: "#000", //图例组件字体颜色
    tooltipFontSize: 14, //提示框字体大小
    tooltipFontColor: "#fff", //提示框字体颜色
    xMaxLength: 5, //x轴最大显示长度
    //柱状图配置项
    barConfig:{
        barWidth: "30%", //柱状图宽度
        barMaxWidth: "25%", //最大宽度
        setLabelUnit: false, //是否处理单位(万&亿)
        dataRange: 0, //x轴显示多少列(默认不固定)
        yMinInterval: 0 //坐标轴最小间隔大小 
    },
    //折线图配置
    lineConfig:{
        dataRange: 0, //x轴显示多少列(默认不固定)
        yMinInterval: 0, //坐标轴最小间隔大小 
    },
    //饼图配置项
    pieConfig: {
        pieLabelShow: true, //饼图数据显示
        innerRadius: '0', //内圈半径
        outerRadius: '60%', //外圈半径
        xCenter: '50%', //
        yCenter: '60%' //
    },
    //散点图配置项
    scatterConfig:{
        symbolSize: 30, //默认散点大小
        scatterGroup: [{"name":"三级医院", "type":3}, {"name":"二级医院", "type":2}] //分组
    },
    //地图配置项
    mapConfig:{
        dataRangeShow: true,
        emphasisColor: "#349eea",
        rangeHighColor: "",
        rangeLowColor: ""
    },
    //树状图配置项
    treeConfig:{
        top: '10%',
        right: '10%',
        bottom: '10%',
        left: '15%',
        width: '50%',
        height: '400'
    }
}


//配置字典表
const configDic = [
    "animation",
    "ifMobile",
    "titleFontSize",
    "titleFontColor",
    "labelFontSize", 
    "labelFontWeight", 
    "labelFontColor",
    "axisFontSize", 
    "axisFontColor",
    "axisTitleFontSize",
    "axisTitleFontColor",
    "legendFontSize",
    "legendFontColor",
    "tooltipFontSize",
    "tooltipFontColor",
    "xMaxLength"
]


export{
    defaultConfig, configDic
}