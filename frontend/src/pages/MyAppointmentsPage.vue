<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { myAppointments, cancelMyAppointment } from "@/services/appointments";

type AppointmentStatus = "PENDING" | "CONFIRMED" | "CANCELED";

type Appointment = {
  _id: string;
  patientId: string;
  date: string; // "YYYY-MM-DD"
  time: string; // "HH:mm"
  status: AppointmentStatus;
  rainAlert: boolean;
  weatherSummary?: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
};

const loading = ref(false);
const cancelingId = ref<string | null>(null);
const errorMessage = ref("");
const items = ref<Appointment[]>([]);

const hasItems = computed(() => items.value.length > 0);

function formatISODate(dateStr: string) {
  // funcional primeiro: mantém ISO. Depois a gente formata pt-BR.
  return dateStr;
}

function canCancel(a: Appointment) {
  if (a.status === "CANCELED") return false;

  // Regra opcional: impedir cancelamento no passado
  // (se você não quiser isso no front, pode remover sem problemas)
  const when = new Date(`${a.date}T${a.time}:00`);
  if (when < new Date()) return false;

  return true;
}

function extractErrorMessage(e: any, fallback: string) {
  return e?.response?.data?.message || e?.message || fallback;
}

async function load() {
  errorMessage.value = "";
  try {
    loading.value = true;
    const data = await myAppointments();
    items.value = Array.isArray(data?.appointments) ? data.appointments : [];
  } catch (e: any) {
    errorMessage.value = extractErrorMessage(
      e,
      "Could not load your appointments.",
    );
  } finally {
    loading.value = false;
  }
}

async function cancelAppointment(a: Appointment) {
  if (!canCancel(a)) return;

  const ok = confirm(
    `Cancel the appointment on ${formatISODate(a.date)} at ${a.time}?`,
  );
  if (!ok) return;

  errorMessage.value = "";
  cancelingId.value = a._id;

  try {
    const updated = await cancelMyAppointment(a._id);

    // Atualiza local (sem refetch) — sem índice, TS-friendly
    const item = items.value.find((x) => x._id === a._id);
    if (!item) return;

    item.status = (updated?.status ?? "CANCELED") as AppointmentStatus;
  } catch (e: any) {
    errorMessage.value = extractErrorMessage(
      e,
      "Could not cancel appointment.",
    );
  } finally {
    cancelingId.value = null;
  }
}

onMounted(load);
</script>

<template>
  <div class="page">
    <header class="page-header">
      <h2>My Appointments</h2>
      <p class="muted">Here are your scheduled appointments.</p>
    </header>

    <section class="panel">
      <div class="top-row">
        <button class="btn" type="button" @click="load" :disabled="loading">
          {{ loading ? "Refreshing..." : "Refresh" }}
        </button>

        <router-link class="btn primary" to="/schedule"
          >New appointment</router-link
        >
      </div>

      <p v-if="errorMessage" class="msg error">{{ errorMessage }}</p>

      <div v-if="loading" class="muted">Loading appointments...</div>

      <div v-else-if="!hasItems" class="empty">
        <p>No appointments found.</p>
        <router-link to="/schedule">Schedule one now →</router-link>
      </div>

      <div v-else class="list">
        <article v-for="a in items" :key="a._id" class="card">
          <div class="left">
            <div class="line">
              <span class="label">Date:</span>
              <span class="value">{{ formatISODate(a.date) }}</span>
            </div>

            <div class="line">
              <span class="label">Time:</span>
              <span class="value">{{ a.time }}</span>
            </div>

            <div class="line">
              <span class="label">Status:</span>
              <span class="badge" :class="a.status.toLowerCase()">
                {{ a.status }}
              </span>
            </div>

            <div v-if="a.rainAlert" class="rain-alert">
              <span class="umbrella" aria-hidden="true">☔</span>
              <span class="rain-text">
                {{ a.weatherSummary || "Rain expected on this day." }}
              </span>
            </div>
          </div>

          <div class="right">
            <small class="muted">ID: {{ a._id }}</small>
            <button
              v-if="canCancel(a)"
              class="btn cancel"
              type="button"
              :disabled="cancelingId === a._id"
              @click="cancelAppointment(a)"
            >
              {{ cancelingId === a._id ? "Cancelling..." : "Cancel" }}
            </button>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<style scoped>
.page {
  max-width: 900px;
  margin: 0 auto;
}

.page-header h2 {
  margin: 0 0 0.25rem;
  color: #111827;
}

.muted {
  color: #6b7280;
}

.panel {
  margin-top: 1rem;
  background: #fff;
  border-radius: 14px;
  padding: 1.25rem;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.06);
}

.top-row {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.7rem 1rem;
  border: none;
  border-radius: 10px;
  background: #2c3e50;
  color: white;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
}

.btn.primary {
  background: #1f6feb;
}

.btn.cancel {
  background: #c0392b;
}

.btn.cancel:hover {
  background: #a93226;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.msg {
  margin: 0.9rem 0;
  padding: 0.75rem;
  border-radius: 10px;
  font-size: 0.95rem;
}

.msg.error {
  background: #fdecec;
  color: #b42318;
  border: 1px solid #f6c1c1;
}

.empty {
  padding: 1rem 0;
  text-align: center;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.card {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #eef1f5;
  border-radius: 12px;
  background: #fafbfc;
  align-items: stretch; /* 🔥 importante */
}

.line {
  display: flex;
  gap: 0.5rem;
  margin: 0.2rem 0;
  align-items: center;
}

.label {
  font-weight: 700;
  color: #374151;
}

.value {
  color: #111827;
}

.badge {
  display: inline-flex;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  border: 1px solid #d1d5db;
  background: #fff;
  font-weight: 700;
}

.badge.pending {
  border-color: #f59e0b;
}

.badge.confirmed {
  border-color: #10b981;
}

.badge.canceled {
  border-color: #ef4444;
  opacity: 0.85;
}

.rain-alert {
  margin-top: 0.6rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 0.8rem;
  border-radius: 10px;
  background: #eef6ff;
  border: 1px solid #cfe2ff;
}

.umbrella {
  font-size: 1.2rem;
}

.rain-text {
  font-size: 0.9rem;
  color: #1f4ea3;
  font-weight: 600;
}

.right {
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* 🔥 empurra topo e fundo */
  align-items: flex-end;
  min-height: 100%;
}
</style>
