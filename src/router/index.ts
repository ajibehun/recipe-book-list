import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import RecipeDetail from '@/views/RecipeDetail.vue';
import RecipeForm from '@/components/RecipeForm.vue';

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/recipe/:id', name: 'RecipeDetail', component: RecipeDetail, props: true },
  { path: '/add-recipe', name: 'AddRecipe', component: RecipeForm }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
