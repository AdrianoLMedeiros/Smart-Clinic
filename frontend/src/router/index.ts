import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

import GuestLayout from "@/layouts/GuestLayout.vue";
import LoginPage from "@/pages/LoginPage.vue";
import RegisterPage from "@/pages/RegisterPage.vue";

import AuthenticatedLayout from "@/layouts/AuthenticatedLayout.vue";
import SchedulePage from "@/pages/SchedulePage.vue";
import MyAppointmentsPage from "@/pages/MyAppointmentsPage.vue";
import AdminAppointmentsPage from "@/pages/AdminAppointmentsPage.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/schedule" },

    // 👤 Guest area (sem header)
    {
      path: "/",
      component: GuestLayout,
      meta: { guestOnly: true },
      children: [
        { path: "login", component: LoginPage },
        { path: "register", component: RegisterPage },
      ],
    },

    // Auth area (com header)
    {
      path: "/",
      component: AuthenticatedLayout,
      meta: { requiresAuth: true },
        children: [
          { path: "schedule", component: SchedulePage },
        { path: "my-appointments", component: MyAppointmentsPage },
        {
          path: "admin",
          component: AdminAppointmentsPage,
          meta: { requiresAdminish: true },
        },
      ],
    },
  ],
});

router.beforeEach((to) => {
  const auth = useAuthStore();

  if (to.meta.requiresAuth && !auth.isAuthenticated) return "/login";
  if (to.meta.guestOnly && auth.isAuthenticated) return "/schedule";
  if (to.meta.requiresAdminish && !auth.isAdminish) return "/schedule";

  return true;
});

export default router;