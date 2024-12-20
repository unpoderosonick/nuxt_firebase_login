<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold">Bienvenido a Home</h1>
    <p>Contenido solo para usuarios autenticados.</p>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' });
</script>
