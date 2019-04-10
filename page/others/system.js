layui.use(['form', 'layer', 'laydate'], function () {
    var form = layui.form
    layer = parent.layer === undefined ? layui.layer : top.layer,
        laypage = layui.laypage,
        laydate = layui.laydate,
        $ = layui.jquery;

    $.ajax({
        url: $.cookie("tempUrl") + "config/getConfig.do?token=" + $.cookie("token"),
        type: "GET",
        datatype: "application/json",
        success: function (result) {
            if (result.code == 0) {
                $(".apex").val(result.data.maxShare);
                $(".time").val(result.data.intervalTime);
                $(".browseTime").val(result.data.browseTime);
            } else {
                layer.alert("系统异常，请刷新后再次尝试", {icon: 7, anim: 6});
            }
        }
    });

    var reg=/^\+?[1-9][0-9]*$/;

    form.verify({
        apex: function (val) {
            if (!reg.test(val) || val < 100) {
                return "分享上限数：最低不能少于100次";
            }
        },
        time: function (val) {
            if (!reg.test(val) || val > 10) {
                return "时间间隔：最高不能多于10秒";
            }
        }
    })

    form.on("submit(addNews)", function (data) {
        //弹出loading
        var index = top.layer.msg('数据提交中，请稍候', {icon: 16, time: false, shade: 0.8});
        $.ajax({
            url: $.cookie("tempUrl") + "config/setConfig.do?token=" + $.cookie("token"),
            type: "POST",
            datatype: "application/json",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify({
                maxShare: $(".apex").val(),
                intervalTime: $(".time").val(),
                updateBy: $.cookie("truename")
            }),
            success: function (result) {
                if (result.code == 0) {
                    layer.msg("更新成功");
                } else {
                    layer.alert("更新失败，请刷新后重试", {icon: 7, anim: 6});
                }
            }
        });
        return false;
    })
})