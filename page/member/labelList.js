layui.use(['form', 'layer', 'table', 'laytpl'], function () {
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        laytpl = layui.laytpl,
        table = layui.table;

    //日期标签校验
    var patrn = /^\d{1,3}$/;
    //标签列表
    var tableIns = table.render({
        elem: '#userList',
        url: $.cookie("tempUrl") + 'Memberlabel/selectAllAll.do',
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
            {field: 'labelname', title: '标签名', minWidth: 100, align: "center", sort: true},
            {title: '操作', minWidth: 100, templet: '#userListBar', fixed: "right", align: "center"}
        ]]
    });

    //点击新增标签
    $(".addNews_btn").click(function () {
        $("#addLabel").modal({
            backdrop: "static"
        });
    });

    //点击时间标签
    $(document).ready(function () {
        $("#isTimeLabel").change(function () {
            if ($("#isTimeLabel0").attr("hidden") != "hidden") {
                $("#isTimeLabel0").attr("hidden", true);
            } else {
                $("#isTimeLabel0").removeAttr("hidden");
            }
        });
    });

    //保存按钮的点击事件
    $(document).on("click", "#save_button",
        function () {
            if ($("#isTimeLabel0").attr("hidden") == "hidden") {
                $.ajax({
                    url: $.cookie("tempUrl") + "Memberlabel/add.do?token=" + $.cookie("token"),
                    type: "PUT",
                    datatype: "application/json",
                    contentType: "application/json;charset=utf-8",
                    data: JSON.stringify({
                        createBy: $.cookie("truename"),
                        labelname: $("#labelname").val()
                    }),
                    success: function (result) {
                        if (result.httpStatus == 200) {
                            layer.msg(result.data);
                            //0.还原表单状态
                            reset_form("#addLabel form");
                            $("#addLabel").modal("hide");
                            window.location.href = "labelList.html";
                        } else {
                            layer.alert(result.exception, {icon: 7, anim: 6});
                        }
                    }
                });
            } else if (!patrn.test($("#timeLabel").val())) {
                layer.alert("请输入正确的天数", {icon: 7, anim: 6});
            } else {
                $.ajax({
                    url: $.cookie("tempUrl") + "Memberlabel/add.do?token=" + $.cookie("token"),
                    type: "PUT",
                    datatype: "application/json",
                    contentType: "application/json;charset=utf-8",
                    data: JSON.stringify({
                        createBy: $.cookie("truename"),
                        labelname: $("#labelname").val(),
                        remarks: "#" + $("#timeLabel").val() + "#"
                    }),
                    success: function (result) {
                        if (result.httpStatus == 200) {
                            layer.msg(result.data);
                            //0.还原表单状态
                            reset_form("#addLabel form");
                            $("#addLabel").modal("hide");
                            window.location.href = "labelList.html";
                        } else {
                            layer.alert(result.exception, {icon: 7, anim: 6});
                        }
                    }
                });
            }
        });

    //更新按钮的点击事件
    $(document).on("click", "#upd_button",
        function () {
            if ($("#isTimeLabel2").attr("hidden") == "hidden") {
                if ($("#updlabelname").val() == $(this).attr("edit-lablename")) {
                    $("#updLabel").modal("hide");
                    window.location.href = "labelList.html";
                } else {
                    $.ajax({
                        url: $.cookie("tempUrl") + "Memberlabel/update.do?token=" + $.cookie("token"),
                        type: "POST",
                        datatype: "application/json",
                        contentType: "application/json;charset=utf-8",
                        data: JSON.stringify({
                            id: $(this).attr("edit-stuId"),
                            labelname: $("#updlabelname").val(),
                            updateBy: $.cookie("truename")
                        }),
                        success: function (result) {
                            if (result.httpStatus == 200) {
                                $("#updLabel").modal("hide");
                                layer.msg("更新成功");
                                window.location.href = "labelList.html";
                            } else {
                                layer.alert(result.exception, {icon: 7, anim: 6});
                            }
                        }
                    });
                }
            } else if (!patrn.test($("#timeLabel2").val())) {
                layer.alert("请输入正确的天数", {icon: 7, anim: 6});
            } else {
                $.ajax({
                    url: $.cookie("tempUrl") + "Memberlabel/update.do?token=" + $.cookie("token"),
                    type: "POST",
                    datatype: "application/json",
                    contentType: "application/json;charset=utf-8",
                    data: JSON.stringify({
                        id: $(this).attr("edit-stuId"),
                        labelname: $("#updlabelname").val(),
                        updateBy: $.cookie("truename"),
                        remarks: "#" + $("#timeLabel2").val() + "#"
                    }),
                    success: function (result) {
                        if (result.httpStatus == 200) {
                            $("#updLabel").modal("hide");
                            layer.msg("更新成功");
                            window.location.href = "labelList.html";
                        } else {
                            layer.alert(result.exception, {icon: 7, anim: 6});
                        }
                    }
                });
            }
        });

    //重置表单的方法
    function reset_form(element) {
        //清除表单的数据
        $(element)[0].reset();
        //清除校验状态
        $(element).find("*").removeClass("has-error has-success");
        //清除提示信息
        $(element).find(".help-block").text("");
    }

    //批量删除
    $(".delAll_btn").click(function () {
        var checkStatus = table.checkStatus('userListTable'),
            data = checkStatus.data,
            newsId = [];
        if (data.length > 0) {
            for (var i in data) {
                newsId.push(data[i].id);
            }
            layer.confirm('确定删除选中的标签？', {icon: 3, title: '提示信息'}, function (index) {
                $.ajax({
                    url: $.cookie("tempUrl") + "Memberlabel/deleteSome.do?token=" + $.cookie("token") + "&ids=" + newsId + "&updateBy=" + $.cookie("truename"),
                    type: "DELETE",
                    success: function (result) {
                        layer.msg(result.data);
                        window.location.href = "labelList.html";
                    }
                });
                tableIns.reload();
                layer.close(index);
            })
        } else {
            layer.msg("请选择需要删除的标签");
        }
    })

    //列表操作
    table.on('tool(userList)', function (obj) {
        var layEvent = obj.event,
            data = obj.data;

        if (layEvent === 'edit') { //编辑
            //1.传递值
            $("#updlabelname").val(data.labelname);
            $("#upd_button").attr("edit-stuId", data.id);
            $("#upd_button").attr("edit-lableName", data.labelname);
            //判断是否为时间标签
            if (data.remarks != null && data.remarks != "") {
                $("#isTimeLabel2").removeAttr("hidden");
                $("#timeLabel2").val(data.remarks.substring(1, data.remarks.length - 1));
            } else {
                $("#isTimeLabel2").attr("hidden", true);
            }
            //2.显示模态框
            $("#updLabel").modal({
                backdrop: "static"
            });
        } else if (layEvent === 'del') { //删除
            layer.confirm('确定删除此标签？', {icon: 3, title: '提示信息'}, function (index) {
                $.ajax({
                    url: $.cookie("tempUrl") + "Memberlabel/delete.do?token=" + $.cookie("token") + "&id=" + data.id + "&updateBy=" + $.cookie("truename"),
                    type: "DELETE",
                    success: function (result) {
                        layer.msg(result.data);
                        window.location.href = "labelList.html";
                    }
                });
                tableIns.reload();
                layer.close(index);
            });
        }
    });

})
