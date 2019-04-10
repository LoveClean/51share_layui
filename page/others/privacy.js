layui.use(['form', 'layer', 'table', 'laytpl', 'layedit'], function () {
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        laytpl = layui.laytpl,
        layedit = layui.layedit,
        table = layui.table;

    var content="加载失败，请尝试刷新...";

    $.ajax({
        url: $.cookie("tempUrl") + "admin/getInfo.do?token=" + $.cookie("token") + "&id=" + $.cookie("id"),
        type: "GET",
        success: function (result) {
            if (result.data.status != 8) {
                window.location.href = "../405.html";
            }
        }
    });

    $.ajax({
        url: $.cookie("tempUrl") + "agreement/getAgreement.do?token=" + $.cookie("token") + "&type=0",
        type: "GET",
        success: function (result) {
            content=result.data.content;
        }
    });

    var editIndex=null;

    setTimeout(function () {
        //创建一个编辑器
        editIndex = layedit.build('news_content', {
            height: 580,
            tool: [
                'strong' //加粗
                ,'italic' //斜体
                ,'underline' //下划线
                ,'del' //删除线
                ,'color' //删除线

                ,'|' //分割线

                ,'left' //左对齐
                ,'center' //居中对齐
                ,'right' //右对齐
                ,'face' //表情
            ]
        });
        layedit.setContent(editIndex, content);
    }, 500);

    form.on("submit(addNews)", function (data) {
        //弹出loading
        var index = top.layer.msg('数据提交中，请稍候', {icon: 16, time: false, shade: 0.8});
        $.ajax({
            url: $.cookie("tempUrl") + "agreement/updateAgreement.do?token=" + $.cookie("token"),
            type: "POST",
            datatype: "application/json",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify({
                content: layedit.getContent(editIndex),
                type: 0,
                updateBy: $.cookie("truename")
            }),
            success: function (result) {
                if (result.code == 0) {
                    layer.msg("更新成功");
                } else {
                    layer.msg("更新失败，请尝试再次提交...", {icon: 7, anim: 6});
                }
            }
        });
        return false;
    })
})