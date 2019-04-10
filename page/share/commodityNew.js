layui.use(['form', 'layer', 'table', 'laytpl'], function () {
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        laytpl = layui.laytpl,
        table = layui.table;

    var commodityName = decodeURI(window.location.search.substring(window.location.search.indexOf("&") + 15));
    //文章数据列表
    var tableIns = table.render({
        elem: '#userList',
        url: $.cookie("tempUrl") + 'sharedata_commodity/getShareById.do',
        where: {
            id: window.location.search.substring(4, window.location.search.indexOf("&")),
            token: $.cookie("token")
        },
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
                field: 'articleTitle', title: '商品名称', width: 330, align: 'center', templet: function (d) {
                    return '<a class="commodityInfo" style="color: #c00;">' + commodityName + '</a>';
                }
            },
            {field: 'memberPhone', title: '会员手机号', width: 330, align: "center"},
            {
                field: 'shareType', title: '分享方式', width: 330, align: "center", templet: function (d) {
                    if (d.shareType == 0) {
                        return 'QQ'
                    } else if (d.shareType == 1) {
                        return '微信好友'
                    } else if (d.shareType == 2) {
                        return '朋友圈'
                    } else if (d.shareType == 3) {
                        return '新浪微博'
                    } else {
                        return '复制链接'
                    }
                }
            },
            {field: 'ipAddress', title: 'IP记录', width: 330, align: "center"},
            {field: 'createDate', title: 'IP对应时间', width: 330, align: "center"}
        ]]
    });

    //搜索【此功能需要后台配合，所以暂时没有动态效果演示】
    $(".search_btn").on("click", function () {
        table.reload("userListTable", {
            url: $.cookie("tempUrl") + 'sharedata_commodity/getShareByIdByPhone.do',
            where: {
                phone: $(".searchVal").val(),
                id: window.location.search.substring(4, window.location.search.indexOf("&")),
                token: $.cookie("token")
            },
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
                    field: 'articleTitle', title: '商品名称', width: 330, align: 'center', templet: function (d) {
                        return '<a class="commodityInfo" style="color: #c00;">' + commodityName + '</a>';
                    }
                },
                {field: 'memberPhone', title: '会员手机号', width: 330, align: "center"},
                {
                    field: 'shareType', title: '分享方式', width: 330, align: "center", templet: function (d) {
                        if (d.shareType == 0) {
                            return 'QQ'
                        } else if (d.shareType == 1) {
                            return '微信好友'
                        } else if (d.shareType == 2) {
                            return '朋友圈'
                        } else if (d.shareType == 3) {
                            return '新浪微博'
                        } else {
                            return '复制链接'
                        }
                    }
                },
                {field: 'ipAddress', title: 'IP记录', width: 330, align: "center"},
                {field: 'createDate', title: 'IP对应时间', width: 330, align: "center"}
            ]]
        })
    });

    //点击标题查看详情
    $(document).on("click", ".commodityInfo", function () {
        sessionStorage.setItem("commodityName", commodityName);
        var index = layui.layer.open({
            title: commodityName,
            type: 2,
            maxmin: true, //开启最大化最小化按钮
            area: ["900px", "540px"],
            content: "commodityInfo.html",
            success: function (layero, index) {
                var body = layui.layer.getChildFrame('body', index);
                setTimeout(function () {
                    layui.layer.tips('点击此处关闭', '.layui-layer-setwin .layui-layer-close', {
                        tips: 3
                    });
                }, 500)
            }
        })
    });
})
