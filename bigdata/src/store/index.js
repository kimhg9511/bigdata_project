import Vue from "vue";
import Vuex from "vuex";
import { loadFile } from "../api/utils.js"
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    domains: [
      {
        url: "home",
        name: "GB"
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
        name: "시총 순위"
      },
      {
        url: "user2",
        name: "시총 전략"
      },
      {
        url: "user4",
        name: "영업이익률"
      },
      {
        url: "user3",
        name: "커뮤니티 키워드"
      },
    ],
    dataCloud: {},
    dataLineProfit: [],
    dataBarProfit: [],
    dataBarMarcap: [],
    dataBarProfitUpgrade: [],
    dataLineProfitUpgrade: [],
    month: "",
  },
  getters: {
    urls(state) {
      return state.domains.map(domain =>domain.url);
    }
  },
  mutations: {
    changeMonth(state, month) {
      state.month = month;
    },
    SET_DATA_CLOUD(state, dataCloud) {
      state.dataCloud = dataCloud;
    },
    SET_JSON_BAR_MARCAP(state, dataBarMarcap) {
      state.dataBarMarcap = dataBarMarcap;
    },
    SET_CSV_LINE_PROFIT(state, dataLineProfit) {
      state.dataLineProfit = dataLineProfit;
    },
    SET_CSV_BAR_PROFIT(state, dataBarProfit) {
      state.dataBarProfit = dataBarProfit;
    },
    SET_CSV_BAR_PROFIT_UPGRADE(state, dataBarProfitUpgrade) {
      state.dataBarProfitUpgrade = dataBarProfitUpgrade;
    },
    SET_CSV_LINE_PROFIT_UPGRADE(state, dataLineProfitUpgrade) {
      state.dataLineProfitUpgrade = dataLineProfitUpgrade;
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
    },
    LOAD_JSON_BAR_MARCAP({ commit }, fileName) {
      return loadFile(fileName)
        .then(({data}) => commit('SET_JSON_BAR_MARCAP', data))
        .catch(error => console.log(error));
    },
    LOAD_CSV_BAR_PROFIT_UPGRADE({ commit }, fileName) {
      return loadFile(fileName)
        .then(({data}) => {
          let dataBarProfitUpgrade = data.split("\n").map(el => el.split(","));
          dataBarProfitUpgrade = dataBarProfitUpgrade.map(el => {
            el[1] = el[1] == "#VALUE!" ? 0 : el[1];
            el[2] = escape(el[2]).replace("%0D","");
            return el
          })
          commit('SET_CSV_BAR_PROFIT_UPGRADE', dataBarProfitUpgrade)
        })
        .catch(error => console.log(error));
    },
    LOAD_CSV_LINE_PROFIT_UPGRADE({ commit }, fileName) {
      return loadFile(fileName)
        .then(({data}) => {
          let dataLineProfitUpgrade = data.split("\n").map(el => el.split(","));
          dataLineProfitUpgrade = dataLineProfitUpgrade.map(el => {
            el[1] = el[1] == "#VALUE!" ? 0 : el[1];
            el[2] = escape(el[2]).replace("%0D","");
            return el
          })
          commit('SET_CSV_LINE_PROFIT_UPGRADE', dataLineProfitUpgrade)
        })
        .catch(error => console.log(error));
    }
  },
  modules: {}
});
