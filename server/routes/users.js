var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource333');
});

//登陆接口
var User = require('./../models/user');
router.get('/login', function(req,res,next){
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
router.get("/logout",function(req,res,next){
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
router.get("/checkLogin",function(req,res,next){
  if(req.cookies.userId){
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
router.get("/cartList",function(req,res,next){
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
router.get("/cartDel",function(req,res,next){
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
router.get("/cartEdit",function(req,res,next){
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
router.get("/editCheckAll",function(req,res,next){
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

module.exports = router;
