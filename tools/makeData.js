//拼柱状图格式(xdata, legenddata, vdata)
function makeBarData(data, perMode) {
    let chartData = data.chartData;
    //let chartData = data.chartData.filter(o=>{return o.x!="" || o.y!=""});
    let nUnit = data.nUnit;
    let xUnit = data.xUnit;
    let dataType = data.dataType;
    perMode = perMode || "normal"; //perMode: ex相同xdata和为100%, ey相同legenddata和为100%

    let xdata = [];
    let vdata = [];
    let extraChartData = []; //存储被过滤后再还原的项
    let legenddata = [];

    if(nUnit=="年" && xUnit!='月'){
        //根据最新一年的后端默认排序
        xdata = Enumerable.from(chartData).orderByDescending(o=>parseInt(o.y)).select(o=>o.x).distinct().toArray();
        legenddata = Enumerable.from(chartData).orderBy(o=>o.y).select(o=>o.y).distinct().toArray();

    }else if(nUnit=="年" && xUnit=='月'){ //?x轴为月份,legend为年份
        xdata = Enumerable.from(chartData).orderBy(o=>parseInt(o.x)).select(o=>o.x).distinct().toArray();
        legenddata = Enumerable.from(chartData).orderBy(o=>o.y).select(o=>o.y).distinct().toArray();

    }else{ //常规
        xdata = Enumerable.from(chartData).select(o=>o.x).distinct().toArray();
        legenddata = Enumerable.from(chartData).select(o=>o.y).distinct().toArray();
    }

    //剔除'\0' & ''
    xdata = xdata.filter(val => val!=='' && val !=/\0/);
    legenddata = legenddata.filter(val => val!=='' && val !=/\0/);

    //拼接vdata(内部函数)
    let makeBar_vdata_normal = valy => {
        let arr = [];
        xdata.forEach(valx => {
            let list = chartData.filter(o=>o.x==valx && o.y==valy);

            if("ex"==perMode){ //转换成百分比
                let sum = Enumerable.from(chartData).where(o=>o.x==valx).sum(o=>o.value); //相同xdata总和
                sum = sum || 1;
                let value = list.length>0? decimal(Enumerable.from(list).sum(o=>o.value)/sum*100): '';
                arr.push(value);
            
            }else if("ey"==perMode){
                let sum = Enumerable.from(chartData).where(o=>o.y==valy).sum(o=>o.value); //相同legenddata总和
                sum = sum || 1;
                let value = list.length>0? decimal(Enumerable.from(list).sum(o=>o.value)/sum*100): '';
                arr.push(value);
            
            }else{
                //arr.push( Enumerable.from(chartData).where(o=>o.x==valx && o.y==valy).sum(o=>o.value) );
                arr.push( list.length>0? decimal(Enumerable.from(list).sum(o=>o.value)): '' );
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
                    let list = chartData.filter(o=>o.x==valx && o.y==valy);

                    if("ex"==perMode){ //转换成百分比
                        let sum = Enumerable.from(chartData).where(o=>o.x==valx).sum(o=>o.value); //相同xdata求和
                        sum = sum || 1;
                        let value = list.length>0? decimal(Enumerable.from(list).sum(o=>o.value)/sum*100): '';
                        ortherSumArr[x_index] += value;

                    }else if("ey"==perMode){
                        let sum = Enumerable.from(chartData).where(o=>o.y==valy).sum(o=>o.value); //相同legenddata求和
                        sum = sum || 1;
                        let value = list.length>0? decimal(Enumerable.from(list).sum(o=>o.value)/sum*100): '';
                        ortherSumArr[x_index] += value;

                    }else{
                        let value = list.length>0? decimal(Enumerable.from(list).sum(o=>o.value)): '';
                        ortherSumArr[x_index] += value;
                    }
                    //再次保留两位小数
                    ortherSumArr[x_index] = decimal(ortherSumArr[x_index]);
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
            "value": decimal(o.value),
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
            "value": decimal(o.value),
            //"name": yearOrMonth(nUnit)? o.name + nUnit :o.name,
            "name": o.name,
            "type": trans2number(o.type)
        }
    });

    let valueMax = chartData.length>0? Enumerable.from(chartData).max(o=>o.value): 0; //value最大值

    return {
        "legenddata": legenddata,
        "chartData": chartData,
        "valueMax": valueMax
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

//保留两位小数
function decimal(value){
    let reg = new RegExp("^[-+]?[0-9]+(\\.[0-9]+)?$"); //正负整数或小数
    if(typeof value!="number" && !reg.test(value)) return value || "";
    return (Math.round(value*100)/100);
}

