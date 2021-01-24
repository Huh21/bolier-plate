const express = require('express')
const app = express()
const port = 5000
// 클라이언트의 정보를 가져와서 DB에 넣기 위해 User.js로 만든 모델을 가져와야 함
const { User } = require('./models/User')
const bodyParser = require('body-parser')
const config = require('./config/key')

// application/x-www-form-urlencoded와 같은 형태의 클라이언트에서 오는 정보를 서버에서 분석해서 가져오게 함
app.use(bodyParser.urlencoded({extended: true}));

// application/json 형태의 정보도 위처럼
app.use(bodyParser.json());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))


app.get('/', (req, res) => res.send('Hello World'))

app.post('/register', (req, res) => { // route의 end point를 register로, callback 함수에는 res와 req를
    // 회원 가입 할 때 필요한 정보들을 client로부터 가져오면 
    // 데이터베이스에 넣어둔다.

    const user = new User(req.body) // req.body 안에 json 형식으로 정보가 들어가 있음 (bodyParser가 있기에 가능)
    
    user.save((err, userInfo) => { // 콜백함수
        if(err) return res.json({ success: false,  err}) // error가 발생하는 경우를 json 형식으로 메시지와 함께 클라이언트에게 전달
        return res.status(200).json({
            success: true
        }) // status(200)은 성공했다는 의미, json 형식으로 전달
    }) // 몽고DB에서 오는 메소드, user의 정보가 저장됨
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))