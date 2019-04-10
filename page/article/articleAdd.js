layui.use(['form', 'layer', 'layedit', 'laydate', 'upload'], function () {
    var form = layui.form
    layer = parent.layer === undefined ? layui.layer : top.layer,
        laypage = layui.laypage,
        upload = layui.upload,
        layedit = layui.layedit,
        laydate = layui.laydate,
        $ = layui.jquery;


    //时间标签
    $.ajax({
        url: $.cookie("tempUrl") + "Memberlabel/selectAllTime.do?token=" + $.cookie("token") + "&pageNum=1&pageSize=30",
        type: "GET",
        success: function (result) {
            $.each(result.content,
                function (index, item) {
                    $("#label0").append($('<option value=' + item.remarks + '>' + item.labelname + '</option>'));
                });
            form.render();
        }
    });

    //普通标签
    $.ajax({
        url: $.cookie("tempUrl") + "Memberlabel/pagegGetAll.do?token=" + $.cookie("token") + "&pageNum=1&pageSize=30",
        type: "GET",
        success: function (result) {
            $.each(result.content,
                function (index, item) {
                    $("#label").append($('<option value=' + item.labelname + '>' + item.labelname + '</option>'));
                });
            form.render();
        }
    });

    //封面图上传
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
        articleTitle: function (val) {
            if (val == '' || val.length > 20) {
                return "文章标题格式不符";
            }
        },
        author: function (val) {
            if (val != '' && val.length > 122) {
                return "链接过长，请确认后添加";
            }
        },
        commission: function (val) {
            var regxCommission = /^\d+(\.\d+)?$/;
            if (!regxCommission.test(val) || val.length > 8) {
                return "提成金额格式不符";
            }
        }
    })
    form.on("submit(addNews)", function (data) {
        var temp = "";
        var label = null;
        if ($("#label0").val() != null && $("#label0").val() != "") {
            label = $("#label0").val();
        }
        if ($("#label").val() != null && $("#label").val() != "") {
            $.each($("#label").val(), function (index, item) {
                temp += "," + item;
            });
            if (label == null) {
                label = temp.substring(1);
            } else {
                label += "," + temp.substring(1);
            }
        }
        //弹出loading
        var index = top.layer.msg('数据提交中，请稍候', {icon: 16, time: false, shade: 0.8});
        $.ajax({
            url: $.cookie("tempUrl") + "article/articleAdd?token=" + $.cookie("token"),
            type: "POST",
            datatype: "application/json",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify({
                articleContent: layedit.getContent(editIndex),
                articleTitle: $(".articleTitle").val(),
                author: $(".author").val(),
                commission: $(".commission").val(),
                cover: coverUrl,
                createBy: $.cookie("truename"),
                label: label,
                remarks: "0"
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
        return false;
    })

    //创建一个编辑器
    var editIndex = layedit.build('news_content', {
        height: 500,
        uploadImage: {
            url: $.cookie("tempUrl") + 'file/uploadImageEdit?token=' + $.cookie("token")
        }
    });
})