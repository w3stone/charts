import FileSaver from 'file-saver'
import XLSX from 'xlsx'

//合并对象
function mergeJson(prev, next){
    if(!(Object.getOwnPropertyNames(prev).length>0)) return false;
    var newJson = {};

    for(var key in prev){
        //debugger;
        if(next.hasOwnProperty(key)){ //如果next有key属性
            if(typeof prev[key] == "object"){ //如果是对象
                let prevKey = JSON.parse(JSON.stringify(prev[key])); //深拷贝
                newJson[key] = Object.assign(prevKey, next[key]);
                mergeJson(prev[key], next[key]); //递归
                
            }else{ //如果不是对象
                newJson[key] = next[key];
            }
        }else{ //如果next没有key属性
            newJson[key] = prev[key];
        }
    }

    //补充next独有的属性
    for(var key in next){
        if(!newJson.hasOwnProperty(key)){
            newJson[key] = next[key];
        }
    }

    return newJson;
}

//导出excel
function exportExcel(dom, excelName){
    /* generate workbook object from table */
    var wb = XLSX.utils.table_to_book(dom);
    /* get binary string as output */
    var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
    try {
        FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), excelName + '.xlsx')
    } catch (e) { if (typeof console !== 'undefined') console.log(e, wbout) }
    return wbout;
}

export{
    mergeJson, exportExcel
}