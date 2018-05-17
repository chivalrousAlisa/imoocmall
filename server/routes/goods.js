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

router.get("/", function(req,res,next){
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

module.exports = router;
