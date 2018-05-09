<template>
  <div>
    这是购物车页面
    <div class="">
      {{ $route.query }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'Carts',
  data () {
    return {
      num:10,
      msg: 'Welcome to Your Vue.js App'
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
