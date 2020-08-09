<template>
  <div id="app-container">
    <app-header></app-header>
    <app-main></app-main>
    <app-footer></app-footer>
  </div>
</template>
<script>
import AppHeader from './components/AppHeader.vue'
import AppMain from './components/AppMain.vue'
import AppFooter from './components/AppFooter.vue'
export default {
  components: {
    AppHeader,
    AppMain,
    AppFooter
  },
}
</script>

<style>
#app-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
}
.svg-container {
  position: relative;
  width: 100%;
  vertical-align: top;
  overflow: hidden;
}
.svg-container:before {
  content: "";
  display: block;
}
.svg-content {
  position: absolute;
  top: 0;
  left: 0;
}

</style>