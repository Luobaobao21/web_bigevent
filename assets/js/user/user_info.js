$(function(){
  var form = layui.form
  var layer = layui.layer

  // 自定义验证规则
  form.verify({
    nickname: function(value){
      if(value.length > 6){
        return '昵称长度必须在1～6个字符之间！'
      }
    }
  })

  initUserInfo()

  // 初始化用户的基本信息
  function initUserInfo(){
    $.ajax({
      method: 'GET', 
      url: '/my/userinfo', 
      success: function(res){
        if(res.status !== 0){
          return layer.msg('获取用户信息失败！')
        }
        // console.log(res)

      // 表单赋值 / 取值
      // 语法：form.val('filter', object);
      // 用于给指定表单集合的元素赋值和取值。如果 object 参数存在，则为赋值；如果 object 参数不存在，则为取值。
        form.val('formUserInfo', res.data)
      }
    })
  }

  // 提交修改
  $('.layui-form').on('submit', function (e) {
    // //阻止表单的默认重置行为
    e.preventDefault()
    // 发起ajax数据请求
    $.ajax({
      method: 'POST', 
      url: '/my/userinfo', 
      data: $(this).serialize(), 
      success: function (res) {
        if(res.status !== 0) {
          return layer.msg('更新用户信息失败！')
        }
        layer.msg('更新用户信息成功！')

        // 在子页面中调用父页面中的方法，重新渲染用户的头像和用户的信息
        window.parent.getUserInfo()
      }
    })
  })

  // 重置表单的数据
  $('#btnReset').on('click', function (e){
    //阻止表单的默认重置行为
    e.preventDefault()
    // 重新发起一次ajax请求，重新填充表单
    initUserInfo()
  })

})