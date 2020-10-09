// 入口函数
$(function () {

    // 1获取用户信息
    getUserInof();

    var layer = layui.layer;
    // 点击按钮，实现退出功能
    $('#btnLogout').on('click', function () {
        // 提示用户是否确认退出
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
            //do something
            // 1. 清空本地存储中的 token
            localStorage.removeItem('token')
            // 2. 重新跳转到登录页面
            location.href = '/login.html'

            // 关闭 confirm 询问框
            layer.close(index)
        })
    })
});

// 获取用户的基本信息
// 注意：位置写到入口函数外边 后面代码中要使用这个方法 但是要求这个方法是一个全局函数
function getUserInof() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // 配置请求头信息 headers
        // headers: {
        //     //重新登陆 因为token过期事件12小时
        //     Authorization: localStorage.getItem
        //         ("token") || ""
        // },
        success: function (res) {
            // console.log(res);
            // 判断状态码
            if (res.status !== 0) {
                return layui.layer.msg(res.message);
            }
            // 请求成功 渲染用户头像信息
            renderAvatar(res.data);

        },
        // 防止为登录强行跳转
        // complete: function (res) {
        //     // console.log(res);
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
        //         localStorage.removeItem('token');

        //         location.href = '/login.html';
        //     }
        // }
    })
}

// 封装用户头像渲染函数
function renderAvatar(user) {
    // 1.用户名（昵称优先 没有用 username）
    var name = user.nickname || user.username;
    $("#welcome").html('欢迎&nbsp;&nbsp;' + name);
    // 2.用户头像
    if (user.user_pic !== null) {
        //     // if (false) {
        //     // 有头像
        $('.layui-nav-img').show().attr('src', user.user_pic);
        $('.text-avatar').hide();
    } else {
        // 没头像
        $('.layui-nav-img').hide();
        var text = name[0].toUpperCase();
        $('.text-avatar').show().html(text);
    }
} 