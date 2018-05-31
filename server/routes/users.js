var express = require('express');
var router = express.Router();
require('./../Utils');//扩展Date的format

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
      } else {
        res.json({
          status:'1',
          msg:'账号或密码错误',
          result:''
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

// 查询用户地址列表
router.get("/getAddressList",function(req,res,next){
  var userId = req.cookies.userId;
  User.findOne({"userId":userId},function(err,doc){
    if(err){
      res.json({
        status:"1",
        msg:err.message,
        result:""
      });
    }else{
      if(doc){
        res.json({
          status:'0',
          msg:'',
          result:doc.addressList
        });
      }
    }
  });
});

//新增地址接口
router.post("/addNewAddress",function(req,res,next){
  var userId = req.cookies.userId;
  var addressVo = req.body.addressVo;
  //var addressVo = {"userName":"alisa","streetName":"盛世嘉园","postCode":"8009","tel":"15937626736","isDefault":true};
  if(!addressVo){
    res.json({
      status:'1003',
      msg:"addressVo is null",
      result:''
    });
    return;
  }
  User.findOne({"userId":userId},function(err,doc){
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        resulut:''
      });
    }else{
      if(doc){
        var newId = "100001";
        if(doc.addressList.length){
          newId = Number(doc.addressList[doc.addressList.length-1].addressId) + 1;
        }
        addressVo.addressId = String(newId);

        if(addressVo.isDefault){
          doc.addressList.forEach(function(item){
            item.isDefault = false;
          });
        }

        doc.addressList.push(addressVo);
        doc.save(function(err1,doc1){
          if(err1){
            res.json({
              status:"1",
              msg:err1.message,
              result:''
            });
          }else{
            res.json({
              status:'0',
              msg:"successful",
              result:doc1.addressList
            });
          }
        });
      }
    }
  });
});

//设置默认地址接口
router.post("/setDefaultAddress",function(req,res,next){
  var userId = req.cookies.userId;
  var addressId = req.body.addressId;
  if(!addressId){
    res.json({
      status:'1003',
      msg:'addressId is a null',
      result:''
    });
    return;
  }
  User.findOne({"userId":userId},function(err,doc){
    if(err){
      res.json({
        status:'1',
        msg:err,message,
        result:''
      });
    }else{
      if(doc){
        doc.addressList.forEach(function(item){
          if(item.addressId == addressId){
            item.isDefault = true;
          }else{
            item.isDefault = false;
          }
        });
        doc.save(function(err,doc){
          if(err){
            res.json({
              status:'1',
              msg:err,message,
              result:''
            });
          }else{
            res.json({
              status:'0',
              msg:'successful',
              result:doc.addressList
            });
          }
        });
      }
    }
  });
});

//删除地址
router.post("/delAddress",function(req,res,next){
  var userId = req.cookies.userId;
  var addressId = req.body.addressId;
  if(!addressId){
    res.json({
      status:'1003',
      msg:'addressId is a null',
      result:''
    });
    return;
  }
  User.update({"userId":userId},{
    $pull:{
      'addressList':{
        'addressId':addressId
      }
    }
  },function(err,doc){
    if(err){
      res.json({
        status:'1',
        msg:err,message,
        result:''
      });
    }else{
      res.json({
        status:'0',
        msg:'successful',
        result:doc.addressList
      });
    }
  });
});

//提交订单
router.post("/payMent",function(req,res,next){
  var userId = req.cookies.userId,
    addressId = req.body.addressId,
    orderTotal = req.body.orderTotal;
  if(!addressId || !orderTotal){
    res.json({
      status:"1003",
      msg:'param is a null',
      result:''
    });
    return;
  }
  User.findOne({ userId: userId },function(err,doc){
    if(err){
      res.json({
        status:"1",
        msg:err.message,
        result:''
      });
    } else {
      if(doc){
        var address = doc.addressList.filter(function(item){
          return item.addressId == addressId
        });

        var goodsList = doc.cartList.filter(function(item){
          return item.checked == "1"
        });

        var orderId = '';
        const platform = '622';
        var r1 = Math.floor(Math.random()*10);
        var r2 = Math.floor(Math.random()*10);
        var isSame = true;
        do{
          if(r2 == r1){
            r2 = Math.floor(Math.random()*10);
          } else {
            isSame = false;
          }
        }while(isSame);
        var sysDate = new Date().Format('yyyyMMddhhmmss');
        orderId = platform+r1+sysDate+r2;
        var order = {
          orderId:orderId,
          orderTotal:orderTotal,
          addressInfo:address[0],
          goodsList:goodsList,
          orderStatus:'1',
          createDate:new Date().Format('yyyy-MM-dd hh:mm:ss')
        };
        doc.orderList.push(order);
        doc.save(function(err1,doc1){
          if(err1){
            res.json({
              status:"1",
              msg:err1.message,
              result:''
            });
          } else {
            if(doc1){
              res.json({
                status:'0',
                msg:'successful',
                result:{
                  orderId:order.orderId,
                  orderTotal:order.orderTotal
                }
              });
            }
          }
        });
      }
    }
  });
});

// 查询订单详情
router.get("/orderDetail",function(req,res,next){
  var userId = req.cookies.userId;
  var orderId = req.param("orderId");
  if(!orderId){
    res.json({
      status:'1003',
      msg:'orderId is a null',
      result:''
    });
    return;
  }
  User.findOne({ userId }, function(err,doc){
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      });
    } else {
      if(doc){
        var orderInfo = {};
        doc.orderList.forEach(function(item){
          if(item.orderId == orderId){
            orderInfo = item;
          }
        });
        res.json({
          status:'0',
          msg:'successful',
          result:orderInfo
        });
      }
    }
  });
});

// 获取用户购物车数量
router.get("/getCartsCount",function(req,res,next){
  var userId = req.cookies.userId
  User.findOne({ userId }, function(err,doc){
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      });
    } else {
      if(doc){
        var cartsCount = 0;
        doc.cartList.forEach(function(item){
          cartsCount += Number(item.productNum);
        });
        res.json({
          status:'0',
          msg:'successful',
          result:cartsCount
        });
      }
    }
  });
});

module.exports = router;
