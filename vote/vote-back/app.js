const express = require('express')
const db = require('./db')
const multer = require('multer')
const accountRouter = require('./account')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const { options } = require('svg-captcha')

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + '/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '_' + Math.random().toString(16).slice(2) + path.extname(file.originalname))
  }
})

const upload = multer({ storage: storage })

const app = express()

app.use((req, res, next) => {
  console.log(req.method, req.url)
  next()
})

// 跨域
app.use(cors({
  // 写为true让响应头的Access- Control - Allow - Origin为请求者的域
  origin: true,
  // 让预检请求的响应中有Access-Control-Allow-Credentials：true这个头，以允许跨域请求带上cookie
  credentials: true
}))
// cookie签名的密码
app.use(cookieParser('cookie sign secert'))
// 用于响应用户上传的头像请求
app.use('/upload', express.static(__dirname + '/uploads'))
// 解析json请求体的中间件
app.use(express.json())
// 解析url编码请求体的中间件
app.use(express.urlencoded({ extended: true }))

// 将用户是否登录放到req的isLogin字段上的中间件
// 查出已登录用户放到loginUser上
app.use((req, res, next) => {
  if (req.signedCookies.loginUser) {
    var name = req.signedCookies.loginUser
    req.isLogin = true
    req.loginUser = db.prepare('SELECT * FROM users WHERE name = ?').get(name)
  } else {
    req.isLogin = false
    req.loginUser = null
  }
  next()
})

app.use('/account', accountRouter)

app.post('/vote', (req, res, next) => {
  var vote = req.body
  var userId = req.loginUser?.userId
  if (userId != undefined) {
    var stmt = db.prepare('INSERT INTO votes (userId, title, desc, deadline, anonymous, multiple) VALUES (?, ?, ?, ?, ?, ?)')
    var result = stmt.run(req.loginUser.userId, vote.title, vote.desc, vote.deadline, Number(vote.anonymous), Number(vote.multiple))

    var voteId = result.lastInsertRowid

    var stmt2 = db.prepare('INSERT INTO options (voteId, content) VALUES (?, ?)')
    for (var option of vote.options) {
      stmt2.run(voteId, option)
    }
    res.json({
      code: 0,
      result: {
        voteId,
      }
    })
  } else {
    res.json({
      code: -1,
      msg: '用户未登录',
    })
  }
})

app.get('/vote/:voteId', (req, res, next) => {
  var { voteId } = req.params
  var vote = db.prepare('SELECT * FROM votes WHERE voteId = ?').get(voteId)
  if (vote) {
    var options = db.prepare('SELECT * FROM options WHERE voteId = ?').all(voteId)
    var userVotes = db.prepare('SELECT * FROM voteOptions WHERE voteId = ?').all(voteId)
    res.json({
      code: 0,
      result: {
        vote,
        options,
        userVotes
      }
    })
  } else {
    res.status(404).json({
      code: -1,
      mag: 'can not find this vote: ' + voteId,
    })
  }
})

app.use(function getbody(req, res, next) {
  var body = ''
  req.on('data', data => {
    body += data.toString()
  })
  req.on('end', () => {
    req.body = body
    next()
  })
})

app.use((req, res, next) => {
  res.end('hello, your request body is' + req.body)
  next()
})

// 用户头像
app.post('/upload', upload.any(), (req, res, next) => {
  var files = req.files
  console.log(files)
  var urls = files.map(file => `/uploads/` + file.filename)
  res.json(urls)
})

app.listen(8008, () => {
  console.log('listening on port', 8008)
})

// 切换当前登录用户对voteId问题的optonId选项的投递情况
app.post('/vote/:voteId', (req, res, next) => {
  var { voteId } = req.params
  var { optionIds } = req.body

  // 如果请求体没有选项
  if (optionIds.length == 0) {
    res.status(401).json({
      code: -1,
      msg: '必须有选项'
    })
  }

  var optionId = optionIds[0] // 单选的话只有一个id发来，就算发来多个，也只用第一个

  var userId = req.loginUser?.userId

  console.log('投票时的用户id', userId)

  // 如果用户未登陆，则不能投票
  if (!userId) {
    res.status(401).json({
      code: -1,
      msg: 'user not login!'
    })
  }

  var vote = db.prepare('SELECT * FROM votes WHERE voteId = ?').get(voteId)
  if (vote) {
    var multiple = vote.multiple
    // 多选
    if (multiple) { // 多选

      // 匿名投票
      if (vote.anonymous) {
        let voted = db.prepare('SELECT * FROM voteOptions WHERE userId = ? AND voteId = ?').get(userId, voteId)
        if (voted) {
          res.status(403).json({
            code: -1,
            msg: '该用户已经投过这个匿名投票'
          })
        } else {
          let insertVotes = db.prepare('INSERT INTO voteOptions (userId, voteId, optionId) VALUES (?, ?, ?)')
          optionIds.forEach(optionId => {
            insertVotes.run(userId, voteId, optionId)
          })
          res.end() // 投票完成，直接结束
        }
      } else {
        // 非匿名投票，一次只投一个选项
        // 先看用户是否已经投过这个选项
        let voted = db.prepare('SELECT * FROM voteOptions WHERE userId = ? AND voteId = ? AND optionId = ?')
          .get(userId, voteId, optionId)


        if (voted) { // 如果已经投过这个选项，则删除它
          db.prepare('DELETE FROM voteOptions WHERE voteOptionId = ?').run(voted.voteOptionId)
        } else { // 如果没有投过，则增加一行，表示用户投了这个选项
          db.prepare('INSERT INTO voteOptions (userId, voteId, optionId) VALUES (?, ?, ?)')
            .run(userId, voteId, optionId)
        }
        res.end()
      }
    } else {
      // 单选
      let voted = db.prepare('SELECT * FROM voteOptions WHERE userId = ? AND voteId = ?').get(userId, voteId)
      if (voted) {
        // 投过，修改或取消
        if (voted.optionId == optionId) {
          // 已经投的就是这次点的，则直接取消
          db.prepare('DELETE FROM voteOptions WHERE voteOptionId = ?').run(voted.voteOptionId)
        } else {
          // 已经投的跟这次点的不一样，则换成这次选的
          db.prepare('UPDATE voteOptions SET optionId = ? WHERE voteOptionId = ?').run(optionId, voted.voteOptionId)
        }
      } else {
        // 没投过，则增加
        db.prepare('INSERT INTO voteOptions (userId, voteId, optionId) VALUES (?, ?, ?)').run(userId, voteId, optionId)
      }
      res.end()
    }
  } else {
    res.status(404).json({
      code: -1,
      msg: 'vote not exist: ' + voteId
    })
  }
})