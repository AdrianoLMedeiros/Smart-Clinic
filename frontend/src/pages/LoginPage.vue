<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { login } from "@/services/auth";

import bgUrl from "@/assets/login-bg.png";

const router = useRouter();
const auth = useAuthStore();

const email = ref("");
const password = ref("");
const loading = ref(false);
const errorMessage = ref("");

async function handleLogin() {
  errorMessage.value = "";

  if (!email.value || !password.value) {
    errorMessage.value = "Please fill in all fields.";
    return;
  }

  try {
    loading.value = true;

    const response = await login({
      email: email.value,
      password: password.value,
    });

    auth.setSession(response.token, response.user);
    router.push("/schedule");
  } catch (error: any) {
    errorMessage.value =
      error?.message || "Invalid credentials. Please try again.";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <!-- Fundo da página -->
  <div class="page" :style="{ backgroundImage: `url(${bgUrl})` }">
    <!-- Overlay para contraste -->
    <div class="overlay" />

    <!-- Card -->
    <div class="card" role="region" aria-label="Login">
      <h2 class="title">Login</h2>

      <form @submit.prevent="handleLogin" class="form">
        <div class="form-group">
          <label>Email</label>
          <input
            v-model="email"
            type="email"
            placeholder="Enter your email"
            :disabled="loading"
            autocomplete="email"
          />
        </div>

        <div class="form-group">
          <label>Password</label>
          <input
            v-model="password"
            type="password"
            placeholder="Enter your password"
            :disabled="loading"
            autocomplete="current-password"
          />
        </div>

        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

        <button type="submit" :disabled="loading">
          {{ loading ? "Logging in..." : "Login" }}
        </button>
      </form>

      <p class="link">
        Don't have an account?
        <router-link to="/register">Register here</router-link>
      </p>
    </div>
  </div>
</template>

<style scoped>
/* Página inteira com background */
.page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;

  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  position: relative;
  overflow: hidden;
}

/* Overlay para legibilidade do card */
.overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(2px);
}

/* Card central */
.card {
  position: relative; /* acima do overlay */
  z-index: 1;

  width: min(420px, 100%);
  padding: 24px;
  border-radius: 16px;

  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.55);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
}

.title {
  margin: 0 0 1rem;
  text-align: center;
  font-weight: 600;
  color: #374151;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

input {
  padding: 0.6rem;
  border-radius: 8px;
  border: 1px solid #d1d5db;
}

button {
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  background: #2c3e50;
  color: white;
  font-weight: 600;
  cursor: pointer;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  color: #c0392b;
  font-size: 0.92rem;
  margin: 0;
  text-align: center;
}

.link {
  margin-top: 1rem;
  text-align: center;
  font-size: 0.92rem;
  color: #6b7280;
}
</style>
