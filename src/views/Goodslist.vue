<template>
  <div>
    <nav-header></nav-header>
    <nav-bread>
      <span slot="bread">Goods</span>
    </nav-bread>
    <div class="accessory-result-page accessory-page">
        <div class="container">
            <div class="filter-nav"><span class="sortby">Sort by:</span> <a href="javascript:void(0)" class="default cur">Default</a>
                <a href="javascript:void(0)" class="price sort-up" @click="sortProduct">Price
                    <span class="sort-icon" v-bind:class="{'sort-icon-up':!pageParams.sort}">
                      <svg class="icon icon-arrow-short">
                        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-arrow-short"></use>
                      </svg>
                    </span>

                </a> <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a></div>
            <div class="accessory-result">
                <div id="filter" class="filter stopPop" v-bind:class="{'filterby-show':filterBy}">
                    <dl class="filter-price">
                        <dt>Price:</dt>
                        <dd><a href="javascript:void(0)" @click="setPriceFilter('all')" v-bind:class="{cur:priceChecked === 'all'}">All</a></dd>
                        <dd v-for="(price, index) in priceFilter">
                          <a href="javascript:void(0)" @click="setPriceFilter(index)" v-bind:class="{cur:priceChecked===index}">{{price.startPrice}} - {{price.endPrice}}</a>
                        </dd>
                    </dl>
                </div>
                <div class="accessory-list-wrap">
                    <div class="accessory-list col-4">
                        <ul>
                            <li v-for="(item, index) in goodsList">
                                <div class="pic"><a href="#"><img alt="" v-lazy="'/static/'+item.productImg"></a></div>
                                <div class="main">
                                    <div class="name">{{ item.productName }}</div>
                                    <div class="price">{{ item.productPrice }}</div>
                                    <div class="btn-area"><a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a></div>
                                </div>
                            </li>
                        </ul>
                      <div class="load-more" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="30">
                        <span v-show="isLoading">加载中...</span>
                      </div>
                    </div>
                    <!--<div infinite-scroll-disabled="busy" infinite-scroll-distance="20" class="view-more-normal"><img-->
                            <!--src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMiAzMiIgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjMjg4NjM2Ij4KICA8Y2lyY2xlIGN4PSIxNiIgY3k9IjMiIHI9IjAiPgogICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0iciIgdmFsdWVzPSIwOzM7MDswIiBkdXI9IjFzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgYmVnaW49IjAiIGtleVNwbGluZXM9IjAuMiAwLjIgMC40IDAuODswLjIgMC4yIDAuNCAwLjg7MC4yIDAuMiAwLjQgMC44IiBjYWxjTW9kZT0ic3BsaW5lIiAvPgogIDwvY2lyY2xlPgogIDxjaXJjbGUgdHJhbnNmb3JtPSJyb3RhdGUoNDUgMTYgMTYpIiBjeD0iMTYiIGN5PSIzIiByPSIwIj4KICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9InIiIHZhbHVlcz0iMDszOzA7MCIgZHVyPSIxcyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIGJlZ2luPSIwLjEyNXMiIGtleVNwbGluZXM9IjAuMiAwLjIgMC40IDAuODswLjIgMC4yIDAuNCAwLjg7MC4yIDAuMiAwLjQgMC44IiBjYWxjTW9kZT0ic3BsaW5lIiAvPgogIDwvY2lyY2xlPgogIDxjaXJjbGUgdHJhbnNmb3JtPSJyb3RhdGUoOTAgMTYgMTYpIiBjeD0iMTYiIGN5PSIzIiByPSIwIj4KICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9InIiIHZhbHVlcz0iMDszOzA7MCIgZHVyPSIxcyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIGJlZ2luPSIwLjI1cyIga2V5U3BsaW5lcz0iMC4yIDAuMiAwLjQgMC44OzAuMiAwLjIgMC40IDAuODswLjIgMC4yIDAuNCAwLjgiIGNhbGNNb2RlPSJzcGxpbmUiIC8+CiAgPC9jaXJjbGU+CiAgPGNpcmNsZSB0cmFuc2Zvcm09InJvdGF0ZSgxMzUgMTYgMTYpIiBjeD0iMTYiIGN5PSIzIiByPSIwIj4KICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9InIiIHZhbHVlcz0iMDszOzA7MCIgZHVyPSIxcyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIGJlZ2luPSIwLjM3NXMiIGtleVNwbGluZXM9IjAuMiAwLjIgMC40IDAuODswLjIgMC4yIDAuNCAwLjg7MC4yIDAuMiAwLjQgMC44IiBjYWxjTW9kZT0ic3BsaW5lIiAvPgogIDwvY2lyY2xlPgogIDxjaXJjbGUgdHJhbnNmb3JtPSJyb3RhdGUoMTgwIDE2IDE2KSIgY3g9IjE2IiBjeT0iMyIgcj0iMCI+CiAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJyIiB2YWx1ZXM9IjA7MzswOzAiIGR1cj0iMXMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiBiZWdpbj0iMC41cyIga2V5U3BsaW5lcz0iMC4yIDAuMiAwLjQgMC44OzAuMiAwLjIgMC40IDAuODswLjIgMC4yIDAuNCAwLjgiIGNhbGNNb2RlPSJzcGxpbmUiIC8+CiAgPC9jaXJjbGU+CiAgPGNpcmNsZSB0cmFuc2Zvcm09InJvdGF0ZSgyMjUgMTYgMTYpIiBjeD0iMTYiIGN5PSIzIiByPSIwIj4KICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9InIiIHZhbHVlcz0iMDszOzA7MCIgZHVyPSIxcyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIGJlZ2luPSIwLjYyNXMiIGtleVNwbGluZXM9IjAuMiAwLjIgMC40IDAuODswLjIgMC4yIDAuNCAwLjg7MC4yIDAuMiAwLjQgMC44IiBjYWxjTW9kZT0ic3BsaW5lIiAvPgogIDwvY2lyY2xlPgogIDxjaXJjbGUgdHJhbnNmb3JtPSJyb3RhdGUoMjcwIDE2IDE2KSIgY3g9IjE2IiBjeT0iMyIgcj0iMCI+CiAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJyIiB2YWx1ZXM9IjA7MzswOzAiIGR1cj0iMXMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiBiZWdpbj0iMC43NXMiIGtleVNwbGluZXM9IjAuMiAwLjIgMC40IDAuODswLjIgMC4yIDAuNCAwLjg7MC4yIDAuMiAwLjQgMC44IiBjYWxjTW9kZT0ic3BsaW5lIiAvPgogIDwvY2lyY2xlPgogIDxjaXJjbGUgdHJhbnNmb3JtPSJyb3RhdGUoMzE1IDE2IDE2KSIgY3g9IjE2IiBjeT0iMyIgcj0iMCI+CiAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJyIiB2YWx1ZXM9IjA7MzswOzAiIGR1cj0iMXMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiBiZWdpbj0iMC44NzVzIiBrZXlTcGxpbmVzPSIwLjIgMC4yIDAuNCAwLjg7MC4yIDAuMiAwLjQgMC44OzAuMiAwLjIgMC40IDAuOCIgY2FsY01vZGU9InNwbGluZSIgLz4KICA8L2NpcmNsZT4KICA8Y2lyY2xlIHRyYW5zZm9ybT0icm90YXRlKDE4MCAxNiAxNikiIGN4PSIxNiIgY3k9IjMiIHI9IjAiPgogICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0iciIgdmFsdWVzPSIwOzM7MDswIiBkdXI9IjFzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgYmVnaW49IjAuNXMiIGtleVNwbGluZXM9IjAuMiAwLjIgMC40IDAuODswLjIgMC4yIDAuNCAwLjg7MC4yIDAuMiAwLjQgMC44IiBjYWxjTW9kZT0ic3BsaW5lIiAvPgogIDwvY2lyY2xlPgo8L3N2Zz4K"-->
                            <!--style="display: none;"></div>-->
                </div>
            </div>
        </div>
    </div>
    <div class="md-overlay" @click="closePop" v-show="overLayFlag"></div>
    <modal v-bind:mdShow="mdShowCart" v-on:close="closeModal">
      <p slot="message">
        <svg class="icon-status-ok">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use>
        </svg>
        <span>加入购物车成!</span>
      </p>
      <div slot="btnGroup">
        <a href="javascript:;" class="btn btn--m" @click="mdShowCart = false">继续购物</a>
        <router-link class="btn btn--m btn--red" to="/carts">查看购物车</router-link>
      </div>
    </modal>
    <modal v-bind:mdShow="mdCartError" v-on:close="closeModal">
      <p slot="message">
        <span v-text="mdCartErrorText"></span>
      </p>
      <div slot="btnGroup">
        <a class="btn btn--m" href="javascript:;" @click="mdCartError = false">关闭</a>
      </div>
    </modal>
    <nav-footer></nav-footer>
  </div>
