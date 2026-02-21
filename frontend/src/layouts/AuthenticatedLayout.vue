<script setup lang="ts">
import AppHeader from "@/components/AppHeader.vue";
</script>

<template>
  <div class="layout">
    <AppHeader />

    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.layout {
  min-height: 100vh;
  background: linear-gradient(180deg, #eef4fb 0%, #f7f9fc 100%);
}

.content {
  padding: 2rem;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}
</style>
