$(function () {
  var layer = layui.layer
  var form = layui.form


  initCate()
  // 初始化富文本编辑器
  initEditor()
  // 定义加载文章分类的方法
  function initCate() {
    $.ajax({
      method: 'get',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('初始化文章分类失败!')
        }
        // 调用渲染引擎，渲染分类的下拉菜单
        var htmlStr = template('tpl-cate', res)
        $('[name=cate_id]').html(htmlStr)
        // 一定要调用form.render()方法
        form.render()
      }
    })
  }

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

  // 为选择的封面阿牛绑定click事件处理函数
  $('#btnChooseImage').om('click', function () {
    $('#coverFile').click()
  })

  // 监听coverFile的change事件，获取用户选择的文件列表
  $('#coverFile').on('change', function (e) {
    // 获取到文件的列表数组
    var files = e.target.files
    // 判断用户是否选择了文件
    if (files.length === 0) {
      return
    }
    // 根据选择的文件，创建一个对应的 URL 地址
    var newImgURL = URL.createObjectURL(files[0])
    // 为裁剪区域重新设置图片
    $image
      .cropper('destroy')      // 销毁旧的裁剪区域
      .attr('src', newImgURL)  // 重新设置图片路径
      .cropper(options)        // 重新初始化裁剪区域
  })

  // 定义文章的发布状态
  var art_state = '已发布'

  // 为存为草稿按钮绑定点击事件处理函数
  $('#btnSave').on('click', function () {
    art_state = '草稿'
  })

  // 为表单绑定sumbit提交事件
  $('#form-pub').on('submit', function (e) {
    //阻止表单默认提交行为
    e.preventDefault()

    // 基于form表单快速创建一个FormData对象
    var fd = new FormData($(this)[0])

    // 将文章的发布状态存到fd中
    fd.append('state', art_state)

    // 将封面裁剪过后的图片输出为一个文件对象
    $image
      .cropper('getCroppedCanvas', {
        // 创建一个 Canvas 画布
        width: 400,
        height: 400
      })
      .toBlob(function (blob) {
        // 将cannas画布上的内容转化为文件对象
        // 得到文件对象后进行后续的操作
        // 将文件对象存储到fd中
        fd.append('cover_img', blob)
        // 发起ajax请求
        publishArticle(fd)
      })
  })

  // 定义一个发布文章的方法
  function publishArticle(fd) {
    $.ajax({
      method: 'post',
      url: '/my/article/add',
      data: fd,
      // 如果向服务器提交的是FormData格式刀的数据
      // 必须添加以下两个配置项
      contentType: false,
      processData: false,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('发布文章失败!')
        }
        layer.msg('发布文章成功!')
        // 发布文章成功后，跳转文章的列表页面
        location.href = '/article/art_list.html'
      }
    })
  }
})
