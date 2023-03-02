// $.ajaxPrefilter([type],fn)
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
})