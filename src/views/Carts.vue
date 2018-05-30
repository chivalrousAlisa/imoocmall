<template>
  <div>
    <nav-header></nav-header>
    <nav-bread>
      <span slot="bread">My Carts</span>
    </nav-bread>
    <div class="container">
      <div class="cart">
        <div class="page-title-normal">
          <h2 class="page-title-h2"><span>My Cart</span></h2>
        </div>
        <div class="item-list-wrap">
          <div class="cart-item">
            <div class="cart-item-head">
              <ul>
                <li>Items</li>
                <li>Price</li>
                <li>Quantity</li>
                <li>Subtotal</li>
                <li>Edit</li>
              </ul>
            </div>
            <ul class="cart-item-list">
              <li v-for="item in cartList">
                <div class="cart-tab-1">
                  <div class="cart-item-check">
                    <a href="javascipt:;" class="checkbox-btn item-check-btn" v-bind:class="{check:item.checked == '1'}" @click="editCart('check',item)">
                      <svg class="icon icon-ok">
                        <use xlink:href="#icon-ok"></use>
                      </svg>
                    </a>
                  </div>
                  <div class="cart-item-pic">
                    <img v-bind:src="'/static/'+item.productImg"/>
                  </div>
                  <div class="cart-item-title">
                    <div class="item-name">{{item.productName}}</div>
                  </div>
                </div>
                <div class="cart-tab-2">
                  <div class="item-price">{{item.productPrice}}</div>
                </div>
                <div class="cart-tab-3">
                  <div class="item-quantity">
                    <div class="select-self select-self-open">
                      <div class="select-self-area">
                        <a class="input-sub" @click="editCart('min',item)">-</a>
                        <span class="select-ipt">{{item.productNum}}</span>
                        <a class="input-add" @click="editCart('add',item)">+</a>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="cart-tab-4">
                  <div class="item-price-total">{{item.productNum * item.productPrice}}</div>
                </div>
                <div class="cart-tab-5">
                  <div class="cart-item-opration">
                    <a href="javascript:;" @click="onDelete(item)">
                      删除
                    </a>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="cart-foot-wrap">
          <div class="cart-foot-inner">
            <div class="cart-foot-l">
              <div class="item-all-check" @click="toggleCheckedAll">
                <a href="javascipt:;">
                  <span class="checkbox-btn item-check-btn" v-bind:class="{'check':isCheckedAll}">
                      <svg class="icon icon-ok"><use xlink:href="#icon-ok"/></svg>
                  </span>
                  <span>Select all</span>
                </a>
              </div>
            </div>
            <div class="cart-foot-r">
              <div class="item-total">
                Item total: <span class="total-price">{{totalPrice}}</span>
              </div>
              <div class="btn-wrap">
                <a class="btn btn--red" v-bind:class="{'btn--dis':checkedCount==0}" @click="checkout">Checkout</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <nav-footer></nav-footer>
    <Modal :mdShow="delModal" @close="delModal=false">
      <p slot="message">您确认要删除吗?</p>
      <div slot="btnGroup">
        <a class="btn btn--m" href="javascript:;" @click="delCart">确认</a>
        <a class="btn btn--m" href="javascript:;" @click="delModal=false">关闭</a>
      </div>
    </Modal>
  </div>
</template>

<script>
  import NavHeader from './../components/NavHeader.vue';
  import NavFooter from './../components/NavFooter';
  import NavBread from './../components/NavBread';
  import Modal from './../components/Modal';
  import axios from 'axios';
  import { currency } from './../utils';
  export default {
    name: 'Carts',
    data () {
      return {
        cartList:[],
        delModal:false,
        productId: ''
      }
    },
    mounted(){
      this.init();
    },
    computed:{
      isCheckedAll(){
        return this.checkedCount == this.cartList.length;
      },
      checkedCount(){
        let count = 0;
        this.cartList.forEach(function(item){
          if(item.checked == "1"){
            count++;
          }
        });
        return count;
      },
      totalPrice(){
        let totalAmount = 0
        this.cartList.forEach(function(item){
          if(item.checked == "1"){
            totalAmount += parseFloat(item.productPrice)*parseFloat(item.productNum);
          }
        });
        return totalAmount.toFixed(2);
      }
    },
    filters:{
      currency:currency
    },
    methods:{
      init(){
        const self = this;
        axios.get('/users/cartList').then(function(res){
          const data = res.data;
          self.cartList = data.result;
        });
      },
      onDelete(item){
        this.productId = item.productId;
        this.delModal = true;
      },
      delCart(){
        const self = this;
        axios.get('/users/cartDel',{params:{productId:this.productId}}).then(function(res){
          const data = res.data;
          if(data.status=='0'){
            self.delModal = false;
            self.init();
          }
        });
      },
      editCart(flag, item){
        const self = this;
        if(flag === 'min'){
          if(item.productNum <= 1){
            return;
          }
          item.productNum--;
        }else if(flag ==='add'){
          item.productNum++;
        }else if(flag === 'check'){
          item.checked = (item.checked == "1" ? '0' : 1);
        }
        axios.get('users/cartEdit',{
          params:{
            productId:item.productId,
            productNum:item.productNum,
            checked:item.checked
          }
        }).then(function(res){
          const data = res.data;
        });
      },
      toggleCheckedAll(){
        let flag = !this.isCheckedAll;
        this.cartList.forEach(function(item){
          item.checked = (flag ? 1 :0);
        });
        axios.get("/users/editCheckAll",{
          params:{checkAll:flag ? 1 : 0}
        }).then(function(res){

        });
      },
      checkout(){
        if(this.checkedCount > 0){
          this.$router.push({
            path:'/address'
          });
        }
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
