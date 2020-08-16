<template>
  <transition-group
    tag="div"
    class="cards"
    name="cards"
  >
    <div v-for="card in cards" :key="card.name" class="card-item">
      <p class="name">{{ card.name }} </p>
      <p class="job">{{ card.job }} </p>
      <p class="univ">{{ card.univ }} </p>
      <p class="email">{{ card.email }} </p>
    </div>
  </transition-group>
</template>

<script>
export default {
  data() {
    return {
      cards: [
        {
          name: '김현겸',
          job: "Web Developer",
          univ: "Korea IT College",
          email: "kimhg951117@gmail.com"
        },
        {
          name: '신동환',
          job: "Asam Asset Management",
          univ: "Korea Univ.",
          email: "tlsehd0101@naver.com"
        },
        {
          name: '이수연',
          job: "SK Asset Management",
          univ: "Korea PT Univ.",
          email: "buzz7473@naver.com"
        },
        {
          name: '심은식',
          job: "Data Analyst",
          univ: "Daelim College",
          email: "essim92@naver.com"
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
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
}
.card-item {
  width: 49%;
  height: 300px;
  margin: 0.5%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  font-family: "NanumBarunpen";
  font-weight: bold;
  padding-right: 15px;
  background-color: #333;
  color: #e5e5e5;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2) ,0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
.card-item > p{
  margin: 15px 0;
}
.name {
  padding-left: 15px;
  align-self: start;
  font-family: "NanumSquareRound";
  font-size: 2.5rem;
  flex-grow: 1;
}
.job {
  color: #ffeb3b;
}
.card-item:hover {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2),0 6px 20px 0 rgba(0, 0, 0, 0.19)
}
@media screen and (min-width: 1025px){
.card-item {
  width: 24%;
}
}
</style>
