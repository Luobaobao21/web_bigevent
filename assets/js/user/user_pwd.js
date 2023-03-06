$(function(){
  var form = layui.form

  form.verify({
    pwd: [ /^[\S]{6,12}$/,'密码必须6到12位，且不能出现空格'],
    // 判断新密码是否与旧密码相同
    samePwd: function(value){
      if(value === $('[name=oldPwd]').val()){
        return '新密码不能和原密码相同！'
      }
    },
    //判断新密码是否与确认密码相同
    rePwd: function(value){
      if(value !== $('[name=newPwd]').val()){
        return '两次密码不一致！'
      }
    }
  })

  $('.layui-form').on('submit', function(e){
    e.preventDefault()
    $.ajax({
      method: 'POST', 
      url: '/my/updatepwd',
      // serialize()方法 格式:var data = $("#formID").serialize(); 功能:将表单内容序列化成一个字符串。 这样在ajax提交表单数据时,就不用一一列举出每一个参数。
      data: $(this).serialize(),
      success: function(res){
        if(res.status !== 0){
          return layui.layer.msg('更新密码失败！')
        }
        layui.layer.msg('更新密码成功！')
        // 重置表单
        $('.layui-form')[0].reset()
      }
    })
  })
})