<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { type HorseDataResponse } from 'common/network/Scrape';
import { type HorseData } from 'common/entity/HorseData';
import LoadingSpinner from '../components/LoadingSpinner.vue';

const route = useRoute();
const id = route.params.id as string;
const isLoading = ref(false);
const data = ref<HorseData | null>(null);

onMounted(async () => {
  try {
    isLoading.value = true;
    const response = await axios.get<HorseDataResponse>(`http://localhost:3000/horse/${id}`);
    data.value = response.data.data;
  } catch (e) {
    console.error(e);
    alert('エラー');
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="horseView">
    <div v-if="data">
      <h1>{{ data.name }}</h1>
      <table>
        <tbody>
          <tr v-for="(race, index) in data.results" :key="index">
            <td>{{ race.name }}</td>
            <td>{{ race.course.place }}</td>
            <td>{{ race.course.ground }}</td>
            <td>{{ race.course.distance }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <LoadingSpinner :loading="isLoading" />
  </div>
</template>

<style lang="sass" scoped>
</style>
