layui.use(['form', 'layer', 'table', 'laytpl'], function () {
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        laytpl = layui.laytpl,
        table = layui.table;

    //会员标签
    $.ajax({
        url: $.cookie("tempUrl") + "Memberlabel/pagegGetAll.do?token=" + $.cookie("token") + "&pageNum=1&pageSize=30",
        type: "GET",
        success: function (result) {
            $.each(result.content,
                function (index, item) {
                    $("#labelname").append($('<option value=' + item.labelname + '>' + item.labelname + '</option>'));
                });
            form.render();
        }
    });

    //点击状态按钮事件
    $(document).on("click", ".layui-form-switch", function () {
        if ($(this).attr("class").indexOf("layui-form-onswitch") == -1) {
            $.ajax({
                url: $.cookie("tempUrl") + "Member/stop.do?token=" + $.cookie("token"),
                type: "POST",
                datatype: "application/json",
                contentType: "application/json;charset=utf-8",
                data: JSON.stringify({
                    id: $(this).siblings().attr("data-id"),
                    updateBy: $.cookie("truename")
                }),
                success: function (result) {
                    if (result.code == 0) {
                        layer.msg(result.data);
                    } else {
                        layer.alert(result.exception, {icon: 7, anim: 6});
                    }
                }
            });
        } else {
            $.ajax({
                url: $.cookie("tempUrl") + "Member/liftStop.do?token=" + $.cookie("token"),
                type: "POST",
                datatype: "application/json",
                contentType: "application/json;charset=utf-8",
                data: JSON.stringify({
                    id: $(this).siblings().attr("data-id"),
                    updateBy: $.cookie("truename")
                }),
                success: function (result) {
                    if (result.code == 0) {
                        layer.msg(result.data);
                    } else {
                        layer.alert(result.exception, {icon: 7, anim: 6});
                    }
                }
            });
        }

    });

    //用户列表
    var tableIns = table.render({
        elem: '#userList',
        url: $.cookie("tempUrl") + 'Member/page.do',
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
            {
                field: 'nickname', title: '会员昵称', minWidth: 100, align: "center", templet: function (d) {
                    return '<a lay-event="edit">' + d.nickname + '</a>';
                }
            },
            {
                field: 'sex', title: '性别', align: 'center', width: 90, sort: true, templet: function (d) {
                    return '<span>' + (d.sex == 0 ? "男" : "女") + '</span>'
                }
            },
            {field: 'phone', title: '手机号', width: 170, align: 'center'},
            {field: 'address', title: '地区', minWidth: 180, align: 'center', sort: true},
            {field: 'label', title: '标签', minWidth: 180, align: 'center'},
            {field: 'createDate', title: '注册时间', minWidth: 170, align: 'center'},
            {
                field: 'status', title: '状态', align: 'center', templet: function (d) {
                    if (d.delFlag != 2) {
                        return '<input type="checkbox" data-id=' + d.id + ' lay-skin="switch" lay-text="启用|禁用" checked>';
                    } else{
                        return '<input type="checkbox" data-id=' + d.id + ' lay-skin="switch" lay-text="启用|禁用" >';
                    }
                }
            },
            {title: '操作', minWidth: 160, templet: '#userListBar', fixed: "right", align: "center"}
        ]]
    });

    //搜索【此功能需要后台配合，所以暂时没有动态效果演示】
    $(".search_btn").on("click", function () {
        table.reload("userListTable", {
            url: $.cookie("tempUrl") + 'Member/pageLike.do',
            where: {
                phone: $(".phone").val(),
                nickname: $(".nickname").val(),
                label: $("#labelname").val(),
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
                {
                    field: 'nickname', title: '会员昵称', minWidth: 100, align: "center", templet: function (d) {
                        return '<a lay-event="edit">' + d.nickname + '</a>';
                    }
                },
                {
                    field: 'sex', title: '性别', align: 'center', width: 90, sort: true, templet: function (d) {
                        return '<span>' + (d.sex == 0 ? "男" : "女") + '</span>'
                    }
                },
                {field: 'phone', title: '手机号', width: 170, align: 'center'},
                {field: 'address', title: '地区', minWidth: 180, align: 'center', sort: true},
                {field: 'label', title: '标签', minWidth: 180, align: 'center'},
                {field: 'createDate', title: '注册时间', minWidth: 170, align: 'center'},
                {
                    field: 'status', title: '状态', align: 'center', templet: function (d) {
                        if (d.delFlag != 2) {
                            return '<input type="checkbox" data-id=' + d.id + ' lay-skin="switch" lay-text="启用|禁用" checked>';
                        } else{
                            return '<input type="checkbox" data-id=' + d.id + ' lay-skin="switch" lay-text="启用|禁用" >';
                        }
                    }
                },
                {title: '操作', minWidth: 160, templet: '#userListBar', fixed: "right", align: "center"}
            ]]
        })
    });

    //点击新增按钮事件
    $(".addNews_btn").click(function () {
        var index = layui.layer.open({
            title: "新增会员",
            type: 2,
            content: "memberAdd.html",
            success: function (layero, index) {
                var body = layui.layer.getChildFrame('body', index);
                setTimeout(function () {
                    layui.layer.tips('点击此处返回文章列表', '.layui-layer-setwin .layui-layer-close', {
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
    })

    //更新用户--取值
    function addUser(edit) {
        sessionStorage.setItem("label", edit.label) //标签
        var adds = edit.address.split("-");
        //截取三级地名
        var flag = edit.address.indexOf("-");
        var flag2 = edit.address.indexOf("-", flag + 1)
        var province = edit.address.substring(0, flag);
        var city = edit.address.substring(flag + 1, flag2);
        var area = edit.address.substring(flag2 + 1);
        sessionStorage.setItem("province", province) //标签
        var index = layui.layer.open({
            title: "更新用户",
            type: 2,
            content: "memberUpd.html",
            success: function (layero, index) {
                var body = layui.layer.getChildFrame('body', index);
                if (edit) {
                    body.find(".userName").attr("data-id", edit.id);  //传ID
                    body.find(".userName").val(edit.nickname);  //昵称
                    body.find(".userEmail").val(edit.truename);  //真实姓名
                    body.find(".userSex input[value=" + (edit.sex == 0 ? "男" : "女") + "]").prop("checked", "checked");  //性别
                    body.find(".userPhone").val(edit.phone);  //手机号
                    body.find(".createDate").val(edit.createDate);  //创建时间

                    body.find("#province option[value='']").text(province);
                    body.find("#city option[value='']").text(city);
                    body.find("#area option[value='']").text(area);//地区*******************************

                    body.find(".alipayAccount").val(edit.alipayAccount);    //支付宝账号
                    body.find(".alipayName").val(edit.alipayName);    //支付宝姓名
                    form.render();
                }
                setTimeout(function () {
                    layui.layer.tips('点击此处返回用户列表', '.layui-layer-setwin .layui-layer-close', {
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
                    url: $.cookie("tempUrl") + "Member/deleteSome.do?token=" + $.cookie("token") + "&ids=" + newsId + "&updateBy=" + $.cookie("truename"),
                    type: "DELETE",
                    success: function (result) {
                        layer.msg(result.data);
                        window.location.href = "memberList.html";
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
            addUser(data);
        } else if (layEvent === 'del') { //删除
            layer.confirm('确定删除此用户？', {icon: 3, title: '提示信息'}, function (index) {
                $.ajax({
                    url: $.cookie("tempUrl") + "Member/delete.do?token=" + $.cookie("token") + "&id=" + data.id + "&updateBy=" + $.cookie("truename"),
                    type: "DELETE",
                    success: function (result) {
                        layer.msg(result.data);
                        window.location.href = "memberList.html";
                    }
                });
                tableIns.reload();
                layer.close(index);
            });
        }
    });

})
