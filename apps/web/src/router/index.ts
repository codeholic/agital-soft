import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import ProductView from '../views/ProductView.vue';
import SearchView from '../views/SearchView.vue';

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomeView },
    { path: '/search', component: SearchView },
    { path: '/product/:id', component: ProductView, props: true },
  ],
});
