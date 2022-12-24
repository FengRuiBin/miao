// 账户系统路由中间件

const express = require('express')
const db = require('./db')
const md5 = val => val

// 创建路由
const app = express.Router()

app.post('/register', (req, res, next) => {
  // 请求体
  var regInfo = req.body

  var USERNAME_RE = /^[0-9a-z_]+$/i

  if (!USERNAME_RE.test(regInfo.name)) {
    res.status(400).json({
      code: -1,
      msg: 'username invalid, can only contain digit and letter and _',
    })
  } else if (regInfo.password == 0) {
    res.status(400).json({
      code: -1,
      msg: 'password may not be empty',
    })
  } else {
    var addUser = db.prepare('INSERT INTO users (name, password, email, avatar) VALUES (?, ?, ?, ?)')
    var result = addUser.run(regInfo.name, md5(regInfo.password), regInfo.email, regInfo.avatar)
    console.log(result)
    res.json({
      code: 0,
      result: {},
    })
  }
})

// 验证码
app.get('/captcha-img', (req, res, next) => {
  var captcha = svgCaptcha.create();
  req.session.captcha = captcha.text;

  res.type('svg');// response Content-Type
  res.status(200).send(captcha.data);
})

app.post('/login', (req, res, next) => {
  var loginInfo = req.body

  // if (loginInfo.captcha !== req.session.captcha) {
  //   res.json({
  //     code: -1,
  //     msg: 'captcha incorrect!',
  //   })
  //   return
  // }

  var user = db.prepare(`SELECT * FROM users WHERE name = ? AND password = ?`).get(loginInfo.name, md5(loginInfo.password))
  // var userStmt = db.prepare(`SELECT * FROM users WHERE name = 'foo' OR 1 = 1 OR '2' = '2' AND password = 'a'`)
  // var user = userStmt.get(loginInfo.name, loginInfo.password)
  // var user = userStmt.get()

  if (user) {
    res.cookie('loginUser', user.name, {
      signed: true
      // maxAge: 86400000, // 相对过期时间点，多久过期，过期后浏览器会自动删除，并不再请求中带上
      // expires: new Date(), // 绝对过期时间点
      // httpOnly: true, // 只在请求时带在头里，不能通过document.cookie读到
    })
    res.json({
      code: 0,
      result: user,
    })
  } else {
    res.status(400).json({
      code: -1,
      msg: 'username of password incorrect',
    })
  }
})

// 获取到当前可能已经登陆的用户信息
app.get('/current-user', (req, res, next) => {
  if (req.loginUser) {
    var { userId, name, avatar } = req.loginUser
    res.json({
      code: 0,
      result: {
        userId,
        name,
        avatar,
      }
    })
  } else {
    res.status(404).json({
      code: -1,
      msg: 'not login'
    })
  }
})

// 登出
app.get('/logout', (req, res, next) => {
  res.clearCookie('loginUser')
  res.json({
    code: 0,
    result: {},
  })
})

module.exports = app
