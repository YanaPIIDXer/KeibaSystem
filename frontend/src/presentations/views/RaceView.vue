<script lang="ts" setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const id = route.params.id as string;
</script>

<template>
  <div class="raceView">
  </div>
</template>

<style lang="sass" scoped>
</style>
