<template>
  <div class="home">
    <div class="user-card">a</div>
    <div class="user-card">b</div>
    <div class="user-card">c</div>
    <div class="user-card">d</div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.home {
  flex-grow: 1;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: #ccc;
}
.user-card {
  width: 300px;
  background-color: #bbb;
}
</style>
