<script setup lang="ts">
import { ref } from 'vue';
import type { HorseDataResponse, RaceListResponse } from 'common/network/Scrape';
import axios from 'axios';
import LoadingSpinner from './presentations/components/LoadingSpinner.vue';

const value = ref('');
const isLoading = ref(false);

const send = async () => {
  if (!value.value || isLoading.value) { return; }

  isLoading.value = true;
  try {
    const response = await axios.get<RaceListResponse>('http://localhost:3000/race/list/' + value.value);
    console.log(response.data);
  } catch (error) {
    console.error(error);
    alert('エラー');
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="app">
    <form :inert="isLoading" @submit.prevent="send">
      <input type="text" v-model="value" placeholder="value" />
      <input type="submit" value="送信" :disabled="!value" />
    </form>
  </div>
  <LoadingSpinner :loading="isLoading" />
</template>

<style lang="sass" scoped>
</style>
