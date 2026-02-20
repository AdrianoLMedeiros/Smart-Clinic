<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { register } from "@/services/auth";
import { lookupCep } from "@/services/integrations";


type CepAddress = {
  cep?: string;
  street?: string;
  district?: string;
  city?: string;
  state?: string;
  complement?: string;
};

const router = useRouter();

const name = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const cep = ref("");

const loading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

const cepLoading = ref(false);
const cepError = ref("");
const address = ref<CepAddress | null>(null);

const cepDigits = computed(() => cep.value.replace(/\D/g, "").slice(0, 8));
const canLookupCep = computed(() => cepDigits.value.length === 8);

function formatCep(raw: string) {
  const d = raw.replace(/\D/g, "").slice(0, 8);
  if (d.length <= 5) return d;
  return `${d.slice(0, 5)}-${d.slice(5)}`;
}

watch(cep, (v) => {
  const formatted = formatCep(v);
  if (formatted !== v) cep.value = formatted;
});

let cepTimer: number | undefined;
watch(
  () => cepDigits.value,
  (digits) => {
    address.value = null;
    cepError.value = "";

    if (cepTimer) window.clearTimeout(cepTimer);
    if (digits.length !== 8) return;

    cepTimer = window.setTimeout(async () => {
      try {
        cepLoading.value = true;
        const data = await lookupCep(digits);
        address.value = data;
      } catch (e: any) {
        cepError.value =
          e?.message || "Could not fetch CEP. Please verify and try again.";
      } finally {
        cepLoading.value = false;
      }
    }, 350);
  }
);

function validateForm() {
  errorMessage.value = "";
  successMessage.value = "";

  if (!name.value.trim() || !email.value.trim() || !password.value || !confirmPassword.value) {
    errorMessage.value = "Please fill in all required fields.";
    return false;
  }

  if (!email.value.includes("@")) {
    errorMessage.value = "Please enter a valid email.";
    return false;
  }

  if (password.value.length < 6) {
    errorMessage.value = "Password must be at least 6 characters long.";
    return false;
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = "Passwords do not match.";
    return false;
  }

  if (cepDigits.value.length > 0 && cepDigits.value.length < 8) {
    errorMessage.value = "CEP is incomplete. Please enter 8 digits.";
    return false;
  }

  if (cepDigits.value.length === 8 && cepError.value) {
    errorMessage.value = "Fix the CEP (lookup failed) or clear it to register without CEP.";
    return false;
  }

  return true;
}

async function handleRegister() {
  if (!validateForm()) return;

  try {
    loading.value = true;

    await register({
      name: name.value.trim(),
      email: email.value.trim().toLowerCase(),
      password: password.value,
      cep: cepDigits.value.length === 8 ? cepDigits.value : undefined,
    });

    successMessage.value = "Registration successful! Redirecting to login...";
    setTimeout(() => router.push("/login"), 700);
  } catch (e: any) {
    errorMessage.value = e?.message || "Registration failed. Please try again.";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div>
    <h2 class="title">Register</h2>

    <form @submit.prevent="handleRegister" class="form">
      <div class="form-group">
        <label>Full name *</label>
        <input v-model="name" type="text" placeholder="Your name" :disabled="loading" />
      </div>

      <div class="form-group">
        <label>Email *</label>
        <input v-model="email" type="email" placeholder="you@email.com" :disabled="loading" />
      </div>

      <div class="form-group">
        <label>Password *</label>
        <input
          v-model="password"
          type="password"
          placeholder="Minimum 6 characters"
          :disabled="loading"
        />
      </div>

      <div class="form-group">
        <label>Confirm password *</label>
        <input
          v-model="confirmPassword"
          type="password"
          placeholder="Repeat your password"
          :disabled="loading"
        />
      </div>

      <div class="form-group">
        <label>CEP (optional)</label>
        <input
          v-model="cep"
          inputmode="numeric"
          placeholder="00000-000"
          :disabled="loading"
        />

        <p v-if="cepLoading" class="hint">Looking up CEP...</p>
        <p v-else-if="cepError" class="error">{{ cepError }}</p>
        <P> VERIFICAR PORQUE CARGA DOS DADOS DO ENDEREÇO DO CEP DIGITADO NÂO ESTÁ OCORRENDO</P>
        <div v-if="address" class="address-box">
          <p><strong>Street:</strong> {{ address.street || "-" }}</p>
          <p><strong>District:</strong> {{ address.district || "-" }}</p>
          <p><strong>City/State:</strong> {{ address.city || "-" }} / {{ address.state || "-" }}</p>
        </div>
      </div>

      <p v-if="errorMessage" class="error center">{{ errorMessage }}</p>
      <p v-if="successMessage" class="success center">{{ successMessage }}</p>

      <button type="submit" :disabled="loading || (canLookupCep && cepLoading)">
        {{ loading ? "Registering..." : "Create account" }}
      </button>
    </form>

    <p class="link">
      Already have an account?
      <router-link to="/login">Login</router-link>
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

.hint {
  margin: 0.35rem 0 0;
  font-size: 0.9rem;
  color: #6b7280;
}

.address-box {
  margin-top: 0.7rem;
  padding: 0.75rem;
  background: #fafbfc;
  border: 1px solid #e6e8eb;
  border-radius: 10px;
  font-size: 0.9rem;
}

.address-box p {
  margin: 0.25rem 0;
}

.error {
  color: #c0392b;
  font-size: 0.92rem;
  margin: 0;
}

.success {
  color: #1e8449;
  font-size: 0.92rem;
  margin: 0;
}

.center {
  text-align: center;
}

.link {
  margin-top: 1rem;
  text-align: center;
  font-size: 0.92rem;
  color: #6b7280;
}
</style>