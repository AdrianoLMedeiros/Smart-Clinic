<script setup lang="ts">
</script>

<template>
  <div class="guest">
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
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f4f6f9;
  padding: 1.5rem;
}

.card {
  width: 100%;
  max-width: 420px;
  background: white;
  border-radius: 14px;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.header {
  padding: 1.75rem 1.75rem 1rem;
  text-align: center;
  background: #ffffff;
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
  border-top: 1px solid #eef1f5;
}
</style>