</template>
<style>
  .load-more{
    text-align: center;
    padding:20px 0;
  }
  .sort-icon-up{
    transform:rotate(180deg);
    transition:all .3s ease-out;
  }
  .sort-icon{
    display:inline-block;
    transition:all .3s ease-out;
  }
  .btn:hover{
    background-color:#ffe5e6;
    transition:all .3s ease-out;
  }
</style>
<script>
  import './../assets/css/base.css';
  import './../assets/css/product.css';
  import NavHeader from '@/components/NavHeader.vue';
  import NavBread from '@/components/NavBread.vue'
  import NavFooter from '@/components/NavFooter.vue';
  import Modal from '@/components/Modal.vue';
  import axios from 'axios';
  import fetch from 'cross-fetch';
  import * as utils from '../utils';
  export default {
    name: 'Goodslist',
    data () {
      return {
        goodsList: [], //商品列表数据
        priceFilter:[
          {
            startPrice:'0.00',
            endPrice:'500.00'
          },
          {
            startPrice:'500.00',
            endPrice:'1000.00'
          },
          {
            startPrice:'1000.00',
            endPrice:'2000.00'
          }
        ],
        priceChecked:'all',//当前哪个价格区间被选中
        filterBy:false,
        overLayFlag:false,
        pageParams:{
          page:1,
          pageSize:4,
          sort:true //排序:升序,降序
        },
        busy:true,//滚动回调是否生效
        isLoading:false, //是否显示加载中
        mdShowCart:false, //加入购物车成功弹框控制
        mdCartError:false, //加入购物车失败弹框
        mdCartErrorText:null //接口报错弹框
      }
    },
    mounted() {
      this.getGoodsList(false);
    },
    methods:{
      jump(){
        this.$router.push("/carts?id=123");
        // this.$router.go(-2);
      },
      getGoodsList(flag) {
        const self = this;
        const param = utils.deepCopy(this.pageParams);
        param.sort = (this.pageParams.sort ? 1 : -1);
        if(this.priceChecked !== 'all'){
          param.priceGt = this.priceFilter[this.priceChecked].startPrice;
          param.priceLte = this.priceFilter[this.priceChecked].endPrice;
        }
        this.isLoading = true;
        axios.get("/goods/list", {
          params: param
        }).then(function(res){
          self.isLoading = false;
          if(flag){
            self.goodsList = self.goodsList.concat(res.data.result.list);
            if(res.data.result.count < self.pageParams.pageSize){
              self.busy = true;
            } else {
              self.busy = false;
            }
          } else {
            self.busy = false;
            self.goodsList = res.data.result.list;
          }
        });
//        fetch('/goods').then(function(res){
//          return res.json();
//        }).then(function(data){
//          self.goodsList = data.result.list;
//        });
      },
      showFilterPop(){
        this.filterBy = true;
        this.overLayFlag = true;
      },
      closePop(){
        this.filterBy = false;
        this.overLayFlag = false;
      },
      setPriceFilter(index){
        if (this.priceChecked !== index) {
          this.priceChecked = index;
          this.closePop();
          this.pageParams.page = 1;
          this.getGoodsList(false);
        }
      },
      sortProduct(){
        this.pageParams.page = 1;
        this.pageParams.sort = !this.pageParams.sort;
        this.getGoodsList();
      },
      loadMore() {
        const self = this;
        this.busy = true;
        setTimeout(function(){
          self.pageParams.page ++;
          self.getGoodsList(true);
        },1000);
      },
      addCart(productId){
        const self = this;
        axios.get("/goods/addCart", {params: {productId:productId}}).then(function(res){
          if (res.data.status == 0) {
//            alert("加入成功");

//            let modalCompon = null;
//            for(let i = 0; i<self.$children.length; i++){
//              const id = self.$children[i].$el.id;
//              if(id === 'modal'){
//                modalCompon = self.$children[2];
//                break;
//              }
//            }
//            modalCompon.operateModal(true);

            self.mdShowCart = true;
          } else {
//            alert(res.data.msg);
            self.mdCartErrorText = res.data.msg;
            self.mdCartError = true;
          }
        });
      },
      closeModal(){
        this.mdShowCart = false;
        this.mdCartError = false;
      }
    },
    components:{
      NavHeader,
      NavFooter,
      NavBread,
      Modal
    }
  }
</script>
