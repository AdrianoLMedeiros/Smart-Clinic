<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const route = useRoute();
const auth = useAuthStore();

const isAdminish = computed(() => auth.isAdminish); // SECRETARY/ADMIN

function isActive(path: string) {
  return route.path === path;
}

function handleLogout() {
  auth.clearSession();
  router.push("/login");
}
</script>

<template>
  <header class="app-header">
    <div class="left">
      <div
        class="brand"
        @click="router.push('/schedule')"
        role="button"
        tabindex="0"
      >
        SmartClinic
      </div>

      <nav class="nav">
        <router-link
          to="/schedule"
          class="nav-link"
          :class="{ active: isActive('/schedule') }"
        >
          Schedule
        </router-link>

        <router-link
          to="/my-appointments"
          class="nav-link"
          :class="{ active: isActive('/my-appointments') }"
        >
          My Appointments
        </router-link>

        <router-link
          v-if="isAdminish"
          to="/admin"
          class="nav-link"
          :class="{ active: isActive('/admin') }"
        >
          Admin
        </router-link>
      </nav>
    </div>

    <div class="right">
      <span class="user">
        {{ auth.user?.name }}
        <small v-if="auth.user?.role">({{ auth.user.role }})</small>
      </span>

      <button class="logout" @click="handleLogout">Logout</button>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.9rem 1.5rem;
  background-color: #2c3e50;
  color: white;
}

.left {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.brand {
  font-size: 1.35rem;
  font-weight: 800;
  cursor: pointer;
  user-select: none;
}

.nav {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.nav-link {
  padding: 0.45rem 0.7rem;
  border-radius: 10px;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.88);
  font-weight: 700;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.12);
  color: white;
}

.nav-link.active {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user {
  font-weight: 700;
  opacity: 0.95;
}

.logout {
  padding: 0.55rem 0.9rem;
  border: none;
  border-radius: 10px;
  background-color: #c0392b;
  color: white;
  font-weight: 800;
  cursor: pointer;
}

.logout:hover {
  background-color: #a93226;
}
</style>
