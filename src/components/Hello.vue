<template>
  <div class="hello">
    <Counter v-bind:num="num" v-on:incre="increment" v-on:decre="decrement"/>
    <p>parent:{{num}}</p>
  </div>
</template>

<script>
import Counter from './Counter'
export default {
  name: 'hello',
  data () {
    return {
      num:10,
      msg: 'Welcome to Your Vue.js App'
    }
  },
  components:{
    Counter
  },
  methods:{
    increment(){
      this.num++;
    },
    decrement(){
      this.num--;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
