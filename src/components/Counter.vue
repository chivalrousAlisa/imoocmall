<template>
  <div class="hello">
    <button @click="increment">+</button>
    <button v-on:click="decrement">-</button>
    <p>
      {{ num }}
    </p>
  </div>
</template>

<script>
export default {
  props:["num"],
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      num: 0
    }
  },
  methods:{
    increment(){
      this.$emit("incre");
    },
    decrement(){
      this.$emit("decre");
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
