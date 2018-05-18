var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Goods = require('../models/goods');

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
router.get("/list", function(req,res,next){
  let page = parseInt(req.param("page"));
  if(!isNaN(page)){
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
  } else {
    res.send('error');
  }
});

//加入到购物车
var User = require('../models/user');
router.get("/addCart", function(req, res, next){
  var userId = '100000001';
  var productId = req.param('productId');
  User.findOne({userId:userId}, function(err, userDoc){
    if(err){
      res.json({
        status:"1",
        msg:err.message
      });
    } else {
      console.log("userDoc"+userDoc);
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

module.exports = router;
