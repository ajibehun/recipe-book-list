<template>
  <div class="recipe-card">
    <div class="card-image" @click="openRecipeDetail">
      <img
        v-if="recipe.image && recipe.image.length > 0"
        :src="recipe.image[0]"
        alt="recipe image"
      />
      <div v-else class="placeholder">No Image Available</div>
    </div>
    <div class="card-details">
      <h5 class="recipe-title">{{ recipe.name }}</h5>
      <p class="recipe-author">By: {{ cleanedAuthorName }}</p>
    </div>
    <i
      @click="toggleSave"
      :class="['fa-heart', isSaved ? 'fas' : 'far', 'save-icon']"
    ></i>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps } from "vue";
import { useRecipeStore } from "@/store/recipeStore";
import { useRouter } from "vue-router";

const props = defineProps<{ recipe: any }>();
const store = useRecipeStore();
const router = useRouter();

const isSaved = computed(() =>
//save recipe to store
  store.savedRecipes.some((r) => r.id === props.recipe.id)
);

const toggleSave = () => {
  //check save state
  if (isSaved.value) {
    store.removeRecipe(props.recipe);
  } else {
    store.saveRecipe(props.recipe);
  }
};

const cleanedAuthorName = computed(() => {
  let authorName = "";
  if (typeof props.recipe.author === "object" && props.recipe.author !== null) {
    authorName = props.recipe.author.name || "Unknown Author";
  } else {
    authorName = props.recipe.author || "Unknown Author";
  }
  authorName = authorName.split(/[^a-zA-Z\s]/)[0].trim();
  return authorName;
});

const openRecipeDetail = () => {
  router.push({ name: "RecipeDetail", params: { id: props.recipe.id } });
};
</script>

<style scoped>
.recipe-card {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #727D73;
  transition: transform 0.2s;
}

.recipe-card:hover {
  transform: scale(1.02);
}

.card-image img {
  cursor: pointer;
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.placeholder {
  width: 100%;
  height: 180px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f0f0;
  color: #888;
}

.card-details {
  padding: 0.5rem;
}

.recipe-title {
  font-size: 1rem;
  font-weight: bold;
  margin: 0;
  color: white;
}

.recipe-author {
  font-size: 0.85rem;
  color: #F0F0D7;
}

.save-icon {
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: 1.2rem;
  color: #dc3545;
  cursor: pointer;
}
</style>
