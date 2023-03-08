$(function () {
  var layer = layui.layer
  var form = layui.form
  var laypage = layui.laypage

  // 定义美化时间的过滤器
  template.defaults.imports.dataFormat = function (date) {
    const dt = new Date(date)

    var y = dt.getFullYear()
    // 月份从0到11
    var m = padZero(dt.getMonth() + 1)
    var d = padZero(dt.getDate())

    var hh = padZero(dt.getHours())
    var mm = padZero(dt.getMinutes())
    var ss = padZero(dt.getSeconds())

    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
  }

  // 定义补零函数
  function padZero(n) {
    return n > 9 ? n : '0' + n
  }

  // 定义一个查询的参数对象，将来请求数据的时候，需要将请求参数对象提交到服务器
  var q = {
    // 页码值，默认请求第一页的数据
    pagenum: 1,
    // 每页显示多少条数据
    pagesize: 2,
    // 文章分类的 Id
    cate_id: '',
    // 文章的状态，可选值有：已发布、草稿
    state: ''
  }

  // 调用
  initTable()
  initCate()

  // 获取文章列表数据的方法
  function initTable() {
    $.ajax({
      method: 'GET',
      url: '/my/article/list',
      data: q,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取文章列表失败！');
        }
        // 使用模版引擎渲染页面的数据
        // console.log(res)
        var htmlStr = template('tpl-table', res)
        $('tbody').html(htmlStr)
        renderPage(res.total)
      }
    })
  }

  // 初始化文章分类的方法
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取分类数据失败！')
        }
        // 调用模版引擎渲染分类的可选项
        var htmlStr = template('tpl-cate', res)
        // console.log(htmlStr)
        $('[name=cate_id]').html(htmlStr)
        // 通过layui重新渲染表单区域的UI结构
        form.render()
      }
    })
  }

  // 为筛选表单绑定submit事件
  $('#form-search').on('submit', function (e) {
    e.preventDefault()
    // 获取表单中选中项的值
    var cate_id = $('[name=cate_id]').val()
    var state = $('[name=state]').val()
    // 为查询参数对象 q 中对应的属性赋值
    q.cate_id = cate_id
    q.state = state
    // 根据最新的筛选条件，重新渲染表格中的数据
    initTable()
  })

  // 定义渲染分页的方法
  function renderPage(total) {
    // console.log(total)
    layui.use('laypage', function () {
      //执行一个laypage实例
      laypage.render({
        //分页容器的ID
        //注意，这里的 test1 是 ID，不用加 # 号
        elem: 'pageBox',
        //数据总数，从服务端得到
        count: total,
        //每页显示的条数。laypage将会借助 count 和 limit 计算出分页数。
        limit: q.pagesize,
        //起始页。一般用于刷新类型的跳页以及HASH跳页。
        curr: q.pagenum,
        // 自定义排版。可选值有：count（总条目输区域）、prev（上一页区域）、page（分页区域）、next（下一页区域）、limit（条目选项区域）、refresh（页面刷新区域。注意：layui 2.3.0 新增） 、skip（快捷跳页区域）
        layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
        // 每页条数的选择项。如果 layout 参数开启了 limit，则会出现每页条数的select选择框
        limits: [2, 3, 5, 10],
        // 分页发生切换的时候，触发jump回调
        jump: function (obj, first) {
          // console.log(first)
          console.log(obj.curr)
          // 把最新的页码值，赋值给 q 这个查询参数对象中
          q.pagenum = obj.curr
          // 把最新的条目数，赋值到 q 这个查询参数对象的pagesize属性中
          q.pagesize = obj.limit
          if (!first) {
            // 根据最新的 q 获取对应的数据列表，并渲染表格
            initTable()
          }
        }
      });
    });
  }

  // 通过代理的方式，为删除按钮绑定点击事件
  $('tbody').on('click', 'btn-delete', function () {
    // console.log(111)
    // 获取删除按钮的个数
    var len = $('.btn-delete').length
    // console.log(len)
    // 获取到文章的ID
    var id = $(this).attr('data-id')
    // 询问用户是否删除数据
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
      //do something
      $.ajax({
        method: 'GET',
        url: '/my/article/delete/' + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg('删除文章失败！')
          }
          layer.msg('删除文章成功！')
          // 当数据删除完成后，需要判断当前这一页中是否还有剩余的数据，如果没有了，则让页码值-1后再重新调用initTable方法
          if (len === 1) {
            // 如果len=1，证明删除完毕后页面上已经没有数据了
            // 页码值最小值为 1 
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
            // 重新加载数据
            initTable()
          }

        }
      })

      layer.close(index);
    });
  })
})