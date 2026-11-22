import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('./presentations/views/HomeView.vue'),
    },
    {
      path: '/race/:id',
      name: 'race',
      component: () => import('./presentations/views/RaceView.vue'),
    },
    {
      path: '/horse/:id',
      name: 'horse',
      component: () => import('./presentations/views/HorseView.vue'),
    },
  ],
});

export default router;
