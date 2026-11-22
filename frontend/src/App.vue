<script setup lang="ts">
import { ref } from 'vue';
import type { HorseDataResponse } from 'common/network/Scrape';
import axios from 'axios';
import LoadingSpinner from './presentations/components/LoadingSpinner.vue';

const horseId = ref('');
const isLoading = ref(false);

const send = async () => {
  if (!horseId.value || isLoading.value) { return; }

  isLoading.value = true;
  try {
    const response = await axios.get<HorseDataResponse>('http://localhost:3000/horse/' + horseId.value);
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
      <input type="text" v-model="horseId" placeholder="馬ID" />
      <input type="submit" value="送信" :disabled="!horseId" />
    </form>
  </div>
  <LoadingSpinner :loading="isLoading" />
</template>

<style lang="sass" scoped>
</style>
