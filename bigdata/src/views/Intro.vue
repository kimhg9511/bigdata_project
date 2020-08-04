<template>
  <transition-group
    tag="div"
    class="cards"
    name="cards"
  >
    <div v-for="card in cards" v-bind:key="card.name" class="card-item">
      {{ card.name }}
    </div>
  </transition-group>
</template>

<script>
export default {
  data() {
    return {
      cards: [
        {
          name: 'a'
        },
        {
          name: 'b'
        },
        {
          name: 'c'
        },
        {
          name: 'd'
        },
      ]
    }
  }
};
</script>

<style scoped>
.cards {
  background-color: #ccc;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.card-item {
  width: 300px;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 5rem;
  font-weight: bold;
  background-color: #bbb;
  /* transition: all 1s; */
}
/* .cards-enter-active {
} */
</style>
