const myChart1 = echarts.init(document.getElementById('echartsDiv1'));

let option1;

// 初始化 option1
option1 = {
    title: {
        text: ''
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data: ['位置1', '位置2', '位置3', '位置4'] // 假设有5个位置
},
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    toolbox: {
        feature: {
            saveAsImage: {}
        }
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: [] // 初始为空，后续动态更新
    },
    yAxis: {
        type: 'value',
        name: '浓度'
    },
    series: [
        {
            name: '位置1',
            type: 'line',
            stack: '总量',
            data: [] // 初始为空，后续动态更新
        },
        {
            name: '位置2',
            type: 'line',
            stack: '总量',
            data: [] // 初始为空，后续动态更新
        },
        {
            name: '位置3',
            type: 'line',
            stack: '总量',
            data: [] // 初始为空，后续动态更新
        },
        {
            name: '位置4',
            type: 'line',
            stack: '总量',
            data: [] // 初始为空，后续动态更新
        },
    ]
};

// 更新数据的函数
function updateData() {
    // 模拟从服务器获取数据，这里用随机数代替
    const newData = [];
    for (let i = 0; i < 5; i++) {
        newData.push(Math.floor(Math.random() * 10)); // 随机生成一氧化碳浓度数据
    }

    // 更新 xAxis 的数据，这里假设为星期，你可以根据实际情况修改
    const now = new Date();
    const days = ['1', '2', '3', '4', '5', '6', '7'];
    option1.xAxis.data.push(days[now.getDay()]);
    if (option1.xAxis.data.length > 7) {
        option1.xAxis.data.shift(); // 删除第一个数据
    }

    // 更新 series 的数据
    option1.series.forEach((series, index) => {
        series.data.push(newData[index]);
        if (series.data.length > 7) {
            series.data.shift(); // 删除第一个数据
        }
    });

    // 设置新的 option1
    myChart1.setOption(option1);
}

// 每两秒更新一次数据
setInterval(updateData, 1000);

// 初始化时设置一次数据
updateData();





// 数据 2
let chartDom2 = document.getElementById('echartsDiv2');
let myChart2 = echarts.init(chartDom2);
let option2;

option2 = {
    series: [
        {
            type: 'gauge',
            center: ['50%', '60%'],
            startAngle: 200,
            endAngle: -20,
            min: 0,
            max: 60,
            splitNumber: 12,
            itemStyle: {
                color: '#FFAB91'
            },
            progress: {
                show: true,
                width: 30
            },
            pointer: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    width: 30
                }
            },
            axisTick: {
                distance: -45,
                splitNumber: 5,
                lineStyle: {
                    width: 2,
                    color: '#999'
                }
            },
            splitLine: {
                distance: -52,
                length: 14,
                lineStyle: {
                    width: 3,
                    color: '#999'
                }
            },
            axisLabel: {
                distance: -20,
                color: '#999',
                fontSize: 20
            },
            anchor: {
                show: false
            },
            title: {
                show: false
            },
            detail: {
                valueAnimation: true,
                width: '60%',
                lineHeight: 40,
                borderRadius: 8,
                offsetCenter: [0, '-15%'],
                fontSize: 30,
                fontWeight: 'bolder',
                formatter: '{value} °C',
                color: 'inherit'
            },
            data: [
                {
                    value: 40
                }
            ]
        },
        {
            type: 'gauge',
            center: ['50%', '60%'],
            startAngle: 200,
            endAngle: -20,
            min: 0,
            max: 60,
            itemStyle: {
                color: '#FD7347'
            },
            progress: {
                show: true,
                width: 8
            },
            pointer: {
                show: false
            },
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            splitLine: {
                show: false
            },
            axisLabel: {
                show: false
            },
            detail: {
                show: false
            },
            data: [
                {
                    value: 20
                }
            ]
        }
    ]
};

function generateRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

setInterval(function () {
    const random = +(generateRandomNumber(0.8, 0.9) * 45).toFixed(2);
    myChart2.setOption({
        series: [
            {
                data: [
                    {
                        value: random
                    }
                ]
            },
            {
                data: [
                    {
                        value: random
                    }
                ]
            }
        ]
    });
}, 1000);

option2 && myChart2.setOption(option2);



const ROOT_PATH = '../static';

const chartDom3 = document.getElementById('echartsDiv3');
const myChart3 = echarts.init(chartDom3);
let option3;

