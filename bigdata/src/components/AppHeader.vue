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
  background-color: #ddd;
  box-shadow: inset 0 -4px 6px 0 rgba(0,0,0,0.1);
}
.nav-items {
  text-align: center;
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