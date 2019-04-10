layui.use(['form', 'layer', 'layedit', 'laydate', 'upload'], function () {
    var form = layui.form
    layer = parent.layer === undefined ? layui.layer : top.layer,
        laypage = layui.laypage,
        upload = layui.upload,
        layedit = layui.layedit,
        laydate = layui.laydate,
        $ = layui.jquery;

    //普通图片上传
    var coverUrl = null;
    var uploadInst = upload.render({
        elem: '#test1'
        , url: $.cookie("tempUrl") + 'file/uploadImage?token=' + $.cookie("token")
        , method: 'post'  //可选项。HTTP类型，默认post
        , before: function (obj) {
            //预读本地文件示例，不支持ie8
            obj.preview(function (index, file, result) {
                $('#demo1').attr('src', result); //图片链接（base64）
            });
        }
        , done: function (res) {
            //如果上传失败
            if (res.code > 0) {
                return layer.msg('上传失败');
            } else {
                //上传成功
                coverUrl = res.data;
            }
        }
        , error: function () {
            //演示失败状态，并实现重传
            var demoText = $('#demoText');
            demoText.html('<span style="color: #FF5722;">上传失败</span> <a class="layui-btn layui-btn-mini demo-reload">重试</a>');
            demoText.find('.demo-reload').on('click', function () {
                uploadInst.upload();
            });
        }
    });

    form.verify({
        imagename: function (val) {
            if (val == '' || val.length > 50) {
                return "请输入正确的名称";
            }
        },
        type: function (val) {
            if (val == '') {
                return "请选择一种类型";
            }
        }
    })
    form.on("submit(addNews)", function (data) {
        if (coverUrl == null) {
            layer.alert("请添加轮播图", {icon: 7, anim: 6});
        } else {
            $.ajax({
                url: $.cookie("tempUrl") + "Image/selectInfo.do?token=" + $.cookie("token"),
                type: "POST",
                datatype: "application/json",
                contentType: "application/json;charset=utf-8",
                data: JSON.stringify({
                    imagename: $(".imagename").val(),
                    type: $("#type").val(),
                }),
                success: function (result) {
                    if (result.data != null) {
                        //弹出loading
                        var index = top.layer.msg('数据提交中，请稍候', {icon: 16, time: false, shade: 0.8});
                        $.ajax({
                            url: $.cookie("tempUrl") + "Image/add.do?token=" + $.cookie("token"),
                            type: "PUT",
                            datatype: "application/json",
                            contentType: "application/json;charset=utf-8",
                            data: JSON.stringify({
                                imagename: $(".imagename").val(),
                                imageurl: coverUrl,
                                createBy: $.cookie("truename"),
                                type: $("#type").val(),
                            }),
                            success: function (result) {
                                if (result.code == 0) {
                                    layer.msg(result.data);
                                    setTimeout(function () {
                                        top.layer.close(index);
                                        top.layer.msg(result.data);
                                        layer.closeAll("iframe");
                                        //刷新父页面
                                        parent.location.reload();
                                    }, 500);
                                } else {
                                    layer.msg(result.exception, {icon: 7, anim: 6});
                                }
                            }
                        });
                    } else {
                        layer.alert(($("#type").val() == 1 ? "文章" : "商品") + '[' + $(".imagename").val() + "]不存在，请确认", {
                            icon: 7,
                            anim: 6
                        });
                    }
                },
                error: function () {
                    layer.alert("类型不存在，请联系管理员", {icon: 7, anim: 6})
                }
            });
            return false;
        }
    })
})