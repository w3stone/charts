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
        this.legenddata = this.copydata.legenddata || [];
        this.chartData = this.copydata.chartData || []; //原始数据
    }

    //初始化
    _init(){
        if(yearOrMonth(this.nUnit)){
            this.legenddata = this.legenddata.map(o=>{return o+this.nUnit});
        }
    }

    make3DTable(){
        this._init();
        this.xdata.unshift(""); //在xdata前插入空字符串
        let legenddata = this.legenddata;
    
        this.xdata.forEach((item, index) => {
            if(index != 0){
                this.xdata[index] = item + setUnit(this.xUnit);
            }
        });
    
        this.vdata.forEach((tr, index) => {
            let trFirst = legenddata[index].toString().indexOf("增长率")!=-1? 
                legenddata[index]+setUnit(this.yUnit): legenddata[index]+setUnit("%");
            tr.unshift(trFirst);
        });
    
        return {
            thead: this.xdata,
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
            let name = yearOrMonth(this.nUnit)? item.name+this.nUnit: item.name;

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