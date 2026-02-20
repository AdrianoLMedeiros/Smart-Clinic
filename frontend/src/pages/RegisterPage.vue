<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { register } from "@/services/auth";
import { lookupCep } from "@/services/integrations";

type CepAddress = {
  cep?: string;
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
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

// Atualiza máscara enquanto digita
watch(cep, (v) => {
  const formatted = formatCep(v);
  if (formatted !== v) cep.value = formatted;
});

// Faz lookup automático quando tiver 8 dígitos (com “debounce” simples)
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
          e?.message || "Não foi possível consultar o CEP. Verifique e tente novamente.";
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
    errorMessage.value = "Preencha todos os campos obrigatórios.";
    return false;
  }

  if (!email.value.includes("@")) {
    errorMessage.value = "Informe um e-mail válido.";
    return false;
  }

  if (password.value.length < 6) {
    errorMessage.value = "A senha deve ter pelo menos 6 caracteres.";
    return false;
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = "As senhas não coincidem.";
    return false;
  }

  // CEP é opcional no enunciado? (no backend você integrou ViaCEP)
  // Aqui vamos exigir formato válido se preenchido
  if (cepDigits.value.length > 0 && cepDigits.value.length < 8) {
    errorMessage.value = "CEP incompleto. Informe 8 dígitos.";
    return false;
  }

  // Se digitou CEP completo e deu erro de consulta, avisa (pra não cadastrar “no escuro”)
  if (cepDigits.value.length === 8 && cepError.value) {
    errorMessage.value = "Corrija o CEP (consulta falhou) ou limpe o campo para cadastrar sem CEP.";
    return false;
  }

  return true;
}

async function handleRegister() {
  if (!validateForm()) return;

  try {
    loading.value = true;
    errorMessage.value = "";
    successMessage.value = "";

    await register({
      name: name.value.trim(),
      email: email.value.trim().toLowerCase(),
      password: password.value,
      cep: cepDigits.value.length === 8 ? cepDigits.value : undefined,
      // role: "PATIENT" // se o backend suportar setar role no register; senão, deixe sem.
    });

    successMessage.value = "Cadastro realizado! Você já pode fazer login.";
    // pequeno delay só pra dar feedback visual
    setTimeout(() => router.push("/login"), 700);
  } catch (e: any) {
    errorMessage.value = e?.message || "Não foi possível concluir o cadastro.";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="register-container">
    <div class="register-card">
      <h1>SmartClinic</h1>
      <h2>Cadastro</h2>

      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label>Nome completo *</label>
          <input v-model="name" type="text" placeholder="Seu nome" :disabled="loading" />
        </div>

        <div class="form-group">
          <label>E-mail *</label>
          <input v-model="email" type="email" placeholder="voce@email.com" :disabled="loading" />
        </div>

        <div class="form-group">
          <label>Senha *</label>
          <input
            v-model="password"
            type="password"
            placeholder="Mínimo 6 caracteres"
            :disabled="loading"
          />
        </div>

        <div class="form-group">
          <label>Confirmar senha *</label>
          <input
            v-model="confirmPassword"
            type="password"
            placeholder="Repita a senha"
            :disabled="loading"
          />
        </div>

        <div class="form-group">
          <label>CEP (opcional)</label>
          <input
            v-model="cep"
            inputmode="numeric"
            placeholder="00000-000"
            :disabled="loading"
          />

          <p v-if="cepLoading" class="hint">Consultando CEP...</p>
          <p v-else-if="cepError" class="error">{{ cepError }}</p>

          <div v-if="address" class="address-box">
            <p><strong>Logradouro:</strong> {{ address.logradouro || "-" }}</p>
            <p><strong>Bairro:</strong> {{ address.bairro || "-" }}</p>
            <p><strong>Cidade/UF:</strong> {{ address.localidade || "-" }} / {{ address.uf || "-" }}</p>
          </div>
        </div>

        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        <p v-if="successMessage" class="success">{{ successMessage }}</p>

        <button type="submit" :disabled="loading || (canLookupCep && cepLoading)">
          {{ loading ? "Cadastrando..." : "Cadastrar" }}
        </button>
      </form>

      <p class="login-link">
        Já tem conta?
        <router-link to="/login">Fazer login</router-link>
      </p>
    </div>
  </div>
</template>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f4f6f9;
}

.register-card {
  background: white;
  padding: 2rem;
  width: 380px;
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

.hint {
  margin: 0.5rem 0 0;
  font-size: 0.9rem;
  color: #666;
}

.address-box {
  margin-top: 0.75rem;
  padding: 0.75rem;
  background: #fafbfc;
  border: 1px solid #e6e8eb;
  border-radius: 8px;
  font-size: 0.9rem;
}

.address-box p {
  margin: 0.25rem 0;
}

.error {
  color: #c0392b;
  margin: 0.75rem 0;
  font-size: 0.92rem;
}

.success {
  color: #1e8449;
  margin: 0.75rem 0;
  font-size: 0.92rem;
}

.login-link {
  margin-top: 1rem;
  text-align: center;
  font-size: 0.9rem;
}
</style>