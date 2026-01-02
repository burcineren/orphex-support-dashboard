import { createRouter, createWebHistory } from "vue-router";
import DashboardView from "../pages/DashboardView.vue";
import ChartsView from "../pages/ChartsView.vue";
import RequestDetailView from "../pages/RequestDetailView.vue";

const routes = [
  {
    path: "/",
    redirect: "/dashboard",
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: DashboardView,
    meta: { title: "Support Requests Dashboard" },
  },
  {
    path: "/charts",
    name: "charts",
    component: ChartsView,
    meta: { title: "Charts" },
  },
  {
    path: "/request/:id",
    name: "request-detail",
    component: RequestDetailView,
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
