import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import transitions from "@/styles/transitions.css";
Vue.config.productionTip = false;

new Vue({
  transitions,
  router,
  store,
  render: h => h(App)
}).$mount("#app");
