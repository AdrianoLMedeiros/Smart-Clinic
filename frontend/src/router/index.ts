import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

import GuestLayout from "@/layouts/GuestLayout.vue";
import LoginPage from "@/pages/LoginPage.vue";
import RegisterPage from "@/pages/RegisterPage.vue";

import AuthenticatedLayout from "@/layouts/AuthenticatedLayout.vue";
import SchedulePage from "@/pages/SchedulePage.vue";
import MyAppointmentsPage from "@/pages/MyAppointmentsPage.vue";
import AdminAppointmentsPage from "@/pages/AdminAppointmentsPage.vue";

type Role = "PATIENT" | "SECRETARY" | "ADMIN";

function homeByRole(auth: ReturnType<typeof useAuthStore>) {
  return auth.isAdminish ? "/admin" : "/schedule";
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // Home contextual
    { path: "/", redirect: () => homeByRole(useAuthStore()) },

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

        // ✅ só PATIENT
        {
          path: "my-appointments",
          component: MyAppointmentsPage,
          meta: { roles: ["PATIENT"] as Role[] },
        },

        // ✅ SECRETARY/ADMIN
        {
          path: "admin",
          component: AdminAppointmentsPage,
          meta: { roles: ["SECRETARY", "ADMIN"] as Role[] },
        },
      ],
    },

    // fallback opcional
    { path: "/:pathMatch(.*)*", redirect: "/" },
  ],
});

router.beforeEach((to) => {
  const auth = useAuthStore();

  const requiresAuth = Boolean(to.meta.requiresAuth);
  const guestOnly = Boolean(to.meta.guestOnly);
  const roles = (to.meta.roles as Role[] | undefined) ?? null;

  // 1) Auth required
  if (requiresAuth && !auth.isAuthenticated) return "/login";

  // 2) Guest-only
  if (guestOnly && auth.isAuthenticated) return homeByRole(auth);

  // 3) Role-based authorization
  if (roles) {
    const userRole = auth.role as Role | undefined;
    if (!userRole || !roles.includes(userRole)) {
      return homeByRole(auth);
    }
  }

  return true;
});

export default router;