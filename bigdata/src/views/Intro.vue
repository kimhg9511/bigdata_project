<template>
  <transition-group
    tag="div"
    class="cards"
    name="cards"
  >
    <div v-for="card in cards" :key="card.name" class="card-item">
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
      ],
      mouseover: {
        'background-color': "#fff"
      }
    }
  }
};
</script>

<style scoped>
.cards {
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
  /* transition: all 0.8s; */
}
.card-item:hover {
  background-color: #fff;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2),0 6px 20px 0 rgba(0, 0, 0, 0.19)
}
/* .cards-enter-active {
} */
</style>
