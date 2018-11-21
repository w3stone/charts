//拼柱状图格式(xdata, ydata, vdata)
function makeBarData(chartData, dataType, perMode) {
    //perMode: ex相同xdata和为100%, ey相同ydata和为100%
    perMode = perMode || "normal";

    let xdata = Enumerable.From(chartData).Select("o=>o.x").Distinct().ToArray(); 
    let ydata = Enumerable.From(chartData).Select("o=>o.y").Distinct().ToArray();
    let vdata = [];
    let extraChartData = []; //存储被过滤后再还原的项

    if(dataType){ //需要转换
        let allSum = Enumerable.From(chartData).Sum("o=>o.value"); //所有数据求和
        //console.log(allSum);
        let delIndexArr = []; //储存需要被删除的索引
        let delValArr = []; //储存需要被删除的值
        let ortherSumArr = []; //用于存储该年其它类药品的和
        
        //初始化ortherSumArr
        xdata.forEach(()=>{
            ortherSumArr.push(0); 
        })

        //遍历ydata
        ydata.forEach((valy, y_index)=>{
            let arr = [];
            let per = Enumerable.From(chartData).Where(o=>{return o.y==valy}).Sum('o=>o.value') / allSum;
            
            if(per < 0.01){ //小于1%
                delIndexArr.unshift(y_index); //储存需要被删除的索引(向前插入)
                delValArr.push(valy); //储存需要被删除的值
                
                xdata.forEach((valx, x_index)=>{
                    if("ex"==perMode){ //转换成百分比
                        let sum = Enumerable.From(chartData).Where(o=>{return o.x==valx;}).Sum('o=>o.value'); //相同xdata求和
                        let value = Enumerable.From(chartData).Where(o=>{return o.x==valx && o.y==valy}).Sum("o=>o.value")/sum*100;
                        ortherSumArr[x_index] += parseFloat(value);

                    }else if("ey"==perMode){
                        let sum = Enumerable.From(chartData).Where(o=>{return o.y==valy;}).Sum('o=>o.value'); //相同ydata求和
                        let value = Enumerable.From(chartData).Where(o=>{return o.x==valx && o.y==valy}).Sum("o=>o.value")/sum*100;
                        ortherSumArr[x_index] += parseFloat(value);

                    }else{
                        ortherSumArr[x_index] += Enumerable.From(chartData).Where(o=>{return o.x==valx && o.y==valy}).Sum('o=>o.value');
                    } 
                });

            }else{ //大于1%
                xdata.forEach(valx => {
                    if("ex"==perMode){ //转换成百分比
                        let sum = Enumerable.From(chartData).Where(o=>{return o.x==valx;}).Sum('o=>o.value');
                        arr.push( (Enumerable.From(chartData).Where(o=>{return o.x==valx && o.y==valy}).Sum('o=>o.value')/sum*100).toFixed(2) );
                    
                    }else if("ey"==perMode){
                        let sum = Enumerable.From(chartData).Where(o=>{return o.y==valy;}).Sum('o=>o.value');
                        arr.push( (Enumerable.From(chartData).Where(o=>{return o.x==valx && o.y==valy}).Sum('o=>o.value')/sum*100).toFixed(2) );
                    
                    }else{
                        arr.push( Enumerable.From(chartData).Where(o=>{return o.x==valx && o.y==valy}).Sum('o=>o.value') );
                    } 
                });
                vdata.push(arr);
            }
        });
        //console.log(ortherSumArr);

        //如果有需要被删除的元素(需要过滤整合)
        if(delIndexArr.length>0){ 
            delIndexArr.forEach(val=>{
                ydata.splice(val, 1);
            });
            ydata.push("其它");
            
            ortherSumArr.forEach( (value,index) =>{ //保留两位小数
                ortherSumArr[index] = value.toFixed(2);
            });

            vdata.push(ortherSumArr);

            //还原被过滤的项(用于二级)
            delValArr.forEach((val)=>{
                let temp = Enumerable.From(chartData).Where(o=>{return o.y==val}).ToArray();
                temp = temp.map((o)=>{
                    return {"name":o.y, "x":o.x, "y":"其它", "value":o.value};
                })
                extraChartData = extraChartData.concat(temp);
            });
            //console.log(extraChartData);
        }

    }else{ //不需要转换

        ydata.forEach(valy => {
            let arr = [];
            xdata.forEach(valx => {
                if("ex"==perMode){ //转换成百分比
                    let sum = Enumerable.From(chartData).Where(o=>{return o.x==valx;}).Sum('o=>o.value');
                    arr.push( (Enumerable.From(chartData).Where(o=>{return o.x==valx && o.y==valy}).Sum('o=>o.value')/sum*100).toFixed(2) );

                }else if("ey"==perMode){
                    let sum = Enumerable.From(chartData).Where(o=>{return o.y==valy;}).Sum('o=>o.value');
                    arr.push( (Enumerable.From(chartData).Where(o=>{return o.x==valx && o.y==valy}).Sum('o=>o.value')/sum*100).toFixed(2) );

                }else{
                    arr.push( Enumerable.From(chartData).Where(o=>{return o.x==valx && o.y==valy}).Sum('o=>o.value') );
                } 
            });
            vdata.push(arr);
        });

    }

    // console.log(xdata);
    // console.log(ydata);
    // console.log(vdata);

    return {
        "xdata": xdata,
        "ydata": ydata,
        "vdata": vdata,
        "extraChartData": extraChartData
    };
}


//拼饼图格式(vdata, legenddata)
function makePieData(chartData) {
    let legenddata = Enumerable.From(chartData).Select('o=>o.name').ToArray();
    let vdata = [];
    let sum = Enumerable.From(chartData).Sum('o=>o.value');

    legenddata.forEach(val => {
        let value = Enumerable.From(chartData).Where(o=>{return o.name==val}).Sum('o=>o.value');
        let perValue = parseFloat( (perValue/sum*100).toFixed(2) );
        vdata.push(value);
    });

    return {
        "legenddata":legenddata,
        "vdata":vdata
    }
}


//拼折线图格式(xdata, ydata, vdata)
function makeLineData(chartData) {
    let xdata = Enumerable.From(chartData).Select("o=>o.x").Distinct().ToArray(); 
    let ydata = Enumerable.From(chartData).Select("o=>o.y").Distinct().ToArray();
    let vdata = [];

    ydata.forEach(valy => {
        let arr = [];
        xdata.forEach(valx => {
            arr.push( Enumerable.From(chartData).Where(o=>{return o.x==valx && o.y==valy}).Sum('o=>o.value') );
        });
        vdata.push(arr);
    });

    // console.log(xdata);
    // console.log(ydata);
    // console.log(vdata);

    return {
        "xdata": xdata,
        "ydata": ydata,
        "vdata": vdata
    };
}

export{
    makeBarData, makePieData, makeLineData
}