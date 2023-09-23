const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const fs = require('fs');

const db = require('./db')
const { sleep_mac } = require('./sleep_mac')

var jsonParser = bodyParser.json()

const app = express()
const port = 3000

app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))

app.post('/list', (req, res) => {
  const { name } = req.body
  if (name) {
    db.saveData(name)
  }

  res.status(200).json({ success: true })
})

app.get('/list', (_, res) => {
  const data = db.getData()

  res.json({ success: true, data: data })
})

app.get('/api', (req, res) => {
  const data = { name: 'John Doe' };
  res.jsonp(data);
});

app.get('/sleepMac', (req, res) => {
  sleep_mac()

  res.status(200).json({ success: true })
})

app.post('/pageData', jsonParser, (req, res) => {
  const data = req.body

  if (!Array.isArray(data)) {
    res.json({ success: false, msg: '没有提供数据' })
  } else if (data.length === 0) {
    res.json({ success: false, msg: '提供的数据为空' })
  } else {
    const json = JSON.stringify(data)
    fs.writeFile('pages.json', json, 'utf8', (err) => {
      console.log('err ', err)
    });

    res.json({ success: false, msg: '成功' })
  }
})

app.get('/pageData', (req, res) => {
  fs.readFile('pages.json', 'utf8', function readFileCallback(err, data){
    if (err){
        console.log(err);
    } else {
    obj = JSON.parse(data); //now it an object
  
    res.json({ success: true, data: obj })
}});
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

