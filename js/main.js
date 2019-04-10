//获取系统时间
var newDate = '';
getLangDate();

var memberCounts = "0";
var articleCounts = "0";
var commodityCounts = "0";
var arrArticleTitle = new Array(4);
var arrShareNum = new Array(4);
var arrReward = new Array(4);
var commodityName = new Array(4);
var dealCount = new Array(4);
var awardAmount = new Array(4);

$(function () {
    $.ajax({
        url: $.cookie("tempUrl") + "Member/getAllCounts?token=" + $.cookie("token"),
        type: "GET",
        success: function (result) {
            memberCounts = result.data;
            $(".memberCounts span").text(memberCounts);
        }
    });
    $.ajax({
        url: $.cookie("tempUrl") + "article/getAllCounts?token=" + $.cookie("token"),
        type: "GET",
        success: function (result) {
            articleCounts = result.data;
            $(".articleCounts span").text(articleCounts);
        }
    });
    $.ajax({
        url: $.cookie("tempUrl") + "commodity/getAllCounts?token=" + $.cookie("token"),
        type: "GET",
        success: function (result) {
            commodityCounts = result.data;
            $(".commodityCounts span").text(commodityCounts);
        }
    });
    $.ajax({
        url: $.cookie("tempUrl") + "ShareDate/articleOrder.do?limit=4&token=" + $.cookie("token"),
        type: "GET",
        success: function (result) {
            var temp = 0;
            $.each(result.data, function (index, item) {
                arrArticleTitle[temp] = item.articleTitle;
                arrShareNum[temp] = item.shareNum;
                arrReward[temp] = item.reward;
                temp += 1;
            });
        }
    });
    $.ajax({
        url: $.cookie("tempUrl") + "sharedata_commodity/commodityOrder.do?limit=4&token=" + $.cookie("token"),
        type: "GET",
        success: function (result) {
            var temp2 = 0;
            $.each(result.data, function (index, item) {
                commodityName[temp2] = item.commodityName;
                dealCount[temp2] = item.dealCount;
                awardAmount[temp2] = item.awardAmount;
                temp2 += 1;
            });
        }
    });
})

//值小于10时，在前面补0
function dateFilter(date) {
    if (date < 10) {
        return "0" + date;
    }
    return date;
}

function getLangDate() {
    var dateObj = new Date(); //表示当前系统时间的Date对象
    var year = dateObj.getFullYear(); //当前系统时间的完整年份值
    var month = dateObj.getMonth() + 1; //当前系统时间的月份值
    var date = dateObj.getDate(); //当前系统时间的月份中的日
    var day = dateObj.getDay(); //当前系统时间中的星期值
    var weeks = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
    var week = weeks[day]; //根据星期值，从数组中获取对应的星期字符串
    var hour = dateObj.getHours(); //当前系统时间的小时值
    var minute = dateObj.getMinutes(); //当前系统时间的分钟值
    var second = dateObj.getSeconds(); //当前系统时间的秒钟值
    var timeValue = "" + ((hour >= 12) ? (hour >= 18) ? "晚上" : "下午" : "上午"); //当前时间属于上午、晚上还是下午
    newDate = dateFilter(year) + "年" + dateFilter(month) + "月" + dateFilter(date) + "日 " + " " + dateFilter(hour) + ":" + dateFilter(minute) + ":" + dateFilter(second);
    document.getElementById("nowTime").innerHTML = "亲爱的" + $.cookie("truename") + "，" + timeValue + "好！ 欢迎使用51纷享App后台管理。当前时间为： " + newDate + "　" + week;
    setTimeout("getLangDate()", 1000);
}

