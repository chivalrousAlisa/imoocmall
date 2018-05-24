require('./check-versions')()

var config = require('../config')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

var opn = require('opn')
var path = require('path')
var express = require('express')
var webpack = require('webpack')
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = require('./webpack.dev.conf')
var cookieParser = require('cookie-parser');

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port
// automatically open browser, if not set will be false
var autoOpenBrowser = !!config.dev.autoOpenBrowser
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable

var app = express();
app.use(cookieParser());
//登录拦截
app.use(function(req,res,next){
  if(req.cookies && req.cookies.userId){
    next();
  }else{
    console.log("pathUrl:"+req.path);
    if(req.path.indexOf('/static') > -1 || req.path == '/__webpack_hmr' || req.path == '/app.js' || req.path == '/' || req.path == '/users/login' || req.path=='/users/logout' || req.originalUrl.indexOf('/goods/list')>-1){
      next();
    }else{
      res.json({
        status:'10001',
        msg:'当前未登录',
        result:''
      });
    }
  }
});

var router = express.Router();

//var goodsData = require('./../mock/goods.json');
//router.get("/goods",function(req,res,next){
//  res.json(goodsData);
//});

/*
* 以下代码/goods路由的实现copy sever 中的路由,因跨域问题 start
*/
var mongoose = require('mongoose');
var Goods = require('../server/models/goods');

mongoose.connect('mongodb://127.0.0.1:27017/dumall');

mongoose.connection.on("connected", function(){
  console.log("MongoDB connected success2");
});

mongoose.connection.on("error", function(){
  console.log("MongoDB connected fail");
});

mongoose.connection.on("disconnected", function(){
  console.log("MongoDB connected disconnected");
});

// 查询商品列表
router.get("/goods/list", function(req,res,next){
  let page = parseInt(req.param("page"));
  let pageSize = parseInt(req.param("pageSize"));
  let sort = req.param("sort");
  let skip = (page-1)*pageSize;
  let params = {};

  // 价格区间筛选
  let priceGt = parseInt(req.param("priceGt"));
  let priceLte = parseInt(req.param("priceLte"));
  if(!isNaN(priceGt)){
    params.productPrice = {
      $gt:priceGt,
      $lte:priceLte
    }
  }

  let goodsModel = Goods.find(params).skip(skip).limit(pageSize);
  goodsModel = goodsModel.sort({'productPrice': sort});
  goodsModel.exec(function(err,doc){
    if(err){
      res.json({
        status:'1',
        msg:err.message
      });
    }else{
      res.json({
        status:'0',
        msg:'',
        result:{
          count:doc.length,
          list:doc
        }
      });
    }
  });
});

//加入到购物车
var User = require('../server/models/user');
router.get("/goods/addCart", function(req, res, next){
  var userId = '100000001';
  var productId = req.param('productId');
  User.findOne({userId:userId}, function(err, userDoc){
    if(err){
      res.json({
        status:"1",
        msg:err.message
      });
    } else {
      console.log("userDoc:"+userDoc);
      if(userDoc){
        let goodsItem = null;
        userDoc.cartList.forEach(function(item){
          if(item.productId == productId){
            goodsItem = item;
            item.productNum ++;
          }
        });
        if (goodsItem) {
          userDoc.save(function(err2, doc2){
            if(err2){
              res2.json({
                status:"1",
                msg:err.message
              });
            }else{
              res.json({
                status:'0',
                msg:'',
                result:'successfully'
              });
            }
          });
        } else {
          Goods.findOne({productId:productId},function(err,doc){
            if(err){
              res.json({
                status:"1",
                msg:err.message
              });
            }else{
              if(doc){
                doc.productNum = 1;
                doc.checked = 1;
                userDoc.cartList.push(doc);
                userDoc.save(function(err2, doc2){
                  if(err2){
                    res2.json({
                      status:"1",
                      msg:err.message
                    });
                  }else{
                    res.json({
                      status:'0',
                      msg:'',
                      result:'successfully'
                    });
                  }
                });
              }
            }
          });
        }

      }
    }
  });
});

