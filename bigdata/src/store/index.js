import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    domains: [
      {
        url: "home",
        name: "logo"
      },
      {
        url: "intro",
        name: "intro"
      },
      {
        url: "dashboard",
        name: "대시보드"
      },
      {
        url: "user1",
        name: "일자별 시총 순위"
      },
      {
        url: "user2",
        name: "월별 수익률"
      },
      {
        url: "user3",
        name: "코인 커뮤니티 키워드"
      },
      // {
      //   url: "user4",
      //   name: "유저4"
      // },
      // {
      //   url: "skip",
      //   name: "skip"
      // }
    ],
  },
  getters: {
    urls(state) {
      return state.domains.map(domain =>domain.url);
    }
  },
  mutations: {

  },
  actions: {

  },
  modules: {}
});
