// 入口函数
$(function () {
    // 1自定义校验规则
    var form = layui.form;
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度必须在 1 ~ 6 个字符之间！'
            }
        }
    })
    initUserInfo();
    // 2初始化用户信息
    var layer = layui.layer;
    function initUserInfo() {
        $.ajax({
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);

                }

                console.log(res);
                form.val("formUserInfo", res.data);
            }
        })
    }
    // 重置按钮
    $('#btnReset').on('click', function (e) {
        // 组织默认行为
        e.preventDefault();
        initUserInfo();
    })


    // 修改用户信息
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        // 发起ajax请求
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg("恭喜您，修改成功");
                window.parent.getUserInof();
            }
        });
    })
})