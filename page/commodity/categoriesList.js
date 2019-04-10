layui.use(['form', 'layer', 'table', 'laytpl'], function () {
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        laytpl = layui.laytpl,
        table = layui.table;

    //标签列表
    var tableIns = table.render({
        elem: '#userList',
        url: $.cookie("tempUrl") + 'category/getList.do',
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
            {field: 'orderby', title: '序号', minWidth: 100, align: "center", sort: true},
            {field: 'categoriesname', title: '品类名', minWidth: 100, align: "center"},
            {title: '操作', minWidth: 100, templet: '#userListBar', fixed: "right", align: "center"}
        ]]
    });

    //点击新增标签
    $(".addNews_btn").click(function () {
        $("#addLabel").modal({
            backdrop: "static"
        });
    })

    //保存按钮的点击事件
    $(document).on("click", "#save_button",
        function () {
            //1.对提交给服务器对数据进行规则校验
            if (!validata_add_form()) {
                return false;
            }
            $.ajax({
                url: $.cookie("tempUrl") + "category/add.do?token=" + $.cookie("token"),
                type: "PUT",
                datatype: "application/json",
                contentType: "application/json;charset=utf-8",
                data: JSON.stringify({
                    createBy: $.cookie("truename"),
                    categoriesname: $("#categoriesname").val(),
                    orderby: $("#orderby").val()
                }),
                success: function (result) {
                    if (result.httpStatus == 200) {
                        layer.msg(result.data);
                        //0.还原表单状态
                        reset_form("#addLabel form");
                        $("#addLabel").modal("hide");
                        window.location.href = "categoriesList.html";
                    } else {
                        layer.alert(result.exception, {icon: 7, anim: 6});
                    }
                }
            });
        });

    //更新按钮的点击事件
    $(document).on("click", "#upd_button",
        function () {
            $.ajax({
                url: $.cookie("tempUrl") + "category/update.do?token=" + $.cookie("token"),
                type: "POST",
                datatype: "application/json",
                contentType: "application/json;charset=utf-8",
                data: JSON.stringify({
                    id: $(this).attr("edit-stuId"),
                    categoriesname: $("#updcategoriesname").val(),
                    orderby: $("#updorderby").val(),
                    updateBy: $.cookie("truename")
                }),
                success: function (result) {
                    if (result.httpStatus == 200) {
                        $("#updLabel").modal("hide");
                        layer.msg("更新成功");
                        window.location.href = "categoriesList.html";
                    } else {
                        layer.alert(result.exception, {icon: 7, anim: 6});
                    }
                }
            });
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
            layer.confirm('确定删除选中的商品品类？', {icon: 3, title: '提示信息'}, function (index) {
                $.ajax({
                    url: $.cookie("tempUrl") + "category/deleteSome.do?token=" + $.cookie("token") + "&ids=" + newsId + "&handler=" + $.cookie("truename"),
                    type: "DELETE",
                    success: function (result) {
                        layer.msg(result.data);
                        window.location.href = "categoriesList.html";
                    }
                });
                tableIns.reload();
                layer.close(index);
            })
        } else {
            layer.msg("请选择需要删除的商品品类");
        }
    })

    //列表操作
    table.on('tool(userList)', function (obj) {
        var layEvent = obj.event,
            data = obj.data;

        if (layEvent === 'edit') { //编辑
            //1.传递值
            $("#updorderby").val(data.orderby);
            $("#updcategoriesname").val(data.categoriesname);
            $("#upd_button").attr("edit-stuId", data.id);
            //2.显示模态框
            $("#updLabel").modal({
                backdrop: "static"
            });
        } else if (layEvent === 'del') { //删除
            layer.confirm('确定删除此商品品类？', {icon: 3, title: '提示信息'}, function (index) {
                $.ajax({
                    url: $.cookie("tempUrl") + "category/delete.do?token=" + $.cookie("token") + "&id=" + data.id + "&handler=" + $.cookie("truename"),
                    type: "DELETE",
                    success: function (result) {
                        if (result.code == 0) {
                            layer.msg(result.data);
                            window.location.href = "categoriesList.html";
                        } else {
                            layer.alert(result.exception, {icon: 7, anim: 6});
                        }
                    }
                });
                tableIns.reload();
                layer.close(index);
            });
        }
    });

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

    //方法：对提交给服务器对数据进行规则校验(提交时校验)
    function validata_add_form() {
        //校验序号合法性
        var stuName = $("#orderby").val();
        var regxName = /^\+?[1-9][0-9]*$/;
        if (!regxName.test(stuName)) {
            show_validate_status("#orderby", "error", "序号必须为非零的正整数。");
            return false;
        } else {
            show_validate_status("#orderby", "success", "");
        }
        //品类名合法性
        var categoriesname = $("#categoriesname").val();
        if (categoriesname == null || categoriesname == "") {
            show_validate_status("#categoriesname", "error", "商品品类名不能为空。");
            return false;
        } else {
            show_validate_status("#categoriesname", "success", "");
        }
        return true;
    }
})
