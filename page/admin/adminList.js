layui.use(['form', 'layer', 'table', 'laytpl'], function () {
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        laytpl = layui.laytpl,
        table = layui.table;

    $.ajax({
        url: $.cookie("tempUrl") + "admin/getInfo.do?token=" + $.cookie("token") + "&id=" + $.cookie("id"),
        type: "GET",
        success: function (result) {
            if (result.data.status != 8) {
                window.location.href = "../405.html";
            }
        }
    });

    //用户列表
    var tableIns = table.render({
        elem: '#userList',
        url: $.cookie("tempUrl") + 'admin/getAll.do',
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
            {field: 'truename', title: '真实姓名', minWidth: 100, align: "center"},
            {field: 'phone', title: '手机号', align: 'center'},
            {field: 'createBy', title: '创建者', align: 'center'},
            {field: 'createDate', title: '创建时间', align: 'center', minWidth: 170},
            {field: 'updateBy', title: '更新者', align: 'center'},
            {field: 'updateDate', title: '最后更新时间', align: 'center', minWidth: 170},
            {
                field: 'status', title: '状态', align: 'center', templet: function (d) {
                    if (d.status == 0) {
                        return '<input type="checkbox" data-id=' + d.id + ' lay-skin="switch" lay-text="启用|禁用" checked>';
                    } else if (d.status == 1) {
                        return '<input type="checkbox" data-id=' + d.id + ' lay-skin="switch" lay-text="启用|禁用" >';
                    }
                }
            },
            {title: '操作', minWidth: 100, templet: '#userListBar', fixed: "right", align: "center"}
        ]]
    });

    //点击状态按钮事件
    $(document).on("click", ".layui-form-switch", function () {
        if ($(this).attr("class").indexOf("layui-form-onswitch") == -1) {
            var status = 1;
        } else {
            status = 0
        }
        $.ajax({
            url: $.cookie("tempUrl") + "admin/updateStatus.do?token=" + $.cookie("token") + "&id=" + $(this).siblings().attr("data-id") + "&status=" + status,
            type: "POST",
            success: function (result) {
                if (result.httpStatus == 200) {
                    layer.msg(result.data);
                } else {
                    layer.alert(result.exception, {icon: 7, anim: 6});
                }
            }
        });
    });

    //搜索【此功能需要后台配合，所以暂时没有动态效果演示】
    $(".search_btn").on("click", function () {
        table.reload("userListTable", {
            url: $.cookie("tempUrl") + 'admin/getFuzzy.do',
            where: {key: $(".searchVal").val(), token: $.cookie("token")},
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
                {field: 'truename', title: '真实姓名', minWidth: 100, align: "center"},
                {field: 'phone', title: '手机号', align: 'center'},
                {field: 'createBy', title: '创建者', align: 'center'},
                {field: 'createDate', title: '创建时间', align: 'center', minWidth: 170},
                {field: 'updateBy', title: '更新者', align: 'center'},
                {field: 'updateDate', title: '最后更新时间', align: 'center', minWidth: 170},
                {
                    field: 'status', title: '状态', align: 'center', templet: function (d) {
                        if (d.status == 0) {
                            return '<input type="checkbox" data-id=' + d.id + ' lay-skin="switch" lay-text="启用|禁用" checked>';
                        } else if (d.status == 1) {
                            return '<input type="checkbox" data-id=' + d.id + ' lay-skin="switch" lay-text="启用|禁用" >';
                        }
                    }
                },
                {title: '操作', minWidth: 100, templet: '#userListBar', fixed: "right", align: "center"}
            ]]
        })
    });

    //点击新增按钮事件
    $(".addNews_btn").click(function () {
        $("#addAdmin").modal({
            backdrop: "static"
        });
    })

    //批量删除
    $(".delAll_btn").click(function () {
        var checkStatus = table.checkStatus('userListTable'),
            data = checkStatus.data,
            newsId = [];
        if (data.length > 0) {
            for (var i in data) {
                newsId.push(data[i].id);
            }
            layer.confirm('确定删除选中的用户？', {icon: 3, title: '提示信息'}, function (index) {
                $.ajax({
                    url: $.cookie("tempUrl") + "admin/deleteSome.do?token=" + $.cookie("token") + "&ids=" + newsId + "&handler=" + $.cookie("truename"),
                    type: "DELETE",
                    success: function (result) {
                        layer.msg(result.data);
                        window.location.href = "adminList.html";
                    }
                });
                tableIns.reload();
                layer.close(index);
            })
        } else {
            layer.msg("请选择需要删除的用户");
        }
    })

    //列表操作
    table.on('tool(userList)', function (obj) {
        var layEvent = obj.event,
            data = obj.data;

        if (layEvent === 'edit') { //编辑
            //1.获取要编辑的会员信息
            getAdmin(data.id);
            //2.将编辑按钮data-id的值传递给更新按钮
            $("#stu_update_button").attr("edit-stuId", data.id);
            //3.显示模态框
            $("#updAdmin").modal({
                backdrop: "static"
            });
        } else if (layEvent === 'del') { //删除
            layer.confirm('确定删除此用户？', {icon: 3, title: '提示信息'}, function (index) {
                $.ajax({
                    url: $.cookie("tempUrl") + "admin/delete.do?token=" + $.cookie("token") + "&id=" + data.id + "&handler=" + $.cookie("truename"),
                    type: "DELETE",
                    success: function (result) {
                        layer.msg(result.data);
                        window.location.href = "adminList.html";
                    }
                });
                tableIns.reload();
                layer.close(index);
            });
        }
    });
    //************************以下代码作用与bootstrap******************************
    //（方法）根据id获取学生信息并在模态框中显示
    function getAdmin(id) {
        $.ajax({
            url: $.cookie("tempUrl") + "admin/getInfo.do?token=" + $.cookie("token") + "&id=" + id,
            type: "GET",
            success: function (result) {
                if (result != null) {
                    $("#updtruename").val(result.data.truename);
                    $("#updphone").val(result.data.phone);
                    $("#updpassword").val("");
                }
            }
        });
    }

    //校验状态提示方法
    function show_validate_status(element, status, message) {
        $(element).parent().removeClass("has-error has-success");
        if (status == "success") {
            $(element).parent().addClass("has-success");
            $(element).next("span").text(message);
        } else if (status == "error") {
            $(element).parent().addClass("has-error");
            $(element).next("span").text(message);
        }
    }

    //更新按钮的点击事件
    $(document).on("click", "#stu_update_button", function () {
        //1.对提交给服务器对数据进行规则校验
        if (!validata_update_form()) {
            return false;
        }
        //2.发送AJAX请求，保存学生数据
        $.ajax({
            url: $.cookie("tempUrl") + "admin/update.do?token=" + $.cookie("token") + "&id=" + $(this).attr("edit-stuId") + "&updateBy=" + $.cookie("truename"),
            type: "POST",
            data: $("#updAdmin form").serialize(),
            success: function (result) {
                if (result.httpStatus == 200) {
                    $("#updAdmin").modal("hide");
                    layer.msg("更新成功");
                    window.location.href = "adminList.html";
                } else {
                    layer.alert(result.exception, {icon: 7, anim: 6});
                }
            }
        });
    });

    //保存按钮的点击事件
    $(document).on("click", "#stu_save_button", function () {
        //1.对提交给服务器对数据进行规则校验
        if (!validata_add_form()) {
            return false;
        }
        $.ajax({
            url: $.cookie("tempUrl") + "admin/adminAdd.do?token=" + $.cookie("token") + "&create_by=" + $.cookie("truename"),
            type: "PUT",
            data: $("#addAdmin form").serialize(),
            success: function (result) {
                if (result.httpStatus == 200) {
                    layer.msg(result.data);
                    //0.还原表单状态
                    reset_form("#addAdmin form");
                    $("#addAdmin").modal("hide");
                    window.location.href = "adminList.html";
                } else {
                    layer.alert(result.exception, {icon: 7, anim: 6});
                }
            }
        });
    });

    //方法：对提交给服务器对数据进行规则校验(提交时校验)
    function validata_add_form() {
        //校验Name合法性
        var stuName = $("#truename").val();
        var regxName = /^[\u4E00-\u9FFF]+$/;
        if (!regxName.test(stuName)) {
            show_validate_status("#truename", "error", "姓名格式不合法。");
            return false;
        } else {
            show_validate_status("#truename", "success", "");
        }
        //校验Phone合法性
        var stuPhone = $("#phone").val();
        var regxPhone = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
        if (!regxPhone.test(stuPhone)) {
            show_validate_status("#phone", "error", "手机号码格式不合法!");
            return false;
        } else {
            show_validate_status("#phone", "success", "");
        }
        //校验初始密码合法性
        var stuRegTime = $("#password").val();
        var regxRegTime = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{7,12}$/;
        if (!regxRegTime.test(stuRegTime)) {
            show_validate_status("#password", "error", "密码必须由7-12位数字加字母组成。");
            return false;
        } else {
            show_validate_status("#password", "success", "");
        }
        return true;
    }

    //update，方法：对提交给服务器对数据进行规则校验(提交时校验)
    function validata_update_form() {
        //校验Name合法性
        var stuName = $("#updtruename").val();
        var regxName = /^[\u4E00-\u9FFF]+$/;
        if (!regxName.test(stuName)) {
            show_validate_status("#updtruename", "error", "姓名格式不合法。");
            return false;
        } else {
            show_validate_status("#updtruename", "success", "");
        }
        //校验Phone合法性
        var stuPhone = $("#updphone").val();
        var regxPhone = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
        if (!regxPhone.test(stuPhone)) {
            show_validate_status("#updphone", "error", "手机号码格式不合法!");
            return false;
        } else {
            show_validate_status("#updphone", "success", "");
        }
        //校验密码合法性
        var stuBirthday = $("#updpassword").val();
        var regxBirthday = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{7,12}$/;
        if (stuBirthday == "" || stuBirthday == null) {
            return true;
        } else if (!regxBirthday.test(stuBirthday)) {
            show_validate_status("#updpassword", "error", "密码必须由7-12位数字加字母组成。");
            return false;
        } else {
            show_validate_status("#updpassword", "success", "");
        }
        return true;
    }

    //重置表单的方法
    function reset_form(element) {
        //清除表单的数据
        $(element)[0].reset();
        //清除校验状态
        $(element).find("*").removeClass("has-error has-success");
        //清除提示信息
        $(element).find(".help-block").text("");
    }
})
