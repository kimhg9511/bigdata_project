<template>
  <div class="user2">
    <svg class="test1" width="500" height="500"></svg>
    <svg class="test2" width="500" height="500"></svg>
  </div>
</template>

<script>
import * as d3 from "d3";

export default {
  mounted() {
  },
  methods: {
  }
}
</script>

<style scoped>
.user2{
  display: flex;
  flex-direction: column;
}
.test1 {
  background-color: #aaa;
  width: 50%;
}
.test2 {
  background-color: #999;
  width: 50%;
}
</style>