//登陆接口
var User = require('../server/models/user');
router.get('/users/login', function(req,res,next){
  var param = {
    userName:req.param("userName"),
    userPwd:req.param("userPwd")
  };
  User.findOne(param,function(err,doc){
    if(err){
      res.json({
        satus:"1",
        msg:err.message
      });
    }else{
      if(doc){
        res.cookie("userId",doc.userId,{
          path:'/',
          maxAge:1000*3600
        });
        res.cookie("userName",doc.userName,{
          path:'/',
          maxAge:1000*3600
        });
        //req.session.user = doc;
        res.json({
          status:'0',
          msg:'',
          result:{
            userName:doc.userName
          }
        });
      }
    }
  });
});

//登出接口
router.get("/users/logout",function(req,res,next){
  res.cookie("userId","",{
    path:"/",
    maxAge:-1
  });
  res.cookie("userName","",{
    path:"/",
    maxAge:-1
  });
  res.json({
    status:"0",
    msg:"",
    result:''
  });
});

//检查是否登录
router.get("/users/checkLogin",function(req,res,next){
  if(req.cookies && req.cookies.userId){
    res.json({
      status:'0',
      msg:'',
      result:req.cookies.userName || ''
    });
  } else {
    res.json({
      status:'1',
      msg:'未登录',
      result:''
    });
  }
});

// 查询我的购物车接口
router.get("/users/cartList",function(req,res,next){
  var userId = req.cookies.userId;
  User.findOne({userId:userId},function(err,doc){
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      });
    }else{
      if(doc){
        res.json({
          status:'0',
          msg:'',
          result:doc.cartList
        });
      }
    }
  });
});

// 删除购物车商品接口
router.get("/users/cartDel",function(req,res,next){
  var productId = req.param("productId");
  var userId = req.cookies.userId;
  User.update({
    userId:userId
  },{
    $pull:{
      'cartList':{
        'productId':productId
      }
    }
  },function(err,doc){
    if(err){
      res.json({
        status:"1",
        msg:err.message,
        result:''
      });
    }else{
      res.json({
        status:'0',
        msg:'',
        result:"successfully"
      });
    }
  });
});

//修改购物车商品接口
router.get("/users/cartEdit",function(req,res,next){
  var productId = req.param("productId");
  var productNum = req.param("productNum");
  var checked = req.param("checked");
  var userId = req.cookies.userId;
  User.update({"userId":userId,"cartList.productId":productId},{
    "cartList.$.productNum":productNum,
    "cartList.$.checked":checked,
  },function(err,doc){
    if(err){
      res.json({
        status:"1",
        msg:err.message,
        result:''
      });
    }else{
      res.json({
        status:"0",
        msg:'',
        result:'suc'
      });
    }
  });
});

//购物车全选切换接口
router.get("/users/editCheckAll",function(req,res,next){
  var checkAll = req.param("checkAll");
  var userId = req.cookies.userId;
  User.findOne({userId:userId},function(err,user){
    if(err){
      res.json({
        status:"1",
        msg:err.message,
        result:''
      });
    }else{
      if(user){
        user.cartList.forEach((item) => {
          item.checked = checkAll;
        });
        user.save(function(err1,doc){
          if(err1){
            res.json({
              status:"1",
              msg:err1.message,
              result:""
            });
          }else{
            res.json({
              status:"0",
              msg:"",
              result:"suc"
            });
          }
        });
      }
    }
  });
});
/*
 * 以上代码/goods路由的实现copy sever 中的路由,因跨域问题 end
 */

app.use(router);
var compiler = webpack(webpackConfig)

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: false,
  heartbeat: 2000
})
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

var uri = 'http://localhost:' + port

var _resolve
var readyPromise = new Promise(resolve => {
  _resolve = resolve
})

console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
  console.log('> Listening at ' + uri + '\n')
  // when env is testing, don't need open it
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
  _resolve()
})

var server = app.listen(port)

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}
