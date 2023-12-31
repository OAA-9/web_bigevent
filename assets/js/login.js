$(function () {
  // 点击"去注册账号"的链接
  $('#link_reg').on('click', function () {
    $('.login-box').hide()
    $('.reg-box').show()
  })

  // 点击"去登录账号"的链接
  $('#link_login').on('click', function () {
    $('.login-box').show()
    $('.reg-box').hide()
  })

  // 从layui中获取form对象
  var form = layui.form
  var layer = layui.layer
  // 通过form.verify()函数自定义校验规则
  form.verify({
    // 自定义了一个pwd的校验规则
    pwd: [/^[\S]{6,12}$/, '密码必须6到12位,且不能出现空格'],
    // 校验两次密码是否一致
    repwd: function (value) {
      // 通过形参拿到的是确认密码框里面的内容
      // 还需要拿到密码框里面的内容
      // 然后进行一次等于判断
      // 如果判断失败，则return一个提示信息即可
      let pwd = $('#pwd').val()
      console.log(pwd)
      if (pwd !== value) {
        return '两次密码不一致'
      }
    }
  })

  // 监听注册表单的提交事件
  $('#form_reg').on('sumbit', function (e) {
    // 阻止默认提交行为
    e.preventDefault()
    var data = {
      username: $('#un').val(),
      password: $('#pwd').val()
    }
    // 发起一个Ajax的post的请求
    $.post('http://api-breakingnews-web.itheima.net/api/reguser', data, function (res) {
      if (res.status !== 0) {
        return layer.msg()
      }
      layer.msg('注册成功,请登录!')
    })
    // 模拟人的点击行为
    $('#link_login').click()
  })

  // 监听登录表单的提交事件
  $('#form_login').submit(function (e) {
    // 阻止默认提交行为
    e.preventDefault()
    $.ajax({
      url: 'http://api-breakingnews-web.itheima.net/api/login',
      method: 'POST',
      // 快速请求表单里的数据
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('登录失败!')
        }
        layer.msg('登录成功!')
        // 将登录成功得到的 token 字符串，保存到 localStorage 中
        localStorage.setItem('token', res.token)
        // 跳转到后台主页
        location.href = './index.html'

      }
    })
  })
})