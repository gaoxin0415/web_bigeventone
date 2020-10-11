$(function () {
    //快速赋值
    var form = layui.form;
    var layer = layui.layer;
    var laypage = layui.laypage;

    // 1.1美化时间过滤器
    template.defaults.imports.dataFormat = function (dtStr) {
        var dt = new Date(dtStr);
        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate());

        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    }

    function padZero(n) {
        return n > 9 ? n : '0' + n;
    }
    // 1定义查询参数
    var q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: "",
        state: '',
    }

    //2获取文章列表数据的方法
    initTable();
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                var str = template("tpl-table", res);
                $('tbody').html(str);
                // 分页
                renderPage(res.total);
            }
        })
    }

    // 3初始化分类
    initCate();
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                var htmlStr = template("tpl-cate", res);
                $('[name=cate_id]').html(htmlStr);
                form.render();
            }
        })
    }

    //4 筛选功能
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        // 获取
        var state = $("[name=state]").val();
        var cate_id = $("[name=cate_id]").val();
        // 赋值
        q.state = state;
        q.cate_id = cate_id;
        // 初始化表单
        initTable();
    })

    // 定义渲染分页的方法
    function renderPage(total) {
        // 调用 laypage.render() 方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox', // 分页容器的 Id
            count: total, // 总数据条数
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum, // 设置默认被选中的分页
            // 分页模块设置，显示哪些子模块
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],  //每页显示多少条数据的选择器

            // 触发jump，分页初始化的时候，页面改变的时候
            jump: function (obj, first) {
                // obj所有参数所在的对象，first是否是第一次初始化分页
                // 改变当前页
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;


                // 判断不是第一次初始化，才能调用初始化文章列表
                if (!first) {
                    // 初始化文章列表
                    initTable();
                }
            }
        })
    }
    $('tbody').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id');
        layer.confirm('是否确认删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }


                    layer.msg('删除文章成功！')
                    // 页面总删除数个数等于1，页码大于1
                    if ($(".btn-delete").length == 1 && q.pagenum > 1) q.pagenum--;
                    // 因为更新成功所以要重新进行页面渲染
                    initTable();

                }
            })
            layer.close(index);
        });
    })
})