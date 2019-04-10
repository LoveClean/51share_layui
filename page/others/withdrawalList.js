layui.use(['form', 'layer', 'table', 'laydate', 'laytpl'], function () {
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        laytpl = layui.laytpl,
        laydate = layui.laydate,
        table = layui.table;

    //请选择开始日期
    laydate.render({
        elem: '.startDay',
        format: 'yyyy-MM-dd',
        trigger: 'click',
        max: 0,
        mark: {"0-1-1": "元旦"},
        done: function (value, date) {
            if (date.month === 1 && date.date === 1) { //点击每年12月15日，弹出提示语
                layer.msg('今天是元旦，新年快乐！');
            }
        }
    });
    //请选择截止日期
    laydate.render({
        elem: '.endDay',
        format: 'yyyy-MM-dd',
        trigger: 'click',
        max: 0,
        mark: {"0-1-1": "元旦"},
        done: function (value, date) {
            if (date.month === 1 && date.date === 1) { //点击每年12月15日，弹出提示语
                layer.msg('今天是元旦，新年快乐！');
            }
        }
    });
    //校验日期
    form.verify({
        startDay: function (value) {
            if (new Date(value) >= new Date($(".endDay").val())) {
                return "起始日期需小于截止日期！";
            }
        }
        // ,
        // endDay: function (value) {
        //     if (new Date(value) <= new Date($(".startDay").val())) {
        //         return "请选择截止日期！";
        //     }
        // }
    })
    //佣金返利列表
    var tableIns = table.render({
        elem: '#userList',
        url: $.cookie("tempUrl") + 'Withdrawal/pageGetAll.do',
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
            {type: "checkbox", fixed: "left", width: 50},
            {field: 'remarks', title: '会员昵称', minWidth: 100, align: "center"},
            {field: 'createBy', title: '会员手机号', minWidth: 100, align: "center"},
            {field: 'createDate', title: '发起提现时间', align: 'center', minWidth: 170},
            {
                field: 'withdrawal', title: '提现金额', minWidth: 100, align: 'center', templet: function (d) {
                    return '<i class="layui-icon">&#xe65e;</i> ' + d.withdrawal + " 元"
                }
            },
            {
                field: 'status', title: '提现状态', align: 'center', templet: function (d) {
                    if (d.status == 0) {
                        return '<span style="color: #c00;">待处理</span>'
                    }else if (d.status == 2){
                        return '<span style="color: black;">涉嫌刷单</span>'
                    } else {
                        return '<span style="color: #C0C0C0;">已到账</span>'
                    }
                }
            },
            {field: 'alipayAccount', title: '支付宝账号', align: 'center'},
            {field: 'alipayName', title: '支付宝姓名', align: 'center'},
        ]]
    });

    //搜索
    form.on("submit(search_btn)", function () {
        var endDay = $(".endDay").val();
        if (endDay == null || endDay == "") {
            endDay = "2099-12-12"
        }
        table.reload("userListTable", {
            url: $.cookie("tempUrl") + 'Withdrawal/pageSearchLike.do',
            where: {
                key: $(".searchVal").val(),
                alipay: $(".alipayVal").val(),
                status: $("#status").val(),
                startDay: $(".startDay").val(),
                endDay: endDay,
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
                {type: "checkbox", fixed: "left", width: 50},
                {field: 'remarks', title: '会员昵称', minWidth: 100, align: "center"},
                {field: 'createBy', title: '会员手机号', minWidth: 100, align: "center"},
                {field: 'createDate', title: '发起提现时间', align: 'center', minWidth: 170},
                {
                    field: 'withdrawal', title: '提现金额', minWidth: 100, align: 'center', templet: function (d) {
                        return '<i class="layui-icon">&#xe65e;</i> ' + d.withdrawal + " 元"
                    }
                },
                {
                    field: 'status', title: '提现状态', align: 'center', templet: function (d) {
                        if (d.status == 0) {
                            return '<span style="color: #c00;">待处理</span>'
                        }else if (d.status == 2){
                            return '<span style="color: black;">涉嫌刷单</span>'
                        } else {
                            return '<span style="color: #C0C0C0;">已到账</span>'
                        }
                    }
                },
                {field: 'alipayAccount', title: '支付宝账号', align: 'center'},
                {field: 'alipayName', title: '支付宝姓名', align: 'center'},
            ]]
        })
    });

    //批量修改状态
    $(".delAll_btn").click(function () {
        var checkStatus = table.checkStatus('userListTable'),
            data = checkStatus.data,
            newsId = [];
        if (data.length > 0) {
            for (var i in data) {
                newsId.push(data[i].id);
            }
            layer.confirm('确定将选中的记录更改为【已到账】？', {icon: 3, title: '提示信息'}, function (index) {
                $.ajax({
                    url: $.cookie("tempUrl") + "Withdrawal/statusUptLis.do?token=" + $.cookie("token") + "&ids=" + newsId + "&updateBy=" + $.cookie("truename"),
                    type: "POST",
                    success: function (result) {
                        layer.msg(result.data);
                        window.location.href = "withdrawalList.html";
                    }
                });
                tableIns.reload();
                layer.close(index);
            })
        } else {
            layer.msg("您还未勾选任何记录");
        }
    })

    //涉嫌刷单
    $(".damage").click(function () {
        var checkStatus = table.checkStatus('userListTable'),
            data = checkStatus.data,
            newsId = [];
        if (data.length > 0) {
            for (var i in data) {
                newsId.push(data[i].id);
            }
            layer.confirm('确定将选中的记录更改为【涉嫌刷单】？', {icon: 3, title: '提示信息'}, function (index) {
                $.ajax({
                    url: $.cookie("tempUrl") + "Withdrawal/statusIllegal.do?token=" + $.cookie("token") + "&ids=" + newsId + "&updateBy=" + $.cookie("truename"),
                    type: "POST",
                    success: function (result) {
                        layer.msg(result.data);
                        window.location.href = "withdrawalList.html";
                    }
                });
                tableIns.reload();
                layer.close(index);
            })
        } else {
            layer.msg("您还未勾选任何记录");
        }
    })

    //导出未到账
    $(document).on("click", "#downloadByStatus",
        function () {
            window.location.href = $.cookie("tempUrl") + "Withdrawal/ExcelDownloadsByStatus?token=" + $.cookie("token");
        });

    //导出所有
    $(document).on("click", "#downloadAll",
        function () {
            window.location.href = $.cookie("tempUrl") + "Withdrawal/ExcelDownloadsAll?token=" + $.cookie("token");
        });
})
