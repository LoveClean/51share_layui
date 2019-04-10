layui.use(['table'], function () {
    var table = layui.table;

    //系统日志
    table.render({
        elem: '#logs',
        url: $.cookie("tempUrl") + 'Syslog/pageGetAll.do',
        method: 'post',
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
        height: "full-20",
        limit: 20,
        limits: [10, 15, 20, 25],
        id: "systemLog",
        cols: [[
            {field: 'id', title: '流水号', minWidth: 150, align: "center"},
            {field: 'title', title: '标题', minWidth: 210},
            {field: 'requestUri', title: '请求地址', minWidth: 210},
            {
                field: 'remarks', title: '操作方式', align: 'center', templet: function (d) {
                    if (d.remarks.toUpperCase() == "GET") {
                        return '<span class="layui-blue">' + d.remarks + '</span>'
                    } else {
                        return '<span class="layui-red">' + d.remarks + '</span>'
                    }
                }
            },
            {field: 'remoteAddr', title: '操作IP', align: 'center', minWidth: 130},
            {
                field: 'exception', title: '是否异常', align: 'center', templet: function (d) {
                    if (d.exception == "") {
                        return '<span class="layui-btn layui-btn-green layui-btn-xs">正常</span>'
                    } else {
                        return '<span class="layui-btn layui-btn-danger layui-btn-xs">' + d.exception + '</span>'
                    }
                }
            },
            {field: 'createBy', title: '操作人', minWidth: 70, templet: '#newsListBar', align: "center"},
            {field: 'createDate', title: '操作时间', align: 'center', minWidth: 170}
        ]]
    });

})
