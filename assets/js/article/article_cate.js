$(function () {
    // 要使用layer.open方法
    var layer = layui.layer;
    // 快速填充数据
    var form = layui.form;
    initArtCateList()


    // 获取文章分类的列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }
    // 为添加类别按钮添加点击事件

    //每一种弹层调用方式，都会返回一个index
    var indexAdd = null;
    $('#btnAddCate').on('click', function (e) {
        e.preventDefault();
        //   添加类别修改信息
        indexAdd = layer.open({
            //    默认type属性为0
            type: 1,
            // 更改弹出层面积
            area: ['500px', '250px'],
            title: '添加文章类别',
            content: $('#dialog-add').html(),
        });
    })


    //通过代理的形式为form-add绑定submit事件（因为刚开始没有form-add元素，只有追加后才有（动态创建的）） 
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        // console.log('ok');
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // 重新获取数据
                initArtCateList();
                layer.msg('恭喜您，添加数据成功');
                // 根据索引关闭弹出层
                layer.close(indexAdd);
            }
        })
    })

    //每一种弹层调用方式，都会返回一个index
    // 通过代理的形式给btn-edit按钮绑定点击事件，tbody是button的父元素所以给他绑也行
    var indexEdit = null;
    $('tbody').on('click', '.btn-edit', function () {
        // console.log(11);
        // 弹出修改文章分类信息
        indexEdit = layer.open({
            //    默认type属性为0
            type: 1,
            // 更改弹出层面积
            area: ['500px', '250px'],
            title: '修改文章类别',
            content: $('#dialog-edit').html(),
        });
        // 添加自定义属性,通过attr方法获取data-id的值，发起ajax获取对应的值
        var id = $(this).attr('data-id');
        // console.log(id);
        // 获取对应分类数据
        $.ajax({
            method: 'get',
            url: '/my/article/cates/' + id,
            success: function (res) {
                // console.log(res);
                // 通过form.val 给指定表单填充值
                form.val("form-edit", res.data);
            }

        })
    })


    // 通过代理的形式给修改表单绑定submit事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败！')
                }
                layer.msg('更新分类数据成功！')
                layer.close(indexEdit)
                initArtCateList()
            }
        })
    })

    $('tbody').on('click', '.btn-delete', function () {
        // console.log(1111);
        var id = $(this).attr('data-id');
        // 提示用户是否删除
        layer.confirm('确认删除？?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'get',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }
                    layer.msg("恭喜您，删除数据成功");
                    initArtCateList();
                    layer.close(index);
                }

            })



        });
    })
})