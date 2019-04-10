layui.use(['form', 'layer', 'layedit', 'laydate', 'upload'], function () {
    var form = layui.form
    layer = parent.layer === undefined ? layui.layer : top.layer,
        laypage = layui.laypage,
        upload = layui.upload,
        layedit = layui.layedit,
        laydate = layui.laydate,
        $ = layui.jquery;

    $.ajax({
        url: $.cookie("tempUrl") + "article/getArticleByTitle?token=" + $.cookie("token") + "&articleTitle=" + sessionStorage.getItem("articleTitle"),
        type: "GET",
        success: function (result) {
            if (result.httpStatus == 200) {
                $(".articleTitle").val(result.data.articleTitle);  //文章标题
                $(".author").val(result.data.author);  //作者
                $(".commission").val(result.data.commission);  //提成金额
                $(".createDate").val(result.data.createDate);  //创建时间
                $("#demo1").attr("src", result.data.cover);  //封面图
                var articleContent = result.data.articleContent;
                setTimeout(function () {
                        //创建一个编辑器
                        var editIndex = layedit.build('news_content', {
                            tool: [],
                            height: 500
                        });
                        layedit.setContent(editIndex, articleContent);
                    }, 500
                )
            } else {
                layer.alert("异常错误，请联系管理员处理", {icon: 7, anim: 6});
            }
        }
    });
})