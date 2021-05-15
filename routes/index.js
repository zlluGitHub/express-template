const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const datetime = require('silly-datetime');

const schemaIndex = require("../schema/index");

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/create', function (req, res, next) {
  let body = req.body;
  body.bid = uuidv4(); // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
  body.time = datetime.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
  // schemaIndex.find({ bid }, (err, data) => {
  //   if (err) { } else {
  //     console.log(data);
  //   }
  // })

  // schemaIndex.deleteMany({ bid }, (err, data) => {
  //   if (err) { } else {
  //     console.log(data);
  //   }
  // })

  // schemaIndex.updateOne({ bid }, (err, data) => {
  //   if (err) { } else {
  //     console.log(data);
  //   }
  // })

  // schemaIndex.create(body, (err, data) => {
  //   if (err) {
  //     console.log('错误信息：', err);
  //     res.json({ message: "失败！", code: 500 });
  //   } else {
  //     res.json({ message: "成功！", code: 200 });
  //   };
  // });

  res.json({ code: 200 });
});

module.exports = router;
