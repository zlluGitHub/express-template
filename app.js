const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const config = require('./config.json');
const mongoose = require('mongoose');

const app = express();


// 解决刷新页面后 页面404
const history = require('connect-history-api-fallback');
// app.use(history({ verbose: true, index: '/index.html'}));
app.use(history());

// 启用 gzip
const compression = require('compression')
app.use(compression());

// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
const bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true })); //extended: false 表示使用系统模块querystring来处理，也是官方推荐的、extended: true; 表示使用第三方模块qs来处理


const proxy = require("http-proxy-middleware");
app.use(`/swd/*`,
  proxy.createProxyMiddleware({
    // 代理目标地址
    target: "http://localhost:8080",
    changeOrigin: true,
    // ws: true,   
    // xfwd:true,
    // 地址重写
    pathRewrite: {
      "^/swd": "/swd"
    }
  })
);

// 解决跨域
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length, Authorization,Origin,Accept,X-Requested-With');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  // res.header('X-Powered-By', '3.2.1');
  // res.header('Content-Type', 'application/json;charset=utf-8');
  next();
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'dist')));

app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

let auth = (config.database.username && config.database.password) ? `${config.database.username}:${config.database.password}@` : ""
mongoose.connect(`mongodb://${auth}${config.database.ip}:${config.database.port}/${config.database.baseName}`, { useNewUrlParser: true, useUnifiedTopology: true }, err => {
  if (err) {
    console.log('Connection Error:' + err);
  } else {
    console.log('Database connection successful!');
  }
});

module.exports = app;