$.get(ROOT_PATH + '/Map_of_Iceland.svg', function (svg) {
    echarts.registerMap('iceland_svg', { svg: svg });
    option3 = {
        tooltip: {},
        geo: {
            tooltip: {
                show: true
            },
            map: 'iceland_svg',
            roam: true
        },
        series: {
            type: 'custom',
            coordinateSystem: 'geo',
            geoIndex: 0,
            zlevel: 1,
            data: [
                [488.2358421078053, 459.70913833075736, 100],
                [770.3415644319939, 757.9672194986475, 30],
                [1180.0329284196291, 743.6141808346214, 80],
                [894.03790632245, 1188.1985153835008, 61],
                [1372.98925630313, 477.3839988649537, 70],
                [1378.62251255796, 935.6708486282843, 81]
            ],
            renderItem(params, api) {
                const coord = api.coord([
                    api.value(0, params.dataIndex),
                    api.value(1, params.dataIndex)
                ]);
                const circles = [];
                for (let i = 0; i < 5; i++) {
                    circles.push({
                        type: 'circle',
                        shape: {
                            cx: 0,
                            cy: 0,
                            r: 30
                        },
                        style: {
                            stroke: 'red',
                            fill: 'none',
                            lineWidth: 2
                        },
                        // Ripple animation
                        keyframeAnimation: {
                            duration: 4000,
                            loop: true,
                            delay: (-i / 4) * 4000,
                            keyframes: [
                                {
                                    percent: 0,
                                    scaleX: 0,
                                    scaleY: 0,
                                    style: {
                                        opacity: 1
                                    }
                                },
                                {
                                    percent: 1,
                                    scaleX: 1,
                                    scaleY: 0.4,
                                    style: {
                                        opacity: 0
                                    }
                                }
                            ]
                        }
                    });
                }
                return {
                    type: 'group',
                    x: coord[0],
                    y: coord[1],
                    children: [
                        ...circles,
                        {
                            type: 'path',
                            shape: {
                                d: 'M16 0c-5.523 0-10 4.477-10 10 0 10 10 22 10 22s10-12 10-22c0-5.523-4.477-10-10-10zM16 16c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6z',
                                x: -10,
                                y: -35,
                                width: 20,
                                height: 40
                            },
                            style: {
                                fill: 'red'
                            },
                            // Jump animation.
                            keyframeAnimation: {
                                duration: 1000,
                                loop: true,
                                delay: Math.random() * 1000,
                                keyframes: [
                                    {
                                        y: -10,
                                        percent: 0.5,
                                        easing: 'cubicOut'
                                    },
                                    {
                                        y: 0,
                                        percent: 1,
                                        easing: 'bounceOut'
                                    }
                                ]
                            }
                        }
                    ]
                };
            }
        }
    };
    myChart3.setOption(option3);
});

option3 && myChart3.setOption(option3);

// 数据4
let chartDom4 = document.getElementById('echartsDiv4');
let myChart4 = echarts.init(chartDom4);
let option4;
const originalData = [20, 80, 100, 120, 160, 220];

option4 = {
    title: {
        text: ''
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    legend: {},
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01]
    },
    yAxis: {
        type: 'category',
        data: ['设备6', '设备5', '设备4', '设备3', '设备2', '设备1']
    },
    series: [
        {
            name: '实际功率',
            type: 'bar',
            data: []
        },
        {
            name: '额定功率',
            type: 'bar',
            data: originalData
        }
    ]
};


function generateDataWithFluctuation(dataArray) {
    const newData = [];

    // 遍历原始数组中的每个数字
    for (let i = 0; i < dataArray.length; i++) {
        const value = dataArray[i];

        // 计算上下浮动的范围
        const fluctuationRange = value * 0.2; // 上下浮动20%

        // 生成上下浮动范围内的随机数
        const fluctuation = Math.random() * fluctuationRange * 2 - fluctuationRange; // 上下浮动范围内的随机数

        // 计算新值并添加到 newData 数组中
        const newValue = value + fluctuation;
        newData.push(newValue);
    }

    return newData;
}


setInterval(function () {
    const random = +(Math.random() * 45).toFixed(2);
    myChart4.setOption({
        series: [
            {
                name: '实际功率',
                type: 'bar',
                data: generateDataWithFluctuation(originalData)
            },
            {
                name: '额定功率',
                type: 'bar',
                data: originalData
            }
        ]
    });
}, 1000);

option4 && myChart4.setOption(option4);