layui.use(['form', 'element', 'layer', 'jquery'], function () {
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        element = layui.element;
    $ = layui.jquery;
    //上次登录时间【此处应该从接口获取，实际使用中请自行更换】
    $(".loginTime").html(newDate.split("日")[0] + "日</br>" + newDate.split("日")[1]);
    //icon动画
    $(".panel a").hover(function () {
        $(this).find(".layui-anim").addClass("layui-anim-scaleSpring");
    }, function () {
        $(this).find(".layui-anim").removeClass("layui-anim-scaleSpring");
    })
    $(".panel a").click(function () {
        parent.addTab($(this));
    })


})
setTimeout(function () {
// 基于准备好的dom，初始化echarts实例
        var main = echarts.init(document.getElementById('main'));

//色差取值
//         var min = ((min = (memberCounts < articleCounts) ? memberCounts : articleCounts) < commodityCounts ? min : commodityCounts);
//         var max = ((max = (memberCounts > articleCounts) ? memberCounts : articleCounts) > commodityCounts ? max : commodityCounts);
        var min = (memberCounts < articleCounts) ? memberCounts : articleCounts;
        var max = (memberCounts > articleCounts) ? memberCounts : articleCounts;

// 指定图表的配置项和数据
        option = {
            backgroundColor: '#F5F5F5',

            title: {
                text: '数据总览',
                left: 'center',
                top: 20,
                textStyle: {
                    color: '#aaa'
                }
            },

            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },

            visualMap: {
                show: false,
                min: min - 10,
                max: max + 10,
                inRange: {
                    colorLightness: [0, 1]
                }
            },
            series: [
                {
                    name: '数据占比',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '50%'],
                    data: [
                        {value: articleCounts, name: '文章总数'},
                        {value: commodityCounts, name: '商品总数'}
                    ].sort(function (a, b) {
                        return a.value - b.value;
                    }),
                    roseType: 'radius',
                    label: {
                        normal: {
                            textStyle: {
                                color: 'rgba(0, 0, 0, 0.3)'
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            lineStyle: {
                                color: 'rgba(0, 0, 0, 0.3)'
                            },
                            smooth: 0.2,
                            length: 10,
                            length2: 20
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#c23531',
                            shadowBlur: 200,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    },

                    animationType: 'scale',
                    animationEasing: 'elasticOut',
                    animationDelay: function (idx) {
                        return Math.random() * 200;
                    }
                }
            ]
        };

// 使用刚指定的配置项和数据显示图表。
        main.setOption(option);


// 基于准备好的dom，初始化echarts实例
        var article = echarts.init(document.getElementById('article'));

// 指定图表的配置项和数据
        option = {
            title: {
                text: '热门文章',
                subtext: '详情前往文章数据中心'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: ['总分享数', '总奖励金']
            },
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
                data: [arrArticleTitle[0], arrArticleTitle[1], arrArticleTitle[2], arrArticleTitle[3]]
            },
            series: [
                {
                    name: '总分享数',
                    type: 'bar',
                    data: [arrShareNum[0], arrShareNum[1], arrShareNum[2], arrShareNum[3]]
                },
                {
                    name: '总奖励金',
                    type: 'bar',
                    data: [arrReward[0], arrReward[1], arrReward[2], arrReward[3]]
                }
            ]
        };

// 使用刚指定的配置项和数据显示图表。
        article.setOption(option);


// 基于准备好的dom，初始化echarts实例
        var commodity = echarts.init(document.getElementById('commodity'));

// 指定图表的配置项和数据
        option = {
            title: {
                text: '热门商品',
                subtext: '详情前往商品数据中心'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: ['总分享数', '总奖励金']
            },
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
                data: [commodityName[0], commodityName[1], commodityName[2], commodityName[3]]
            },
            series: [
                {
                    name: '总分享数',
                    type: 'bar',
                    data: [dealCount[0], dealCount[1], dealCount[2], dealCount[3]]
                },
                {
                    name: '总奖励金',
                    type: 'bar',
                    data: [awardAmount[0], awardAmount[1], awardAmount[2], awardAmount[3]]
                }
            ]
        };

// 使用刚指定的配置项和数据显示图表。
        commodity.setOption(option);

    }, 3000
)
