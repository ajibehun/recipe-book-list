<template>
  <div class="row">
    <RecipeCard
      v-for="recipe in recipes"
      :key="recipe.id"
      :recipe="recipe"
      class="col-md-4 mb-3"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRecipeStore } from "@/store/recipeStore";
import RecipeCard from "./RecipeCard.vue";

const store = useRecipeStore();

//fetch list on render
onMounted(() => {
  store.fetchRecipes();
});

const recipes = computed(() => store.filteredRecipes);
</script>
