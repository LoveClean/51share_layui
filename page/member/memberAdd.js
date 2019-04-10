layui.config({
    base: "../../js/"
}).extend({
    "address": "address"
})
layui.use(['form', 'layer', "address"], function () {
    var form = layui.form
    layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery;
    address = layui.address;

    //标签
    $.ajax({
        url: $.cookie("tempUrl") + "Memberlabel/pagegGetAll.do?token=" + $.cookie("token") + "&pageNum=1&pageSize=30",
        type: "GET",
        success: function (result) {
            $.each(result.content,
                function (index, item) {
                    $(".userHobby").append($('<input type="checkbox" title=' + item.labelname + '>'));
                });
            form.render();
        }
    });
    //获取省信息
    address.provinces();

    form.on("submit(addUser)", function (data) {
        //弹出loading
        var index = top.layer.msg('数据提交中，请稍候', {icon: 16, time: false, shade: 0.8});
        var province = $("#province").parent().find("div").find("div").find("input").val();
        var city = $("#city").parent().find("div").find("div").find("input").val();
        var area = $("#area").parent().find("div").find("div").find("input").val();
        var address = province + "-" + city + "-" + area;
        if ($("#province").parent().find("div").find("div").find("input").val() == "") {
            address = null;
        }
        var sex = "0";
        if ($(".layui-form-radioed").find("span").text() == "女") {
            sex = "1";
        }
        var label = "";
        $(".userHobby div[class='layui-unselect layui-form-checkbox layui-form-checked']").each(function () {
            label = label + "," + $(this).find("span").text();
        });
        $.ajax({
            url: $.cookie("tempUrl") + "Member/add.do?token=" + $.cookie("token"),
            type: "PUT",
            datatype: "application/json",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify({
                address: address,
                alipayAccount: $(".alipayAccount").val(),
                alipayName: $(".alipayName").val(),
                icon: "http://share-app2.oss-cn-beijing.aliyuncs.com/2018072018f628aef3-ef1c-4c37-a086-4ded36c911cc.jpg?x-oss-process=image/resize,m_lfit,h_300,w_300/circle,r_300/format,png",
                nickname: $(".userName").val(),
                password: $(".password").val(),
                sex: sex,
                truename: $(".userEmail").val(),
                label: label.substring(1),
                phone: $(".userPhone").val()
            }),
            success: function (result) {
                if (result.httpStatus == 200) {
                    setTimeout(function () {
                        top.layer.close(index);
                        top.layer.msg("会员添加成功！");
                        layer.closeAll("iframe");
                        //刷新父页面
                        parent.location.reload();
                    }, 2000);
                } else {
                    layer.alert(result.exception, {icon: 7, anim: 6});
                }
            }
        });
        return false;
    })

    //格式化时间
    function filterTime(val) {
        if (val < 10) {
            return "0" + val;
        } else {
            return val;
        }
    }

    //定时发布
    var time = new Date();
    var submitTime = time.getFullYear() + '-' + filterTime(time.getMonth() + 1) + '-' + filterTime(time.getDate()) + ' ' + filterTime(time.getHours()) + ':' + filterTime(time.getMinutes()) + ':' + filterTime(time.getSeconds());

})