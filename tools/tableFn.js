/**柱状图表格
    data: {xdata,legenddata,vdata, xUnit, yUnit...}
**/
function makeBarTable(data){
    var copydata = JSON.parse(JSON.stringify(data)); //深拷贝
    var xdata = copydata.xdata || [];
    var legenddata = copydata.legenddata || [];
    var vdata = copydata.vdata || [];
    //var xTitle = copydata.xTitle || ""; //x轴标题
    //var yTitle = copydata.yTitle || ""; //y轴标题
    var xUnit = copydata.xUnit || ""; //x轴单位
    var yUnit = copydata.yUnit || ""; //y轴单位
    var vUnit = copydata.vUnit || ""; //value单位
    var chartType = copydata.chartType;
    
    xdata.unshift(""); //在xdata前插入空字符串

    if(xUnit){ //如果有x轴单位
        xdata.forEach(function(item, index){
            if(index != 0){
                xdata[index] = item + setUnit(xUnit);
            }
        });
    }

    vdata.forEach(function(arr, index){
        if(chartType==105 || chartType==106 || chartType==107){ //需要转成%
            arr.forEach(function(val, i){
                arr[i] = val+"%";
            });
            arr.unshift(legenddata[index]);
        }else{ //不需要转成%
            if(yUnit){
                arr.forEach(function(val, i){
                    arr[i] = val + vUnit;
                });
            }
            arr.unshift(legenddata[index] + setUnit(yUnit));
        } 
    });

    return {
        thead: xdata,
        tbody: vdata
    };
}

//
function make2DTable(data, isPer){
    isPer = (isPer!=undefined)? isPer: true; //默认需要转成比例
    var copydata = JSON.parse(JSON.stringify(data)); //深拷贝
    var chartData = copydata.chartdata || copydata.chartData;
    var vTitle = copydata.vTitle; //value标题
    var nTitle = copydata.nTitle; //name标题
    var vUnit = copydata.vUnit || ""; //value单位
    
    var sum = 0;
    var tbody = [];

    if(isPer)
        sum = Enumerable.from(chartData).sum(o=>o.value);

    chartData.forEach((item)=>{
        var arr = isPer? [item.name, ((item.value/sum)*100).toFixed(2)+"%"]: [item.name, item.value];
        tbody.push(arr);
    })

    return {
        thead: isPer? [nTitle || "名称", "占比"]: [nTitle || "名称", vTitle+setUnit(vUnit)],
        tbody: tbody
    };
}

//
function make4DTable(data){
    var copydata = JSON.parse(JSON.stringify(data)); //深拷贝
    var chartData = copydata.chartData;
    var xTitle = copydata.xTitle; //x轴标题
    var yTitle = copydata.yTitle; //y轴标题
    var vTitle = copydata.vTitle; //value标题
    var nTitle = copydata.nTitle; //name标题
    var xUnit = copydata.xUnit || ""; //x轴单位
    var yUnit = copydata.yUnit || ""; //y轴单位
    var vUnit = copydata.vUnit || ""; //value单位
    var tbody = [];

    chartData.forEach((item)=>{
        var arr = [];
        if(vTitle){
            arr = [item.name, item.x, item.y, item.value];
        }else{
            arr = [item.name, item.x, item.y];
        }
        tbody.push(arr);
    })

    return {
        thead: vTitle? [nTitle || "名称", xTitle+setUnit(xUnit), yTitle+setUnit(yUnit), vTitle+setUnit(vUnit)]: 
            [nTitle || "名称", xTitle+setUnit(xUnit), yTitle+setUnit(yUnit)],
        tbody: tbody
    };
}

export{
    makeBarTable, make2DTable, make4DTable
}

//设置单位
function setUnit(unit){
    return (unit && unit!="年" && unit!="月")? "(" + unit + ")": "";
}