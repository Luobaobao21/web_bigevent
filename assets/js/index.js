// $(function(){})————————jQuery入口函数
$(function(){
  //调用getUserInfo函数，获取用户信息
  getUserInfo()
  var layer = layui.layer

  // 退出事件
  $('#btnLogout').on('click', function(){
    //提示用户是否确认退出
    layer.confirm('确定退出登录?', {icon: 3, title:'提示'}, function(index){
      // console.log('ok')
      //do something
      // 1、清空本地存储中的token
      localStorageNaNpxoveItem('token')
      // 2、重新跳转登录页面
      location.href = '/login.html'

      // 关闭询问框
      layer.close(index);
    });
  })
})

//获取用户基本信息的函数
function getUserInfo() {

  $.ajax({
    method: 'GET',
    url: '/my/userinfo',
    //headers 就是请求头配置对象
    // headers: {
    //   //从localStorage中获取身份认证字段
    //   Authorization: localStorage.getItem('token')||''
    // },
    success: function(res){
      // console.log(res)
      if(res.status !== 0) {
        return layui.layer.msg('获取用户信息失败！')
      }
      // 调用renderAvatar函数，渲染用户头像
    renderAvatar(res.data)
    },

    //不论成功还是失败，都会调用 complete 回调函数
    // complete: function(res) {
    //   // console.log('执行了complete回调')
    //   // console.log(res)
    //   // 在complete回调函数中，可以使用res.responseJSON拿到服务器响应回来的数据
    //   if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
    //     // 1、强制清空token
    //     localStorage.removeItem('token')
    //     // 2、强制跳转到登录页面
    //     location.href = '/login.html'
    //   }
    // }

  })

}

//渲染用户信息
function renderAvatar(user) {
  // 1、获取用户名称
  var name = user.nickname || user.username
  //2、设置欢迎文本
  $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
  // 3、按需渲染用户头像
  if(user.user_pic !== null){
    // 3.1 渲染图片头像
    // attr() 方法设置或返回被选元素的属性值。
    $('.layui-nav-img').attr('src', user.user_pic).show()
    $('.text-avatar').hide()
  } else {
    // 3.2 渲染文本头像
    $('.layui-nav-img').hide()
    //toUpperCase()————将字符转成大写
    var first = name[0].toUpperCase()
    $('.text-avatar').html(first).show()
  }
}

