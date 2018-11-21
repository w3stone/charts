//拼柱状图格式(xdata, ydata, vdata)
function makeBarData(chartData, dataType, need2Per) {
    need2Per = need2Per || false;

    var xdata = Enumerable.From(chartData).Select("$.x").Distinct().ToArray(); 
    var ydata = Enumerable.From(chartData).Select("$.y").Distinct().ToArray();
    var vdata = [];
    var extraChartData = [];

    if(dataType){ //需要转换
        var allSum = Enumerable.From(chartData).Sum("$.value"); //所有数据求和
        //console.log(allSum);
        var delIndexArr = []; //储存需要被删除的索引
        var delValArr = []; //
        var ortherSumArr = []; //用于存储该年其它类药品的和
        
        //初始化ortherSumArr
        xdata.forEach(()=>{
            ortherSumArr.push(0); 
        })

        //遍历ydata
        ydata.forEach((valy, y_index)=>{
            let arr = [];
            var per = Enumerable.From(chartData).Where( (o)=>{return o.y==valy} ).Sum('$.value') / allSum;
            
            if(per < 0.01){ //小于1%
                delIndexArr.unshift(y_index); //储存需要被删除的索引(向前插入)
                delValArr.push(valy); //储存需要被删除的值
                
                xdata.forEach((valx, x_index)=>{
                    if(need2Per){ //转换成百分比
                        let sum = Enumerable.From(chartData).Where((o)=>{return o.x==valx;}).Sum('$.value');
                        let value = Enumerable.From(chartData).Where((o)=>{return o.x==valx && o.y==valy}).Sum("$.value")/sum*100;
                        ortherSumArr[x_index] += parseFloat(value);
                    }else{
                        ortherSumArr[x_index] += Enumerable.From(chartData).Where((o)=>{return o.x==valx && o.y==valy}).Sum('$.value');
                    } 
                });

            }else{ //大于1%
                xdata.forEach((valx)=>{
                    if(need2Per){ //转换成百分比
                        let sum = Enumerable.From(chartData).Where((o)=>{return o.x==valx;}).Sum('$.value');
                        arr.push( (Enumerable.From(chartData).Where((o)=>{return o.x==valx && o.y==valy}).Sum('$.value')/sum*100).toFixed(2) );
                    }else{
                        arr.push( Enumerable.From(chartData).Where((o)=>{return o.x==valx && o.y==valy}).Sum('$.value') );
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
                let temp = Enumerable.From(chartData).Where( (o)=>{return o.y==val} ).ToArray();
                temp = temp.map((o)=>{
                    return {"name":o.y, "x":o.x, "y":"其它", "value":o.value};
                })
                extraChartData = extraChartData.concat(temp);
            });
            //console.log(extraChartData);

        }

    }else{ //不需要转换

        ydata.forEach((valy)=>{
            let arr = [];
            xdata.forEach((valx)=>{
                if(need2Per){ //转换成百分比
                    let sum = Enumerable.From(chartData).Where((o)=>{return o.x==valx;}).Sum('$.value');
                    arr.push( (Enumerable.From(chartData).Where((o)=>{return o.x==valx && o.y==valy}).Sum('$.value')/sum*100).toFixed(2) );
                }else{
                    arr.push( Enumerable.From(chartData).Where((o)=>{return o.x==valx && o.y==valy}).Sum('$.value') );
                } 
            });
            vdata.push(arr);
        });

    }

    return {
        "xdata": xdata,
        "ydata": ydata,
        "vdata": vdata,
        "extraChartData": extraChartData
    };
    
}


//拼饼图格式(vdata, legenddata)
function makePieData(chartData) {
    var legenddata = Enumerable.From(chartData).Select('$.name').ToArray();
    var vdata = [];
    var sum = Enumerable.From(chartData).Sum('$.value');

    legenddata.forEach((val)=>{
        var value = Enumerable.From(chartData).Where('$.name=="' + val +'"').Sum('$.value');
        var perValue = parseFloat( (perValue/sum*100).toFixed(2) );
        vdata.push(value);
    });

    return {
        "legenddata":legenddata,
        "vdata":vdata
    }

}

export{
    makeBarData, makePieData
}