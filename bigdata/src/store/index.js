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
      state.dataLineProfit = dataLineProfit;
    },
    SET_CSV_BAR_PROFIT(state, dataBarProfit) {
      state.dataBarProfit = dataBarProfit;
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
      return loadFile(fileName)
        .then(({data}) => {
          const dataLineProfit = data.split("\n").map(el => el.split(",")).slice(1,-1);
          commit('SET_CSV_LINE_PROFIT', dataLineProfit)
        })
        .catch(error => console.log(error));
    },
    LOAD_CSV_BAR_PROFIT({ commit }, fileName) {
      return loadFile(fileName)
        .then(({data}) => {
          let dataBarProfit = data.split("\n").map(el => el.split(","));
          dataBarProfit = dataBarProfit.map(el => {
            el[1] = el[1] == "#VALUE!" ? 0 : el[1];
            el[2] = escape(el[2]).replace("%0D","");
            return el
          })
          commit('SET_CSV_BAR_PROFIT', dataBarProfit)
        })
        .catch(error => console.log(error));
    }
  },
  modules: {}
});
