<script setup lang="ts">
import { ref } from 'vue';
import { useRaceList } from '../compositions/RaceLIst.ts';

import LoadingSpinner from '../components/LoadingSpinner.vue';

const isLoading = ref(false);
const raceList = useRaceList();

const date = ref('');
const onSelectedDate = async () => {
  if (!date.value) { return; }
  try {
    isLoading.value = true;
    await raceList.fetch(date.value);
  } catch (e) {
    console.error(e);
    alert('エラー');
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="homeView">
    <div class="dateSelect">
      <input type="date" v-model="date" />
      <button @click="onSelectedDate">OK</button>
    </div>
    <LoadingSpinner :loading="isLoading" />
  </div>
</template>

<style lang="sass" scoped>
</style>
