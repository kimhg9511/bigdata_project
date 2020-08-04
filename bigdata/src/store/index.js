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
        url: "user1",
        name: "유저1"
      },
      {
        url: "user2",
        name: "유저2"
      },
      {
        url: "user3",
        name: "유저3"
      },
      {
        url: "user4",
        name: "유저4"
      },
      {
        url: "final",
        name: "결론"
      },
      {
        url: "skip",
        name: "skip"
      }
    ]
  },
  getters: {
    urls(state) {
      return state.domains.map(domain =>domain.url);
    }
  },
  mutations: {
    triggerTransition(state, payload) {
      console.log(state);
      console.log(payload);
    }
  },
  actions: {
  },
  modules: {}
});
