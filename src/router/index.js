import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "login",
    },
    {
      path: "/home",
      name: "home",
      component: () => import("../views/Home.vue"),
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/Login.vue"),
    },
    {
      path: "/order",
      name: "order",
      component: () => import("../views/Order.vue"),
    },
    {
      path: "/membership",
      name: "membership",
      component: () => import("../views/Membership.vue"),
    },
  ],
});

export default router;
