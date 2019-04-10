var form, $, areaData;
layui.config({
    base: "../../js/"
})
layui.use(['form', 'layer', 'upload', 'laydate'], function () {
    form = layui.form;
    $ = layui.jquery;
    var layer = parent.layer === undefined ? layui.layer : top.layer,
        upload = layui.upload,
        laydate = layui.laydate,
        address = layui.address;

    $(".truename").attr("value", $.cookie("truename"));
    $(function () {
        $.ajax({
            url: $.cookie("tempUrl") + "admin/getInfo.do?token=" + $.cookie("token") + "&id=" + $.cookie("id"),
            type: "GET",
            success: function (result) {
                if (result.data.status == 8) {
                    $("#role").attr("value", "超级管理员");
                } else {
                    $("#role").attr("value", "普通管理员");
                }
                $(".userPhone").attr("value", "");
                $(".userPhone").attr("value", result.data.phone);
            }
        });
    })

    //提交个人资料
    form.on("submit(changeUser)", function (data) {
        var index = layer.msg('提交中，请稍候', {icon: 16, time: false, shade: 0.8});

        $.ajax({
            url: $.cookie("tempUrl") + "admin/update.do?token=" + $.cookie("token") + "&id=" + $.cookie("id") + "&phone=" + $(".userPhone").val() + "&truename=" + $(".truename").val(),
            type: "POST",
            success: function (result) {
                if (result.httpStatus == 200) {
                    layer.msg("更新成功");
                    setTimeout(function () {
                        top.layer.close(index);
                        layer.closeAll("iframe");
                        //刷新父页面
                        parent.location.reload();
                    }, 1000);
                } else {
                    layer.alert(result.exception, {icon: 7, anim: 6});
                }
            }
        });
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    })
})