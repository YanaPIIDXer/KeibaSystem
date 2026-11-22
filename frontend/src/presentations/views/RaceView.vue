<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { type RaceDetailResponse } from 'common/network/Scrape';

import LoadingSpinner from '../components/LoadingSpinner.vue';

const route = useRoute();
const id = route.params.id as string;
const isLoading = ref(false);
onMounted(async () => {
  try {
    isLoading.value = true;
    const response = await axios.get<RaceDetailResponse>(`http://localhost:3000/race/${id}`);
    console.log(response.data);
  } catch (e) {
    console.error(e);
    alert('エラー');
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="raceView">
    <LoadingSpinner :loading="isLoading" />
  </div>
</template>

<style lang="sass" scoped>
</style>
