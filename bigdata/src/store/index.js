import Vue from "vue";
import Vuex from "vuex";
import { loadFile } from "../api/utils.js"
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
    ],
    dataCloud: {},
    dataLineProfit: [],
    dataBarProfit: []
  },
  getters: {
    urls(state) {
      return state.domains.map(domain =>domain.url);
    }
  },
  mutations: {
    SET_DATA_CLOUD(state, dataCloud) {
      state.dataCloud = dataCloud;
    },
    SET_CSV_LINE_PROFIT(state, dataLineProfit) {
      state.dataLineProfit = dataLineProfit.slice(1,-1);
    },
    SET_CSV_BAR_PROFIT(state, dataBarProfit) {
      state.dataBarProfit = dataBarProfit.slice(1,-1);
    }
  },
  actions: {
    LOAD_JSON_CLOUD({ commit }, fileName) {
      return loadFile(fileName)
        .then(({data}) => {
          commit('SET_DATA_CLOUD', data)
        })
        .catch(error => console.log(error));
    },
    LOAD_CSV_LINE_PROFIT({ commit }, fileName) {
      // console.log("line action called...");
      return loadFile(fileName)
        .then(({data}) => {
          const dataLineProfit = data.split("\n").map(el => el.split(","));
          commit('SET_CSV_LINE_PROFIT', dataLineProfit)
        })
        .catch(error => console.log(error));
    },
    LOAD_CSV_BAR_PROFIT({ commit }, fileName) {
      // console.log("line action called...");
      return loadFile(fileName)
        .then(({data}) => {
          const dataBarProfit = data.split("\n").map(el => el.split(","));
          commit('SET_CSV_BAR_PROFIT', dataBarProfit)
        })
        .catch(error => console.log(error));
    }
  },
  modules: {}
});
