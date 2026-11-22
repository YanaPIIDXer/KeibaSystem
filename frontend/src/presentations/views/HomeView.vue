<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import type { RaceListResponse } from 'common/network/Scrape';
import LoadingSpinner from '../components/LoadingSpinner.vue';

const isLoading = ref(false);

const date = ref('');
const onSelectedDate = async () => {
  if (!date.value) { return; }
  const url = `http://localhost:3000/race/list/${date.value.replaceAll('-', '')}`;
  try {
    isLoading.value = true;
    const response = await axios.get<RaceListResponse>(url);
    console.log(response.data);
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
