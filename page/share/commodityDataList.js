layui.use(['form', 'layer', 'table', 'laytpl'], function () {
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        laytpl = layui.laytpl,
        table = layui.table;

    //商品数据列表
    var tableIns = table.render({
        elem: '#userList',
        url: $.cookie("tempUrl") + 'commodity/getCommodityShare',
        where: {token: $.cookie("token")},
        request: {
            pageName: 'pageNum' //页码的参数名称，默认：page
            , limitName: 'pageSize' //每页数据量的参数名，默认：limit
        },
        response: {
            statusName: 'code' //数据状态的字段名称，默认：code
            , statusCode: 0 //成功的状态码，默认：0
            , msgName: 'httpStatus' //状态信息的字段名称，默认：msg
            , countName: 'totalElements' //数据总数的字段名称，默认：count
            , dataName: 'content' //数据列表的字段名称，默认：data
        },
        cellMinWidth: 95,
        page: true,
        height: "full-125",
        limits: [10, 15, 20, 25],
        limit: 20,
        id: "userListTable",
        cols: [[
            {
                field: 'commodityName',
                title: '商品名称',
                minWidth: 300,
                align: 'center',
                templet: function (d) {
                    return '<a lay-event="new">' + d.commodityName + '</a>';
                }
            },
            {
                field: 'dealCount',
                title: '有效分享次数',
                minWidth: 150,
                align: 'center',
                templet: function (d) {
                    return d.dealCount + " 次"
                }
            },
            {
                field: 'shareTotalClick',
                title: '总点击数',
                minWidth: 150,
                align: 'center',
                templet: function (d) {
                    return d.clicks + " 次"
                }
            },
            {
                field: 'awardAmount',
                title: '总奖励金',
                minWidth: 150,
                align: 'center',
                templet: function (d) {
                    if (d.awardAmount == 0) {
                        return "0 元"
                    } else {
                        return d.awardAmount.toFixed(2) + " 元"
                    }
                }
            },
            {
                field: 'cjbl',
                title: '成交比例',
                minWidth: 150,
                align: 'center',
                templet: function (d) {
                    if (d.clicks == 0 || d.dealCount == 0) {
                        return "0 %"
                    } else {
                        return ((d.dealCount / d.clicks) * 100).toFixed(2) + " %"
                    }
                }
            },
            {title: '操作', minWidth: 150, templet: '#userListBar', fixed: "right", align: "center"}
        ]]
    });

    //搜索【此功能需要后台配合，所以暂时没有动态效果演示】
    $(".search_btn").on("click", function () {
        table.reload("userListTable", {
            url: $.cookie("tempUrl") + 'commodity/getCommodityShareByName',
            where: {commodityName: $(".searchVal").val(), token: $.cookie("token")},
            request: {
                pageName: 'pageNum' //页码的参数名称，默认：page
                , limitName: 'pageSize' //每页数据量的参数名，默认：limit
            },
            response: {
                statusName: 'code' //数据状态的字段名称，默认：code
                , statusCode: 0 //成功的状态码，默认：0
                , msgName: 'httpStatus' //状态信息的字段名称，默认：msg
                , countName: 'totalElements' //数据总数的字段名称，默认：count
                , dataName: 'content' //数据列表的字段名称，默认：data
            },
            cellMinWidth: 95,
            page: true,
            height: "full-125",
            limits: [10, 15, 20, 25],
            limit: 20,
            id: "userListTable",
            cols: [[
                {
                    field: 'commodityName',
                    title: '商品名称',
                    minWidth: 300,
                    align: 'center',
                    templet: function (d) {
                        return '<a lay-event="new">' + d.commodityName + '</a>';
                    }
                },
                {
                    field: 'dealCount',
                    title: '有效分享次数',
                    minWidth: 150,
                    align: 'center',
                    templet: function (d) {
                        return d.dealCount + " 次"
                    }
                },
                {
                    field: 'shareTotalClick',
                    title: '总点击数',
                    minWidth: 150,
                    align: 'center',
                    templet: function (d) {
                        return d.clicks + " 次"
                    }
                },
                {
                    field: 'awardAmount',
                    title: '总奖励金',
                    minWidth: 150,
                    align: 'center',
                    templet: function (d) {
                        if (d.awardAmount == 0) {
                            return "0 元"
                        } else {
                            return d.awardAmount.toFixed(2) + " 元"
                        }
                    }
                },
                {
                    field: 'cjbl',
                    title: '成交比例',
                    minWidth: 150,
                    align: 'center',
                    templet: function (d) {
                        if (d.clicks == 0 || d.dealCount == 0) {
                            return "0 %"
                        } else {
                            return ((d.dealCount / d.clicks) * 100).toFixed(2) + " %"
                        }
                    }
                },
                {title: '操作', minWidth: 150, templet: '#userListBar', fixed: "right", align: "center"}
            ]]
        })
    });

    //列表操作
    table.on('tool(userList)', function (obj) {
        var layEvent = obj.event,
            data = obj.data;

        if (layEvent === 'look') { //订单详情
            var index = layui.layer.open({
                title: "此商品的订单详情",
                type: 2,
                content: "commodityDetailList.html?code=" + data.code + "&commodityName=" + data.commodityName,
                success: function (layero, index) {
                    var body = layui.layer.getChildFrame('body', index);
                    setTimeout(function () {
                        layui.layer.tips('点击此处返回商品数据列表', '.layui-layer-setwin .layui-layer-close', {
                            tips: 3
                        });
                    }, 500)
                }
            })
            layui.layer.full(index);
            window.sessionStorage.setItem("index", index);
            //改变窗口大小时，重置弹窗的宽高，防止超出可视区域（如F12调出debug的操作）
            $(window).on("resize", function () {
                layui.layer.full(window.sessionStorage.getItem("index"));
            })
        } else if (layEvent === 'new') { //数据详情
            var index = layui.layer.open({
                title: "通过商品分享的数据",
                type: 2,
                content: "commodityNew.html?id=" + data.id + "&commodityName=" + data.commodityName,
                success: function (layero, index) {
                    var body = layui.layer.getChildFrame('body', index);
                    setTimeout(function () {
                        layui.layer.tips('点击此处返回商品数据列表', '.layui-layer-setwin .layui-layer-close', {
                            tips: 3
                        });
                    }, 500)
                }
            })
            layui.layer.full(index);
            window.sessionStorage.setItem("index", index);
            //改变窗口大小时，重置弹窗的宽高，防止超出可视区域（如F12调出debug的操作）
            $(window).on("resize", function () {
                layui.layer.full(window.sessionStorage.getItem("index"));
            })
        }
    });
})
