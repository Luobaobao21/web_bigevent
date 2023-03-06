// $.ajaxPrefilter([type],fn)
// $.ajaxPrefilter()函数用于指定预先处理Ajax参数选项的回调函数
// ajax请求拦截器 每次发送ajax请求前先拦截拼接url地址
// ！！每次调用$.get或$.post或$.ajax()的时候，会先调用ajaxPrefilter()函数
// 此函数可以拿到我们给ajax提供的配置对象
$.ajaxPrefilter(function (options) {
  // 打印结果：/api/login
  // console.log(options.url)

  // 在发起真正的Ajax请求之前，统一拼接完整的URL
  // 方便管理，若改变URL，不需要手动修改每个请求
  options.url = 'http://www.liulongbin.top:3007' + options.url
  
  // 打印结果：http://www.liulongbin.top:3007/api/login
  // console.log(options.url)

  // indexOf()------该方法将从头到尾地检索字符串 stringObject，看它是否含有子串 searchvalue。开始检索的位置在字符串的 fromindex 处或字符串的开头（没有指定 fromindex 时）。如果找到一个 searchvalue，则返回 searchvalue 的第一次出现的位置。stringObject 中的字符位置是从 0 开始的。
  // 如果要检索的字符串值没有出现，则该方法返回 -1。
  if(options.url.indexOf('/my/') !== -1){
    // 统一为有权限的接口设置headers请求头
    options.headers = {
      Authorization: localStorage.getItem('token')||''
    }
  }


  // 全局统一挂载 complete回调函数
  options.complete = function(res){
    // 在complete回调函数中，可以使用res.responseJSON拿到服务器响应回来的数据
    if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
      // 1、强制清空token
      localStorage.removeItem('token')
      // 2、强制跳转到登录页面
      location.href = '/login.html'
    }
  }
})