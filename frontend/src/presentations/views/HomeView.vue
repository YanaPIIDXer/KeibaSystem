<script setup lang="ts">
import { ref } from 'vue';
import { useRaceList } from '../compositions/RaceLIst.ts';

import LoadingSpinner from '../components/LoadingSpinner.vue';

const isLoading = ref(false);
const raceList = useRaceList();
const { raceDatas } = raceList;

const date = ref('');
const loadedDate = ref('');
const onSelectedDate = async () => {
  if (!date.value || isLoading.value) { return; }
  const selectedDate = date.value;
  try {
    isLoading.value = true;
    await raceList.fetch(selectedDate);
    loadedDate.value = selectedDate;
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
    <h1>レース一覧</h1>
    <form class="dateSelect" @submit.prevent="onSelectedDate">
      <label for="raceDate">開催日</label>
      <input id="raceDate" v-model="date" type="date" :disabled="isLoading" />
      <button type="submit" :disabled="!date || isLoading">表示</button>
    </form>
    <LoadingSpinner :loading="isLoading" />
    <section v-if="loadedDate" class="raceList">
      <h2>{{ loadedDate }} のレース</h2>
      <p v-if="!raceDatas.length">この日のレースはありません。</p>
      <div class="tableWrap">
        <table v-for="{ place, races } in raceDatas" :key="place" class="raceTable">
          <caption>{{ place }}</caption>
          <thead>
            <tr>
              <th scope="col">R</th>
              <th scope="col">レース名</th>
              <th scope="col">馬場</th>
              <th scope="col">距離</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="race in races" :key="race.id">
              <th scope="row">{{ race.no }}</th>
              <td><RouterLink :to="`/race/${race.id}`">{{ race.name }}</RouterLink></td>
              <td>{{ race.course.ground }}</td>
              <td>{{ race.course.distance }} m</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<style lang="sass" scoped>
.homeView
  max-width: 52rem
  margin-inline: auto
  padding: 1rem

.dateSelect
  display: flex
  flex-wrap: wrap
  align-items: center
  gap: 0.5rem

.raceList
  margin-top: 1.5rem

.tableWrap
  display: flex
  gap: 48px

.raceTable
  width: 100%
  margin-bottom: 1.5rem
  border-collapse: collapse
  text-align: left

  caption
    padding-bottom: 0.5rem
    font-weight: 700
    text-align: left

  th,
  td
    padding: 0.5rem
    border-bottom: 1px solid #ccc

  th,
  td:nth-last-child(-n + 2)
    white-space: nowrap
</style>
