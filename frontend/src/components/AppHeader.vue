<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const auth = useAuthStore();

function handleLogout() {
  auth.clearSession();
  router.push("/login");
}
</script>

<template>
  <header class="app-header">
    <div class="brand">
      <h1>SmartClinic</h1>
    </div>

    <div class="user-area" v-if="auth.user">
      <span class="user-name">
        {{ auth.user.name }}
      </span>

      <button class="logout-button" @click="handleLogout">
        Logout
      </button>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #2c3e50;
  color: white;
}

.brand h1 {
  margin: 0;
  font-size: 1.3rem;
}

.user-area {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-name {
  font-weight: 500;
}

.logout-button {
  padding: 0.5rem 0.9rem;
  border: none;
  border-radius: 6px;
  background-color: #c0392b;
  color: white;
  font-weight: 600;
  cursor: pointer;
}

.logout-button:hover {
  background-color: #a93226;
}
</style>
