import { createRouter, createWebHistory } from "vue-router";
import DashboardPage from "@/pages/DashboardPage.vue";
import RequestDetailPage from "@/pages/RequestDetailPage.vue";
import ChartsPage from "@/pages/ChartsPage.vue";

const routes = [
  {
    path: "/",
    redirect: "/dashboard",
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: DashboardPage,
    meta: { title: "Support Requests Dashboard" },
  },
  {
    path: "/charts",
    name: "charts",
    component: ChartsPage,
    meta: { title: "Charts" },
  },
  {
    path: "/request/:id",
    name: "request-detail",
    component: RequestDetailPage,
    props: true,
    meta: { title: "Request Details" },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || "Orphex Dashboard";
  next();
});

export default router;
