<template>
  <div id="modal">
    <div class="md-modal modal-msg md-modal-transition" v-bind:class="{'md-show':mdShow}">
      <div class="md-modal-inner">
        <div class="md-top">
          <button class="md-close" @click="operateModal">Close</button>
        </div>
        <div class="md-content">
          <div class="confirm-tips">
            <slot name="message"></slot>
          </div>
          <div class="btn-wrap">
            <slot name="btnGroup"></slot>
          </div>
        </div>
      </div>
    </div>
    <div class="md-overlay" v-if="mdShow"></div>
  </div>
</template>
<style>

</style>
<script>
  const Modal = {
    props:["mdShow"],
    data(){
      return {
//        isModalShow:false
      }
    },
//    beforeCreate(){
//      console.log('beforeCreate');
//    },
//    created(){
//      console.log('created');
//    },
//    beforeMount(){
//      console.log('beforeMount');
//    },
    mounted(){
//      const data = this.$options.propsData;
//      this.isModalShow = data.mdShow;
    },
//    beforeUpdate(){
//      console.log('beforeUpdate');
//    },
//    updated(){
//      console.log('updated');
//    },
//    beforeDestroy(){
//      console.log('beforeDestroy');
//    },
//    destroyed(){
//      console.log('destroyed');
//    },
    methods:{
      operateModal(isShow){
//        this.isModalShow = isShow;
        this.$emit("close");
      }
    }
  };
  export default Modal;
</script>
