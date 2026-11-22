<script setup lang="ts">
import { ref } from 'vue';
import LoadingSpinner from './presentations/components/LoadingSpinner.vue';

const isLoading = ref(false);
</script>

<template>
  <div class="app">
    <LoadingSpinner :loading="isLoading" />
  </div>
</template>

<style lang="sass" scoped>
</style>
