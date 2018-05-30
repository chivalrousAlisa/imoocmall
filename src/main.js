// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vuex from 'vuex';
import App from './App'
import router from './router'
import VueLazyLoad from 'vue-lazyload';
import infiniteScroll from 'vue-infinite-scroll';
import { currency } from './utils.js'

Vue.config.productionTip = false

Vue.use(infiniteScroll);
Vue.use(Vuex);
Vue.use(VueLazyLoad,{
  loading:"/static/Loading-svg/loading-bars.svg"
});

Vue.filter("currency",currency);

const store = new Vuex.Store({
  state:{
    userName:'',
    cartCount:0
  },
  mutations:{
    updateUserInfo(state, nickName){
      state.userName = nickName;
    },
    updateCartsCount(state, cartCount){
      state.cartCount = cartCount;
    }
  }
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
