<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { login } from "@/services/auth";

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
    const role = response.user.role;

    if (role === "PATIENT") router.push("/schedule");
    else router.push("/admin/appointments");
  } catch (error: any) {
    errorMessage.value =
      error?.message || "Invalid credentials. Please try again.";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div>
    <h2 class="title">Login</h2>

    <form @submit.prevent="handleLogin" class="form">
      <div class="form-group">
        <label for="email">Email</label>
        <input
          id="email"
          v-model="email"
          type="email"
          placeholder="Enter your email"
          :disabled="loading"
          autocomplete="email"
        />
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input
          id="password"
          v-model="password"
          type="password"
          placeholder="Enter your password"
          :disabled="loading"
          autocomplete="current-password"
        />
      </div>

      <p v-if="errorMessage" class="error" role="alert">
        {{ errorMessage }}
      </p>

      <button type="submit" :disabled="loading">
        {{ loading ? "Logging in..." : "Login" }}
      </button>
    </form>

    <p class="link">
      Don't have an account?
      <router-link to="/register">Register here</router-link>
    </p>
  </div>
</template>

<style scoped>
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

label {
  font-size: 0.92rem;
  color: #374151;
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
