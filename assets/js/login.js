// $(function(){}) ----- 入口函数
$(function(){

  // 点击“去注册账号”链接时：
  $('#link_reg').on('click', function(){
    $('.login-box').hide()
    $('.reg-box').show()
  })

  // 点击“去登录”链接时：
  $('#link_login').on('click', function(){
    $('.login-box').show()
    $('.reg-box').hide()
  })

  //从layui中获取form对象
  var form = layui.form
  var layer = layui.layer
  // 通过form.verify()函数来自定义校验规则
  form.verify({
    'pwd': [
      /^[\S]{6,12}$/
      ,'密码必须6到12位，且不能出现空格'
    ] ,
    //校验密码是否一致
    'repwd': function(value){
      // 通过形参拿到确认密码框的value
      // 再拿到输入密码框的value，并进行比较
      var pwd = $('.reg-box [name=password]').val()
      // var pwd = $('#pwd').val()
      if(value !== pwd){
        return '两次密码不一致！'
      }
    }
  })

  // 监听注册表单的提交事件
  $('#form_reg').on('submit', function(e){
    //阻止默认提交行为
    e.preventDefault()
    //发起Ajax的post请求
    var data= {
      username: $('#form_reg [name=username]').val(), 
      password: $('#form_reg [name=password]').val() }
      // http://www.liulongbin.top:3007
    $.post('/api/reguser', data, function(res){
      if(res.status !== 0) {
        // return layui.layer.msg(res.message);
        return layer.msg(res.message)
      }
      layer.msg('注册成功,请登录！');
      // 模拟人的点击行为
      $('#link_login').click()
    })
  })

  //监听登录表单
  //可以用on也可以用submit事件
  $('#form_login').submit(function(e){
    e.preventDefault()
    // http://www.liulongbin.top:3007
    $.ajax({
      url: '/api/login',
      method: 'POST',
      // 快速获取表单中的数据，用jQuery中的serialize()函数
      data: $(this).serialize(),
      success: function(res){
        if(res.status !== 0){
          return layer.msg('登录失败！')
        }
        layer.msg('登录成功！')
        console.log(res.token)
        //将登录成功得到的token字符串保存到 localstorage中
        // localStorage 和 sessionStorage 属性允许在 Web浏览器中保存键/值对。
        // localStorage 对象存储没有到期日期的数据。浏览器关闭时数据不会被删除，并且会在第二天、周或一年后可用。
        localStorage.setItem('token', res.token)
        //跳转到后台主页
        location.href = '/index.html'
      }
    })
  })
})