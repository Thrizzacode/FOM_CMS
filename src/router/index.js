import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
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
    {
      path: "/announcement",
      name: "announcement",
      component: () => import("../views/Announcement.vue"),
    },
    {
      path: "/:catchAll(.*)",
      name: "404",
      component: () => import("../views/404.vue"),
    },
  ],
});

export default router;
