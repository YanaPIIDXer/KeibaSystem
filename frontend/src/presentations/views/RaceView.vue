<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import type { RaceDetailResponse } from 'common/network/Scrape';
import type { RaceDetail } from 'common/entity/RaceData';

import LoadingSpinner from '../components/LoadingSpinner.vue';

const route = useRoute();
const id = route.params.id as string;
const isLoading = ref(false);
const raceData = ref<RaceDetail | null>(null);
onMounted(async () => {
  try {
    isLoading.value = true;
    const response = await axios.get<RaceDetailResponse>(`http://localhost:3000/race/${id}`);
    raceData.value = response.data.detail;
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
    <template v-if="raceData">
      <h1>{{ raceData.name }}</h1>
      <dl class="raceCourse">
        <div>
          <dt>開催場</dt>
          <dd>{{ raceData.course.place }}</dd>
        </div>
        <div>
          <dt>馬場</dt>
          <dd>{{ raceData.course.ground }}</dd>
        </div>
        <div>
          <dt>距離</dt>
          <dd>{{ raceData.course.distance }} m</dd>
        </div>
      </dl>
      <h2 id="raceEntries">出馬表</h2>
      <p v-if="!raceData.horses.length">出走馬情報はありません。</p>
      <div v-else class="tableWrap">
        <table class="entryTable" aria-labelledby="raceEntries">
          <thead>
            <tr>
              <th scope="col">馬番</th>
              <th scope="col">馬名</th>
              <th scope="col">騎手</th>
              <th scope="col" class="odds">単勝オッズ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="horse in raceData.horses" :key="horse.id || horse.no">
              <td>{{ horse.no > 0 ? horse.no : '—' }}</td>
              <th scope="row">{{ horse.name }}</th>
              <td>{{ horse.jockey || '—' }}</td>
              <td class="odds">{{ horse.odds > 0 ? horse.odds.toFixed(1) : '—' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </div>
</template>

<style lang="sass" scoped>
.raceView
  max-width: 52rem
  margin-inline: auto
  padding: 1rem

.raceCourse
  display: flex
  flex-wrap: wrap
  gap: 0.75rem 1.5rem
  margin-bottom: 1.5rem

  dt
    font-weight: 700

  dd
    margin-inline-start: 0

.tableWrap
  overflow-x: auto

.entryTable
  width: 100%
  border-collapse: collapse
  text-align: left
  white-space: nowrap

  th,
  td
    padding: 0.5rem
    border-bottom: 1px solid #ccc

.odds
  text-align: right
  font-variant-numeric: tabular-nums
</style>
