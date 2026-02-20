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
  <div class="login-container">
    <div class="login-card">
      <h1>SmartClinic</h1>
      <h2>Login</h2>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>Email</label>
          <input
            v-model="email"
            type="email"
            placeholder="Enter your email"
            :disabled="loading"
          />
        </div>

        <div class="form-group">
          <label>Password</label>
          <input
            v-model="password"
            type="password"
            placeholder="Enter your password"
            :disabled="loading"
          />
        </div>

        <p v-if="errorMessage" class="error">
          {{ errorMessage }}
        </p>

        <button type="submit" :disabled="loading">
          {{ loading ? "Logging in..." : "Login" }}
        </button>
      </form>

      <p class="register-link">
        Don't have an account?
        <router-link to="/register">Register here</router-link>
      </p>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f4f6f9;
}

.login-card {
  background: white;
  padding: 2rem;
  width: 350px;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

h1 {
  margin: 0;
  text-align: center;
}

h2 {
  margin-top: 0.5rem;
  text-align: center;
  font-weight: 500;
  color: #666;
}

.form-group {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
}

input {
  padding: 0.6rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  margin-top: 0.3rem;
}

button {
  width: 100%;
  padding: 0.7rem;
  border: none;
  border-radius: 6px;
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
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.register-link {
  margin-top: 1rem;
  text-align: center;
  font-size: 0.9rem;
}
</style>