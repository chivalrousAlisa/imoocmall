import Vue from 'vue'
import Router from 'vue-router'
import Goodslist from './../views/Goodslist';
import Title from '@/views/Title';
import Image from '@/views/Image';
import Carts from '@/views/Carts';
import Address from '@/views/Address';
import OrderConfirm from '@/views/OrderConfirm';

Vue.use(Router);

export default new Router({
  mode:"history",
  routes: [
    {
      path: '/',
      name: 'Goodslist',
      components: {
        default:Goodslist
      },
      children:[
        {
          path: 'title',
          name: 'title',
          component: Title,
        },
        {
          path: 'image',
          name: 'image',
          component: Image,
        }
      ]
    },
    {
      path:'/carts',
      name:'carts',
      component: Carts
    },
    {
      path:'/address',
      name:'address',
      component: Address
    },
    {
      path:'/orderConfirm',
      name:'orderConfirm',
      component: OrderConfirm
    }
  ]
})
