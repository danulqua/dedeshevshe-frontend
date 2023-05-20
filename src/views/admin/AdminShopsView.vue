<template>
  <h2 class="mb-4">Супермаркети</h2>

  <PDataTable :value="data">
    <PColumn field="id" header="ID" />
    <PColumn field="name" header="Назва" />
  </PDataTable>
</template>

<script setup lang="ts">
const data = [
  {
    id: 1,
    name: 'Shop 1'
  },
  {
    id: 2,
    name: 'Shop 2'
  }
];
</script>

<style scoped></style>
