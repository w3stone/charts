//拼柱状图格式(xdata, legenddata, vdata)
function makeBarData(data, perMode) {
    let chartData = data.chartData;
    //let chartData = data.chartData.filter(o=>{return o.x!="" || o.y!=""});
    let nUnit = data.nUnit;
    let dataType = data.dataType;
    perMode = perMode || "normal"; //perMode: ex相同xdata和为100%, ey相同legenddata和为100%

    let xdata = [];
    let vdata = [];
    let extraChartData = []; //存储被过滤后再还原的项
    let legenddata = [];

    if(nUnit=="年"){
        //根据最新一年排序
        xdata = Enumerable.from(chartData).orderByDescending(o=>o.y).select(o=>o.x).distinct().toArray();
        legenddata = Enumerable.from(chartData).orderBy(o=>o.y).select(o=>o.y).distinct().toArray();
    }else{
        xdata = Enumerable.from(chartData).select(o=>o.x).distinct().toArray();
        legenddata = Enumerable.from(chartData).select(o=>o.y).distinct().toArray();
    }
    //console.log(legenddata);


    //拼接vdata(内部函数)
    function makeBar_vdata_normal(valy){
        let arr = [];
        xdata.forEach(valx => {
            if("ex"==perMode){ //转换成百分比
                let sum = Enumerable.from(chartData).where(o=>o.x==valx).sum(o=>o.value);
                arr.push( (Enumerable.from(chartData).where(o=>o.x==valx && o.y==valy).sum(o=>o.value)/sum*100).toFixed(2) );
            
            }else if("ey"==perMode){
                let sum = Enumerable.from(chartData).where(o=>o.y==valy).sum(o=>o.value);
                arr.push( (Enumerable.from(chartData).where(o=>o.x==valx && o.y==valy).sum(o=>o.value)/sum*100).toFixed(2) );
            
            }else{
                arr.push( Enumerable.from(chartData).where(o=>o.x==valx && o.y==valy).sum(o=>o.value) );
            } 
        });
        vdata.push(arr);
    }
    
    
    if(dataType){ //需要转换
        let allSum = Enumerable.from(chartData).sum(o=>o.value); //所有数据求和
        //console.log(allSum);
        let delIndexArr = []; //储存需要被删除的索引
        let delValArr = []; //储存需要被删除的值
        let ortherSumArr = []; //用于存储该年其它类药品的和
        
        //初始化ortherSumArr
        xdata.forEach(() => {
            ortherSumArr.push(0); 
        })

        //遍历legenddata
        legenddata.forEach((valy, y_index) => {
            let per = Enumerable.from(chartData).where(o=>o.y==valy).sum(o=>o.value) / allSum;
            
            if(per < 0.01){ //小于1%
                delIndexArr.unshift(y_index); //储存需要被删除的索引(向前插入)
                delValArr.push(valy); //储存需要被删除的值
                
                xdata.forEach((valx, x_index) => {
                    if("ex"==perMode){ //转换成百分比
                        let sum = Enumerable.from(chartData).where(o=>o.x==valx).sum(o=>o.value); //相同xdata求和
                        let value = Enumerable.from(chartData).where(o=>o.x==valx && o.y==valy).sum(o=>o.value)/sum*100;
                        ortherSumArr[x_index] += parseFloat(value);

                    }else if("ey"==perMode){
                        let sum = Enumerable.from(chartData).where(o=>o.y==valy).sum(o=>o.value); //相同legenddata求和
                        let value = Enumerable.from(chartData).where(o=>o.x==valx && o.y==valy).sum(o=>o.value)/sum*100;
                        ortherSumArr[x_index] += parseFloat(value);

                    }else{
                        ortherSumArr[x_index] += Enumerable.from(chartData).where(o=>o.x==valx && o.y==valy).sum(o=>o.value);
                    } 
                });

            }else{ //大于1%
                makeBar_vdata_normal(valy);
            }
        });
        //console.log(ortherSumArr);

        //如果有需要被删除的元素(需要过滤整合)
        if(delIndexArr.length>0){ 
            delIndexArr.forEach(val => {
                legenddata.splice(val, 1);
            });
            legenddata.push("其它");
            
            ortherSumArr.forEach((value,index) => { //保留两位小数
                ortherSumArr[index] = value.toFixed(2);
            });
            vdata.push(ortherSumArr);

            //还原被过滤的项(用于二级)
            delValArr.forEach(val => {
                let temp = Enumerable.from(chartData).where(o=>o.y==val).toArray();
                temp = temp.map(o => ({"name":o.y, "x":o.x, "y":"其它", "value":o.value}) );
                extraChartData = extraChartData.concat(temp);
            });
            //console.log(extraChartData);
        }

    }else{ //不需要转换
        legenddata.forEach(valy => {
            makeBar_vdata_normal(valy);
        });
    }

    // console.log(xdata);
    // console.log(legenddata);
    // console.log(vdata);

    return {
        "xdata": xdata,
        "legenddata": legenddata,
        "vdata": vdata,
        "extraChartData": extraChartData
    };
}


