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
            //第一列补充单位
            let trFirst = legenddata[index].toString().indexOf("增长率")!=-1? 
                legenddata[index]+setUnit("%"): legenddata[index]+setUnit(this.vUnit || this.yUnit);
            tr.unshift(trFirst);
        });
    
        return {
            thead: thead,
            tbody: this.vdata
        };
    }

    make2DTable(){
        let isPer = this.vUnit=="%"? true: false; //默认需要转成比例
        let sum = 0;
        let tbody = [];
    
        if(isPer) sum = Enumerable.from(this.chartData).sum(o=>o.value);
    
        this.chartData.forEach(item => {
            let tr = isPer? [item.name, ((item.value/sum)*100).toFixed(2)]: [item.name, item.value];
            tbody.push(tr);
        })

        return {
            thead: [(this.nTitle || "名称"), this.vTitle+setUnit(this.vUnit)],
            tbody: tbody
        };
    }

    make4DTable(){
        let tbody = [];
        let xUnit = this.xUnit;
        let yUnit = this.yUnit;
        let vUnit = this.vUnit;
    
        this.chartData.forEach(item => {
            let tr = [];
            let name = setVisibleName(item.name, this.nUnit);

            if(this.vTitle){
                tr = [name, item.x, item.y, item.value];
            }else{
                tr = [name, item.x, item.y];
            }
            tbody.push(tr);
        })
    
        return {
            thead: this.vTitle? 
                [(this.nTitle || "名称"), this.xTitle+setUnit(xUnit), this.yTitle+setUnit(yUnit), this.vTitle+setUnit(vUnit)]: 
                [(this.nTitle || "名称"), this.xTitle+setUnit(xUnit), this.yTitle+setUnit(yUnit)],
            tbody: tbody
        };
    }

    //3d表格(去除单位)
    make3DTableNU(){
        this._init();

        let legenddata = this.legenddata;
        console.log(this.legenddata);

        let thead = this.xdata.map(o=>{return o.replace(",","，")});
        thead.unshift(""); //在thead前插入空字符串

        let rateList = [];

        //如果charttype为101, 插入增长率行
        if(this.chartType==101){ 
            this.vdata.forEach((tr, index) => { 
                if(index>0){
                    let rateTr = [];
                    for(var j=0; j<tr.length; j++){
                        let rate = 0;
                        if(this.vdata[index-1][j]!=0){
                            rate = (this.vdata[index][j]-this.vdata[index-1][j])/this.vdata[index-1][j];
                        }else{
                            rate = 1;
                        }
                        rateTr.push( parseFloat((rate*100).toFixed(2)) );
                    }
                    rateTr.unshift(legenddata[index]+'增长率');
                    rateList.push(rateTr);
                }
            });
        }

        //在自己行最前面插入标题
        this.vdata.forEach((tr, index) => { 
            tr.unshift(legenddata[index]); 
        });
    
        return {
            thead: thead,
            tbody: this.vdata.concat(rateList)
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