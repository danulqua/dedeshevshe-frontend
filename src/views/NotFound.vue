<template>
  <div
    class="flex flex-column gap-3 align-items-center justify-content-center h-screen text-center"
  >
    <h2>Помилка 404.<br />Такої сторінки не існує.</h2>
    <RouterLink :to="{ name: 'home' }">
      <PButton label="На головну" icon="pi pi-home" />
    </RouterLink>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
