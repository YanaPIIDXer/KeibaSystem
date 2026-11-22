<script setup lang="ts">
defineProps<{ loading: boolean }>();
</script>

<template>
  <Teleport to="body">
    <div v-if="loading" class="loadingSpinner" role="status">
      <span class="spinnerRing" aria-hidden="true"></span>
      <span class="loadingLabel">読み込み中</span>
    </div>
  </Teleport>
</template>

<style scoped>
.loadingSpinner {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-content: center;
  justify-items: center;
  gap: 0.75rem;
  background: rgb(0 0 0 / 55%);
  color: white;
  cursor: wait;
}

.spinnerRing {
  width: 2.5rem;
  height: 2.5rem;
  border: 0.25rem solid rgb(255 255 255 / 35%);
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.loadingLabel {
  font-weight: 600;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .spinnerRing {
    animation: none;
  }
}
</style>