//拼饼图格式(legenddata)
function makePieData(chartData) {
    let legenddata = Enumerable.from(chartData).select(o=>o.name).toArray();

    chartData = chartData.map(o => {
        return {
            "x": o.x, 
            "y": o.y,
            "value": o.value,
            "name": o.name || "未填"
        }
    });

    return {
        "legenddata": legenddata,
        "chartData": chartData
    }
}


//拼折线图格式(xdata, legenddata, vdata)
function makeLineData(chartData) {
    let xdata = Enumerable.from(chartData).select(o=>o.x).distinct().toArray(); 
    let legenddata = Enumerable.from(chartData).select(o=>o.y).distinct().toArray();
    let vdata = [];

    legenddata.forEach(valy => {
        let arr = [];
        xdata.forEach(valx => {
            arr.push( Enumerable.from(chartData).where(o=>o.x==valx && o.y==valy).sum(o=>o.value) );
        });
        vdata.push(arr);
    });

    // console.log(xdata);
    // console.log(legenddata);
    // console.log(vdata);

    return {
        "xdata": xdata,
        "legenddata": legenddata,
        "vdata": vdata
    };
}


//拼散点图格式(legenddata,chartData,valueMax,xMin,xMax,yMin,yMax)
function makeScatterData(chartData, nUnit) {
    let legenddata = Enumerable.from(chartData).select(o=>o.name).toArray();
    
    chartData = chartData.map(o => {
        return {
            "x": trans2number(o.x), 
            "y": trans2number(o.y),
            "value": o.value,
            //"name": yearOrMonth(nUnit)? o.name + nUnit :o.name,
            "name": o.name,
            "type": trans2number(o.type)
        }
    });

    let valueMax = chartData.length>0? Enumerable.from(chartData).max(o=>o.value): 0; //value最大值
    let xMin = chartData.length>0? Enumerable.from(chartData).min(o=>o.x): 0; //x最小值
    let xMax = chartData.length>0? Enumerable.from(chartData).max(o=>o.x): 0; //x最大值
    let yMin = chartData.length>0? Enumerable.from(chartData).min(o=>o.y): 0; //x最小值
    let yMax = chartData.length>0? Enumerable.from(chartData).max(o=>o.y): 0; //x最大值
    //console.log(xMin, xMax, yMin, yMax);

    return {
        "legenddata": legenddata,
        "chartData": chartData,
        "valueMax": valueMax,
        "xMin": xMin,
        "xMax": xMax,
        "yMin": yMin,
        "yMax": yMax
    }
}

export{
    makeBarData, makePieData, makeLineData, makeScatterData
}


//数字string串转number
function trans2number(val){
    let reg = new RegExp("^[-+]?[0-9]+(\\.[0-9]+)?$"); //正负整数或小数
    if(reg.test(val)){
        return parseFloat(val);
    }else{
        return val;
    }
}
