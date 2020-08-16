<template>
  <header class="nav-bar">
    <router-link 
      :to="domain.url"
      v-for="domain in domains"
      :key="domain.url"
      class="nav-items" 
      exact-active-class="selected"
    >
      {{ domain.name }}
    </router-link>
  </header>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState(['domains']),
  },
  methods: {
    setDirection() {
      const name = this.$route.path.replace('/','');
      this.$store.dispatch('setDirection', name);
    }
  }
};
</script>

<style scoped>
.nav-bar {
  flex-shrink: 0;
  height: 100px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #333;
  box-shadow: inset 0 -3px 3px 0 rgba(255,255,255,0.15);
}
.nav-items {
  text-align: center;
  font-family: "NanumBarunpen";
  font-size: 1.4rem;
  font-weight: 700;
  color: #ffeb3b;
}
.nav-items:first-of-type/*, .nav-items:last-of-type*/{
  width: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
}
.nav-items:not(:first-of-type)/*.nav-items:not(:last-of-type)*/{
  flex-grow: 1;
}
</style>