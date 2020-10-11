// 1.1 获取裁剪区域的 DOM 元素
var $image = $('#image')
// 1.2 配置选项
const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
}

// 1.3 创建裁剪区域
$image.cropper(options)

// 上传图片,获取图片按钮点击上传
$('#btnChooseImage').on('click', function () {
    $('#file').click();
})

// 修改图片
var layer = layui.layer;
$('#file').on('change', function (e) {
    // console.log(e.target.falies);
    var files = e.target.files;
    if (files.length === 0) {
        return layer.msg('请选择用户头像');
    }
    // 选择成功.修改图片
    // 1.拿到用户选择的文件
    var file = e.target.files[0];
    // 2根据选择的文件,创建一个对应的url地址
    var newImgURL = URL.createObjectURL(file);
    // 3先销毁旧的裁剪区域,在重新设置图片对应的url地址
    $image
        .cropper('destroy')      // 销毁旧的裁剪区域
        .attr('src', newImgURL)  // 重新设置图片路径
        .cropper(options)        // 重新初始化裁剪区域


})

$('#btnUpload').on('click', function () {
    var dataURL = $image
        .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
            width: 100,
            height: 100
        })
        .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
    // console.log(dataURL);
    // console.log(typeof dataURL);

    $.ajax({
        method: 'POST',
        url: '/my/update/avatar',
        data: {
            avatar: dataURL
        },
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg(res.message);
            }
            layer.msg('恭喜您，更换头像成功！');
            window.parent.getUserInof();
        }
    })
})

getUserInof();
function getUserInof() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success: function (res) {
            console.log(res);
            // 判断状态码
            if (res.status !== 0) {
                return layui.layer.msg(res.message);
            }
            // 请求成功 渲染用户头像信息
            // renderAvatar(res.data);
            $image
                .cropper('destroy')      // 销毁旧的裁剪区域
                .attr('src', res.data.user_pic)  // 重新设置图片路径
                .cropper(options)        // 重新初始化裁剪区域

        },

    })
}