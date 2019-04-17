class Table {
    
    constructor(data){
        this.copydata = JSON.parse(JSON.stringify(data)); //深拷贝
        this.xdata = this.copydata.xdata || [];
        this.vdata = this.copydata.vdata || [];
        this.xTitle = this.copydata.xTitle || ""; //x轴标题
        this.yTitle = this.copydata.yTitle || ""; //y轴标题
        this.vTitle = this.copydata.vTitle || ""; //value标题
        this.nTitle = this.copydata.nTitle || ""; //name标题
        this.xUnit = this.copydata.xUnit || ""; //x轴单位
        this.yUnit = this.copydata.yUnit || ""; //y轴单位
        this.vUnit = this.copydata.vUnit || ""; //value单位
        this.nUnit = this.copydata.nUnit || ""; //name单位
        this.chartType = this.copydata.chartType || 0; //
        this.legenddata = this.copydata.legenddata || [];
        this.chartData = this.copydata.chartData || []; //原始数据
    }

    //初始化
    _init(){
        if(yearOrMonth(this.nUnit)){
            this.legenddata = this.legenddata.map(name=>{return setVisibleName(name, this.nUnit)});
        }
    }

    //柱图、折线图表格数据
    make3DTable(){
        this._init();

        let legenddata = this.legenddata;
        let thead = yearOrMonth(this.xUnit)? this.xdata.map(name=>{return setVisibleName(name, this.xUnit)}): this.xdata;
        thead.unshift(""); //在thead前插入空字符串

        thead.forEach((item, index) => {
            if(index != 0){
                thead[index] = item + setUnit(this.xUnit);
            }
        });
    
        this.vdata.forEach((tr, index) => {
            let tdFirst = legenddata[index] || "";

            //第一列补充单位
            let trFirst = tdFirst.toString().indexOf("增长率")!=-1? 
                tdFirst+setUnit("%"): tdFirst+setUnit(this.vUnit || this.yUnit);
            tr.unshift(trFirst);
        });
    
        return {
            "thead": thead,
            "tbody": this.vdata,
            "tableArr": [thead].concat(this.vdata),
            "tabledata": arr2obj(thead, this.vdata)
        };
    }

    //饼图表格数据
    make2DTable(){
        let isPer = this.vUnit=="%"? true: false; //默认需要转成比例
        let sum = 0;
        let tbody = [];
    
        if(isPer) sum = Enumerable.from(this.chartData).sum(o=>o.value);
    
        this.chartData.forEach(item => {
            let tr = isPer? [item.name, ((item.value/sum)*100).toFixed(2)]: [item.name, item.value];
            tbody.push(tr);
        })
        let thead = [(this.nTitle || "名称"), this.vTitle+setUnit(this.vUnit)];

        return {
            "thead": thead,
            "tbody": tbody,
            "tableArr": [thead].concat(tbody),
            "tabledata": this.chartData
        };
    }

    //散点图表格数据
    make4DTable(){
        let tbody = [];
        let xUnit = this.xUnit;
        let yUnit = this.yUnit;
        let vUnit = this.vUnit;
        
        let lastvals = ["", 0, 0, 0]; //存储上一年的值
        this.chartData.forEach(item => {
            let tr = [];
            let name = setVisibleName(item.name, this.nUnit);
            //表格行
            if(this.vTitle){
                tr = [name, item.x, item.y, item.value];
            }else{
                tr = [name, item.x, item.y];
            }
            tbody.push(tr);
            
            //如果单位为年或月，继续求增长率，否则退出本次循环
            if(yearOrMonth(this.nUnit)){
                let raiseTr = [];
                for (var i=0; i<tr.length; i++){
                    if(i==0){ //如果是第一项
                        raiseTr.push(tr[i]+"增长率");
                        
                    }else{
                        if(lastvals[i] == 0){
                            raiseTr.push(0);
                        }else{
                            let rate = ((tr[i]-lastvals[i])/lastvals[i]*100).toFixed(2);
                            raiseTr.push(parseFloat(rate) + "%");  
                        }
                        lastvals[i] = tr[i];
                    } 
                }
                tbody.push(raiseTr);
            }
        })

        let thead = this.vTitle? 
            [this.nTitle, this.xTitle+setUnit(xUnit), this.yTitle+setUnit(yUnit), this.vTitle+setUnit(vUnit)]: 
            [this.nTitle, this.xTitle+setUnit(xUnit), this.yTitle+setUnit(yUnit)];
    
        return {
            "thead": thead,
            "tbody": tbody,
            "tableArr": [thead].concat(tbody),
            "tabledata": arr2obj(thead, tbody)
        };
    }

    //3d表格(去除单位)
    make3DTableNU(){
        this._init();

        let legenddata = this.legenddata;
        //console.log(this.legenddata);

        let thead = this.xdata.map(o=>{return o.replace(",","，")});
        thead.unshift(""); //在thead前插入空字符串
        
        //在自己行最前面插入标题
        this.vdata.forEach((tr, index) => { 
            tr.unshift(legenddata[index]); 
        });
    
        return {
            "thead": thead,
            "tbody": this.vdata,
            "tableArr": [thead].concat(this.vdata),
            "tabledata": arr2obj(thead, this.vdata)
        };
    }


    //散点图表格数据(去除单位)
    make4DTableNU(){
        let tbody = [];
        let lastvals = ["", 0, 0, 0]; //存储上一年的值

        this.chartData.forEach(item => {
            let tr = [];
            let name = yearOrMonth(this.nUnit)? item.name+this.nUnit: item.name;
            //表格行
            if(this.vTitle){
                tr = [name, item.x, item.y, item.value];
            }else{
                tr = [name, item.x, item.y];
            }
            tbody.push(tr);

            //如果单位为年或月，继续求增长率，否则退出本次循环
            if(yearOrMonth(this.nUnit)){
                let raiseTr = [];
                for (var i=0; i<tr.length; i++){
                    if(i==0){ //如果是第一项
                        raiseTr.push(tr[i]+"增长率");
                        
                    }else{
                        if(lastvals[i] == 0){
                            raiseTr.push(0);
                        }else{
                            let rate = ((tr[i]-lastvals[i])/lastvals[i]*100).toFixed(2);
                            raiseTr.push(parseFloat(rate));  
                        }
                        lastvals[i] = tr[i];
                    } 
                }
                tbody.push(raiseTr);
            }
            
        })

        let thead = this.vTitle? 
            [this.nTitle, this.xTitle, this.yTitle, this.vTitle]: 
            [this.nTitle, this.xTitle, this.yTitle];

        return {
            "thead": thead,
            "tbody": tbody,
            "tableArr": [thead].concat(tbody),
            "tabledata": arr2obj(thead, tbody)
        };
    }

}

export{Table}

//年或月
function yearOrMonth(unit){
    return (unit=="月" || unit=="年")? true: false;
}

//设置单位
function setUnit(unit){
    return ( unit && !yearOrMonth(unit) )? "(" + unit + ")": "";
}

//设置显示的名称(如果单位为年或月,在数字后插入单位)
function setVisibleName(name, unit){
    if(yearOrMonth(unit)){
        let strNum = name.replace(/[^0-9]/g,"");
        return name.replace(strNum, strNum+unit); 
    }else{
        return name;
    }
}

//二维数组转成JSON集合, eq:[["","2016","2017","2018"],["肺炎,病原体未特指",6857110,7096301,2441],["肺炎,病原体未特指增长率",0,3.49,-99.97]]
function arr2obj(thead, tbody){
    var arr = [];
    arr.push(thead);
    tbody.forEach(item=>{
        arr.push(item);
    });

    var newList = [];
    for (var i=1; i<arr[0].length; i++){
        for(var j=1; j<arr.length; j++){
            newList.push({"x":arr[0][i], "y":arr[j][0], "value":arr[j][i] });
        }
    }
    return newList;
}
