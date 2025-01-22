<template>
  <div class="container recipe-detail mt-5">
    <button @click="goBack" class="btn back-button"><i class="fas fa-arrow-left"></i></button>
    <div v-if="recipe" class="recipe-header"><h1 class="recipe-title">{{ recipe.name }}</h1></div>
    <div v-if="recipe" class="recipe-container">
      
      <div class="image-container">
        <img
          v-if="recipe.image && recipe.image.length > 0"
          :src="recipe.image[0]"
          alt="Recipe Image"
          class="recipe-image"
        />
      </div>

      
      <div class="bottom-section">
        <div class="left-panel">
          <div class="description">
            <span>{{ recipe.description }}</span>
          </div>

          <h3>Ingredients</h3>
          <ul class="ingredient-list">
            <li v-for="ingredient in recipeIngredients" :key="ingredient">
              • {{ ingredient }}
            </li>
          </ul>
        </div>

        <div class="right-panel">
          <h3>Instructions</h3>
          <ul class="instruction-list">
            <li
              v-for="(instruction, index) in formattedInstructions"
              :key="index"
            >
              <span class="step-number">Step {{ index + 1 }}:</span>
              {{ instruction }}
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div v-else>
      <p>Recipe not found</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useRecipeStore } from "@/store/recipeStore";

const route = useRoute();
const store = useRecipeStore();

const recipeId = computed(() => Number(route.params.id));

// Search recipe in regular and saved recipes
const recipe = computed(() => {
  const fromRegular = store.recipes.find((r) => r.id === recipeId.value);
  const fromSaved = store.savedRecipes.find((r) => r.id === recipeId.value);
  return fromRegular || fromSaved;
});

// Handle ingredients from both side
const recipeIngredients = computed(() => {
  if (!recipe.value) return [];
  return recipe.value.recipeIngredient || recipe.value.ingredients || [];
});

// Format instructions
const formattedInstructions = computed(() => {
  if (!recipe.value) return [];
  if (typeof recipe.value.instructions === "string") {
    return recipe.value.instructions
      .split("\n")
      .filter((instruction) => instruction.trim());
  }
  return [];
});

const cleanedAuthorName = computed(() => {
  if (!recipe.value) return "Unknown Author";

  let authorName = "";
  if (typeof recipe.value.author === "object" && recipe.value.author !== null) {
    authorName = recipe.value.author.name || "Unknown Author";
  } else {
    authorName = recipe.value.author || "Unknown Author";
  }
  return authorName.split(/[^a-zA-Z\s]/)[0].trim();
});

onMounted(async () => {
  if (store.recipes.length === 0) {
    await store.fetchRecipes();
  }
});

const goBack = () => {
  window.history.back();
};
</script>

<style scoped>
.container {
  max-width: 900px;
  margin: auto;
  padding: 20px;
}

.recipe-header{
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  margin-bottom: 10px;
}

.recipe-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
}

/* Top Section */
.image-container {
  width: 100%;
  display: flex;
  justify-content: center;
}

.recipe-image {
  width: 100%;
  height: 50vh;
  max-width: 700px;
  border-radius: 8px 8px 0 0;
  object-fit: cover;
}

/* Bottom Section */
.bottom-section {
  display: flex;
  width: 100%;
  max-width: 700px;
  min-height: 400px;
}

.left-panel {
  background-color: #727D73;
  padding: 30px;
  border-radius: 0 0 0 8px;
  width: 50%;
}

.right-panel {
  width: 50%;
  padding: 30px;
  background-color: #AAB99A;
  border-radius: 0 0 8px 0;
}

.recipe-title {
  font-family: "Georgia", serif;
  font-size: 2em;
  font-weight: bold;
  margin-bottom: 20px;
  color: #2c3e50;
  text-align: left;
}

.description {
  font-size: 1em;
  line-height: 1.6;
  color: #ffffff;
  margin-bottom: 30px;
}

h3 {
  font-size: 1.4em;
  font-weight: bold;
  color: #ffffff;
  text-align: left;
}

.ingredient-list,
.instruction-list {
  padding-left: 0;
  list-style-type: none;
  color: #ffffff;
}

.ingredient-list li {
  padding: 8px 0;
  font-size: 1em;
  line-height: 1.4;
  color: #ffffff;
}

.instruction-list li {
  padding: 12px 0;
  font-size: 1em;
  line-height: 1.6;
  border-bottom: 1px solid #b6b4b4;
}

.instruction-list li:last-child {
  border-bottom: none;
}

.step-number {
  font-weight: bold;
  color: #ebebeb;
  margin-right: 8px;
}

.back-button {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1000;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  color: #727D73;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 20px;
}

.back-button:hover {
  background-color: #727D73;
  color: white;
}

@media (max-width: 768px) {
  .bottom-section {
    flex-direction: column;
  }

  .left-panel,
  .right-panel {
    width: 100%;
    border-radius: 0;
  }

  .recipe-title {
    font-size: 1.5em;
  }

  .description {
    font-size: 0.9em;
  }

  h3 {
    font-size: 1.2em;
  }

  .ingredient-list li,
  .instruction-list li {
    font-size: 0.9em;
  }

  .recipe-image {
    height: 30vh;
  }

  .container {
    padding: 10px;
  }

  .back-button {
    padding: 8px 16px;
    font-size: 0.9em;
  }
}
</style>
