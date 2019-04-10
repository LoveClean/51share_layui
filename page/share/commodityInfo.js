layui.use(['form', 'layer', 'layedit', 'laydate', 'upload'], function () {
    var form = layui.form
    layer = parent.layer === undefined ? layui.layer : top.layer,
        laypage = layui.laypage,
        upload = layui.upload,
        layedit = layui.layedit,
        laydate = layui.laydate,
        $ = layui.jquery;

    $.ajax({
        url: $.cookie("tempUrl") + "commodity/selectInfoByName.do?token=" + $.cookie("token") + "&commodityName=" + sessionStorage.getItem("commodityName"),
        type: "GET",
        success: function (result) {
            if (result.httpStatus == 200) {
                $(".commodityName").val(result.data.commodityName);  //商品名称
                $(".commodityLink").val(result.data.commodityLink);  //商品链接
                $(".commission").val(result.data.commission);  //商品品类
                $(".commodityPrices").val(result.data.commodityPrices);  //商品价格
                $(".createDate").val(result.data.createDate);  //创建时间
                $("#demo1").attr("src", result.data.cover);  //封面图
                var articleContent = result.data.commodityIntroduction;
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

    $.ajax({
        url: $.cookie("tempUrl") + "category/getList.do?token=" + $.cookie("token") + "&pageNum=1&pageSize=30",
        type: "GET",
        success: function (result) {
            $.each(result.content,
                function (index, item) {
                    if (sessionStorage.getItem("commodityCategory") == item.categoriesname) {
                        $("#commodityCategory").append($('<option value=' + item.categoriesname + ' selected>' + item.categoriesname + '</option>'));
                    } else {
                        $("#commodityCategory").append($('<option value=' + item.categoriesname + '>' + item.categoriesname + '</option>'));
                    }
                });
            form.render();
        }
    });


    //创建一个编辑器
    var editIndex = layedit.build('news_content', {
        height: 390,
        uploadImage: {
            url: $.cookie("tempUrl") + 'file/uploadImageEdit?token=' + $.cookie("token")
        }
    });
    layedit.setContent(editIndex, sessionStorage.getItem("commodityIntroduction"));

})