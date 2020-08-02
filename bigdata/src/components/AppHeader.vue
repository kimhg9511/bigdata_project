<template>
  <header>
    <div class="logo"><div>logo</div></div>
    <div class="nav-bar">
      <div class="nav-items">... hello ...</div>
      <div class="nav-items">... user1 ...</div>
      <div class="nav-items">... user2 ...</div>
      <div class="nav-items">... user3 ...</div>
      <div class="nav-items">... user4 ...</div>
      <div class="nav-items">... 결론 ...</div>
    </div>
    <div class="skip">skip</div>
  </header>
</template>

<script>
export default {};
</script>

<style>
header {
  height: 100px;
  display: flex;
  justify-content: space-between;
}
.logo {
  width: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
}
.nav-bar {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
.nav-items {
  margin: 0 20px;
}
.skip {
  width: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
}
</style>