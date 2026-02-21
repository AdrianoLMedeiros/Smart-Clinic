<script setup lang="ts">
import bgUrl from "@/assets/login-bg.png";
</script>

<template>
  <div class="guest" :style="{ '--guest-bg': `url(${bgUrl})` }">
    <div class="overlay"></div>

    <div class="card">
      <header class="header">
        <h1>SmartClinic</h1>
        <p class="subtitle">Appointment Scheduling</p>
      </header>

      <section class="body">
        <router-view />
      </section>

      <footer class="footer">
        <small>© {{ new Date().getFullYear() }} SmartClinic</small>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.guest {
  min-height: 100vh;
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 1.5rem;
  position: relative;

  background-image: var(--guest-bg);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

/* overlay pra dar contraste */
.overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(2px);
}

.card {
  position: relative;
  z-index: 1;

  width: 100%;
  max-width: 420px;

  background: rgba(255, 255, 255, 0.92);
  border-radius: 14px;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.18);
  overflow: hidden;

  border: 1px solid rgba(255, 255, 255, 0.55);
}

.header {
  padding: 1.75rem 1.75rem 1rem;
  text-align: center;
  background: transparent;
}

.header h1 {
  margin: 0;
  font-size: 1.6rem;
}

.subtitle {
  margin: 0.35rem 0 0;
  color: #6b7280;
  font-size: 0.95rem;
}

.body {
  padding: 1.25rem 1.75rem 1.5rem;
}

.footer {
  padding: 0.9rem 1.75rem 1.2rem;
  text-align: center;
  color: #9aa3af;
  border-top: 1px solid rgba(255, 255, 255, 0.35);
}
</style>
