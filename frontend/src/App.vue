<script setup lang="ts">
import { ref } from 'vue';
import type { HorseDataResponse } from 'common/network/Scrape';
import axios from 'axios';

const horseId = ref('');

const send = async () => {
  if (!horseId.value) { return; }

  try {
    const response = await axios.get<HorseDataResponse>('http://localhost:3000/horse/' + horseId.value);
    console.log(response.data);
  } catch (error) {
    console.error(error);
    alert('エラー');
  }
};
</script>

<template>
  <div class="app">
    <form @submit="(e) => { e.preventDefault(); send(); }">
      <input type="text" v-model="horseId" placeholder="馬ID" />
      <input type="submit" value="送信" :disabled="!horseId" />
    </form>
  </div>
</template>

<style lang="sass" scoped>
</style>
