<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import type { AdminAppointment, AppointmentStatus } from "@/services/admin";
import { listAllAppointments, updateAppointmentStatus } from "@/services/admin";

const loading = ref(false);
const actionLoadingId = ref<string | null>(null);
const errorMessage = ref("");
const infoMessage = ref("");

const items = ref<AdminAppointment[]>([]);

// filtros simples (funcional primeiro)
const filterDate = ref<string>("");
const filterStatus = ref<AppointmentStatus | "ALL">("ALL");

const hasItems = computed(() => items.value.length > 0);

function formatISODate(dateStr: string) {
  if (!dateStr || !dateStr.includes("-")) return dateStr;
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
}

async function load() {
  errorMessage.value = "";
  infoMessage.value = "";

  try {
    loading.value = true;

    const data = await listAllAppointments({
      date: filterDate.value || undefined,
      status: filterStatus.value === "ALL" ? undefined : filterStatus.value,
    });

    items.value = data;

    if (items.value.length === 0) {
      infoMessage.value = "No appointments found for the current filters.";
    }
  } catch (e: any) {
    const status = e?.response?.status;
    if (status === 401)
      errorMessage.value = "Unauthorized. Please login again.";
    else if (status === 403)
      errorMessage.value =
        "Forbidden. You don't have permission to access admin data.";
    else errorMessage.value = e?.message || "Could not load appointments.";
  } finally {
    loading.value = false;
  }
}

async function setStatus(a: AdminAppointment, status: AppointmentStatus) {
  errorMessage.value = "";
  infoMessage.value = "";

  try {
    actionLoadingId.value = a._id;
    await updateAppointmentStatus(a._id, status);

    // refresh simples (garante consistência)
    await load();
  } catch (e: any) {
    const http = e?.response?.status;
    if (http === 401) errorMessage.value = "Unauthorized. Please login again.";
    else if (http === 403)
      errorMessage.value =
        "Forbidden. You don't have permission to update appointments.";
    else if (http === 404)
      errorMessage.value = "Endpoint not found (check backend route).";
    else
      errorMessage.value = e?.message || "Could not update appointment status.";
  } finally {
    actionLoadingId.value = null;
  }
}

function canConfirm(a: AdminAppointment) {
  return a.status === "PENDING";
}
function canCancel(a: AdminAppointment) {
  return a.status !== "CANCELED";
}

onMounted(load);
</script>

<template>
  <div class="page">
    <header class="page-header">
      <h2>Admin · Appointments</h2>
      <p class="muted">Manage all appointments: confirm or cancel.</p>
    </header>

    <section class="panel">
      <div class="filters">
        <div class="field">
          <label>Date</label>
          <input type="date" v-model="filterDate" :disabled="loading" />
        </div>

        <div class="field">
          <label>Status</label>
          <select v-model="filterStatus" :disabled="loading">
            <option value="ALL">ALL</option>
            <option value="PENDING">PENDING</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="CANCELED">CANCELED</option>
          </select>
        </div>

        <button class="btn" type="button" @click="load" :disabled="loading">
          {{ loading ? "Loading..." : "Apply filters" }}
        </button>
      </div>

      <p v-if="errorMessage" class="msg error">{{ errorMessage }}</p>
      <p v-if="infoMessage" class="msg info">{{ infoMessage }}</p>

      <div v-if="loading" class="muted">Loading appointments...</div>

      <div v-else-if="!hasItems" class="empty">
        <p>No appointments to show.</p>
      </div>

      <div v-else class="table">
        <div class="thead">
          <div>Date</div>
          <div>Time</div>
          <div>Status</div>
          <div>Patient</div>
          <div class="actions-col">Actions</div>
        </div>

        <div v-for="a in items" :key="a._id" class="row">
          <div>{{ formatISODate(a.date) }}</div>
          <div>{{ a.time }}</div>

          <div>
            <span class="badge" :class="a.status.toLowerCase()">{{
              a.status
            }}</span>
          </div>

          <div class="patient">
            <div class="patient-name">{{ a.patientId?.name || "—" }}</div>
            <div class="patient-email muted">
              {{ a.patientId?.email || "" }}
            </div>
          </div>

          <div class="actions-col">
            <button
              class="btn small primary"
              type="button"
              @click="setStatus(a, 'CONFIRMED')"
              :disabled="actionLoadingId === a._id || !canConfirm(a)"
              title="Confirm appointment"
            >
              {{ actionLoadingId === a._id ? "..." : "Confirm" }}
            </button>

            <button
              class="btn small danger"
              type="button"
              @click="setStatus(a, 'CANCELED')"
              :disabled="actionLoadingId === a._id || !canCancel(a)"
              title="Cancel appointment"
            >
              {{ actionLoadingId === a._id ? "..." : "Cancel" }}
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.page {
  max-width: 1100px;
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

.filters {
  display: flex;
  gap: 1rem;
  align-items: end;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  min-width: 220px;
}

input[type="date"],
select {
  padding: 0.6rem;
  border-radius: 10px;
  border: 1px solid #d1d5db;
}

.btn {
  padding: 0.7rem 1rem;
  border: none;
  border-radius: 10px;
  background: #2c3e50;
  color: white;
  font-weight: 700;
  cursor: pointer;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn.primary {
  background: #1f6feb;
}
.btn.danger {
  background: #c0392b;
}

.btn.small {
  padding: 0.5rem 0.75rem;
  border-radius: 10px;
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

.msg.info {
  background: #eef6ff;
  color: #1f4ea3;
  border: 1px solid #cfe2ff;
}

.table {
  border: 1px solid #eef1f5;
  border-radius: 12px;
  overflow: hidden;
}

.thead,
.row {
  display: grid;
  grid-template-columns: 140px 90px 140px 1fr 210px;
  gap: 0.75rem;
  align-items: center;
  padding: 0.75rem 1rem;
}

.thead {
  background: #f9fafb;
  font-weight: 800;
  color: #374151;
}

.row {
  border-top: 1px solid #eef1f5;
  background: #fff;
}

.actions-col {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  align-items: center;
}

.badge {
  display: inline-flex;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  border: 1px solid #d1d5db;
  background: #fff;
  font-weight: 800;
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

.patient-name {
  font-weight: 800;
  color: #111827;
}

.patient-email {
  font-size: 0.9rem;
}

.empty {
  text-align: center;
  padding: 1rem 0;
}
</style>
