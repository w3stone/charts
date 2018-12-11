/**地图封装**/
import {BaseChart} from './baseChart.js'

class MapChart extends BaseChart{

    //占比饼图
    chinaMap(mapConfig){
        let seriesData = [];

        let provinceList  = [
			{"name":"北京","en":"Beijing"},
			{"name":"山西","en":"Shanxi"},
			{"name":"辽宁","en":"Liaoning"},
			{"name":"内蒙古","en":"Neimenggu"},
			{"name":"山东","en":"Shandong"},
			{"name":"四川","en":"Sichuan"},
			{"name":"陕西","en":"Shanxi"},
			{"name":"青海","en":"Qinghai"},
			{"name":"宁夏","en":"Ningxia"},
			{"name":"天津","en":"Tianjin"},
			{"name":"重庆","en":"Chongqing"},
			{"name":"安徽","en":"Anhui"},
			{"name":"浙江","en":"Zhejiang"},
			{"name":"云南","en":"Yunnan"},
			{"name":"西藏","en":"Xizang"},
			{"name":"新疆","en":"Xinjiang"},
			{"name":"台湾","en":"Taiwan"},
			{"name":"湖北","en":"Hubei"},
			{"name":"河南","en":"Henan"},
			{"name":"吉林","en":"Jilin"},
			{"name":"黑龙江","en":"Heilongjiang"},
			{"name":"江苏","en":"Jiangsu"},
			{"name":"福建","en":"Fujian"},
			{"name":"河北","en":"Hebei"},
			{"name":"湖南","en":"Hunan"},
			{"name":"江西","en":"Jiangxi"},
			{"name":"海南","en":"Hainan"},
			{"name":"上海","en":"Shanghai"},
			{"name":"澳门","en":"Macau"},
			{"name":"广东","en":"Guangdong"},
			{"name":"广西","en":"Guangxi"},
			{"name":"贵州","en":"Guizhou"},
			{"name":"甘肃","en":"Gansu"},
			{"name":"钓鱼岛","en":"Diaoyudao"},
			{"name":"香港","en":"Hong Kong"},
			{"name":"南海诸岛","en":""}
        ];
        
        provinceList.forEach(item => {
            let valueArr = this.chartData.filter(o=>{return o.name==item.name});
            let value = valueArr.length>0? valueArr[0].value: "";
            
            let p = {
                name: item.name, 
                value: value,
                itemStyle: {
                    normal: {
                        areaColor: "#349eea",
                        borderColor: "#fff"
                    }
                }
            };
            //如果没有值
            if(!value){
                p.itemStyle.normal = {
                    borderColor: '#ccc',
                    areaColor: '#f3f3f3'
                }
                p.itemStyle.emphasis = {
                    borderColor: '#ccc',
                    areaColor: '#f3f3f3'
                }
            }
            seriesData.push(p);
        });

        //设置range的最大值
        let valueMax = Enumerable.from(this.chartData).max(o=>o.value);
        let rangeMax = parseInt((parseInt(valueMax/10) + 1) + "0");

        let option = {
            tooltip: {
                trigger: 'item',
                show: true,
                formatter:(ele)=>{
                    return ele.name + ":" + (ele.value || 0);
                }
            },
            dataRange: {
                min: 0,
                max: rangeMax,
                x: 'left',
                y: 'bottom',
                text: ['多', '少'], // 文本，默认为数值文本
                calculable: true
            },
            series: [
                {
                    name: 'name',
                    type: 'map',
                    mapType: 'china',
                    zoom: 1.2,
                    selectedMode: 'single',
                    label: {
                        normal: {
                            show: true,
                            formatter: function (data) {
                                if (data.value) {
                                    return data.name + data.value;
                                } else {
                                    return data.name;
                                }
                            },
                            fontSize: mapConfig.labelFontSize
                        },
                        emphasis: {
                            show: true,
                            color: "#000"
                        }
                    },
                    data: seriesData
                }
            ]
        };

        return option;
    }

}

//导出
export {
    MapChart
}