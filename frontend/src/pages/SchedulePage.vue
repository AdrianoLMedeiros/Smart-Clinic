<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { getAvailable, createAppointment } from "@/services/appointments";

function todayISO() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function isWeekend(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  const day = d.getDay(); // 0 = domingo, 6 = sábado
  return day === 0 || day === 6;
}

const selectedDate = ref<string>(todayISO());
const availableTimes = ref<string[]>([]);
const selectedTime = ref<string>("");

const loadingTimes = ref(false);
const scheduling = ref(false);

const errorMessage = ref("");
const infoMessage = ref("");

const hasTimes = computed(() => availableTimes.value.length > 0);
const today = todayISO();

async function loadTimes() {
  if (isWeekend(selectedDate.value)) {
  errorMessage.value = "Appointments are not available on weekends.";
  availableTimes.value = [];
  return;
  }
  
  errorMessage.value = "";
  infoMessage.value = "";
  selectedTime.value = "";
  availableTimes.value = [];

  if (!selectedDate.value) {
    errorMessage.value = "Please select a date.";
    return;
  }

  try {
    loadingTimes.value = true;
    const times = await getAvailable(selectedDate.value);

    availableTimes.value = Array.isArray(times) ? times : [];

    if (availableTimes.value.length === 0) {
      infoMessage.value = "No available times for this date.";
    }
  } catch (e: any) {
    errorMessage.value = e?.message || "Could not load available times.";
  } finally {
    loadingTimes.value = false;
  }
}

async function handleSchedule() {
  errorMessage.value = "";
  infoMessage.value = "";

  if (!selectedDate.value) {
    errorMessage.value = "Please select a date.";
    return;
  }
  if (!selectedTime.value) {
    errorMessage.value = "Please select a time.";
    return;
    }

  if (isWeekend(selectedDate.value)) {
  errorMessage.value = "Appointments cannot be scheduled on weekends.";
  return;
    }

  try {
    scheduling.value = true;

    await createAppointment({
      date: selectedDate.value,
      time: selectedTime.value,
    });

    infoMessage.value = "Appointment scheduled successfully!";
    // Atualiza a lista de horários após agendar
    await loadTimes();
  } catch (e: any) {
    const status = e?.response?.status;

    if (status === 409) {
      errorMessage.value = "This time slot was just taken. Please choose another one.";
      await loadTimes();
      return;
    }

    if (status === 401) {
      errorMessage.value = "Your session expired. Please login again.";
      return;
    }

    errorMessage.value = e?.message || "Could not schedule appointment.";
  } finally {
    scheduling.value = false;
  }
}

onMounted(() => {
  loadTimes();
});
</script>

<template>
  <div class="page">
    <header class="page-header">
      <h2>Schedule Appointment</h2>
      <p class="muted">Pick a date, select an available time and confirm.</p>
    </header>

    <section class="panel">
      <div class="row">
        <div class="field">
          <label>Date</label>
          <input type="date" v-model="selectedDate" :min="today" :disabled="loadingTimes || scheduling" />
        </div>

        <button class="btn" type="button" @click="loadTimes" :disabled="loadingTimes || scheduling">
          {{ loadingTimes ? "Loading..." : "Check availability" }}
        </button>
      </div>

      <p v-if="errorMessage" class="msg error">{{ errorMessage }}</p>
      <p v-if="infoMessage" class="msg info">{{ infoMessage }}</p>

      <div class="times">
        <h3>Available times</h3>

        <div v-if="loadingTimes" class="muted">Fetching time slots...</div>

        <div v-else-if="!hasTimes" class="muted">
          No time slots to show.
        </div>

        <div v-else class="times-grid">
          <button
            v-for="t in availableTimes"
            :key="t"
            type="button"
            class="time-chip"
            :class="{ selected: selectedTime === t }"
            @click="selectedTime = t"
            :disabled="scheduling"
          >
            {{ t }}
          </button>
        </div>
      </div>

      <div class="actions">
        <button class="btn primary" type="button" @click="handleSchedule" :disabled="scheduling">
          {{ scheduling ? "Scheduling..." : "Confirm appointment" }}
        </button>
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

.row {
  display: flex;
  gap: 1rem;
  align-items: end;
  flex-wrap: wrap;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  min-width: 220px;
}

input[type="date"] {
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
  font-weight: 600;
  cursor: pointer;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn.primary {
  background: #1f6feb;
}

.msg {
  margin: 0.9rem 0 0;
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

.times {
  margin-top: 1.25rem;
}

.times h3 {
  margin: 0 0 0.75rem;
  color: #111827;
}

.times-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.time-chip {
  padding: 0.55rem 0.8rem;
  border-radius: 999px;
  border: 1px solid #d1d5db;
  background: #fff;
  cursor: pointer;
  font-weight: 600;
}

.time-chip.selected {
  border-color: #1f6feb;
  box-shadow: 0 0 0 3px rgba(31, 111, 235, 0.15);
}

.actions {
  margin-top: 1.25rem;
  display: flex;
  justify-content: flex-end;
}
</style>