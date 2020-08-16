import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Root",
    redirect: "/home"
  },
  {
    path: "/home",
    name: "Home",
    component: () => import("../views/Home.vue")
  },
  {
    path: "/intro",
    name: "Intro",
    component: () => import("../views/Intro.vue")
  },
  {
    path: "/dashboard",
    name: "DashBoard",
    component: () => import("../views/DashBoard.vue")
  },
  {
    path: "/user1",
    name: "User1",
    component: () => import("../views/User1.vue")
  },
  {
    path: "/user2",
    name: "User2",
    component: () => import("../views/User2.vue")
  },
  {
    path: "/user3",
    name: "User3",
    component: () => import("../views/User3.vue")
  },
  {
    path: "/user4",
    name: "User4",
    component: () => import("../views/User4.vue")
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
