<template>
  <div class="main-container d-flex">
    <!-- Search Header -->
    <div class="fixed-search-header" :class="{ show: showSearchHeader }">
      <div class="search-header-content">
        <div class="search-input-container">
          <i class="fas fa-search search-icon"></i>
          <input
            type="text"
            placeholder="Search recipes..."
            v-model="searchQuery"
            @input="handleSearch"
            class="search-input"
          />
          <i class="fas fa-times close-icon" @click="closeSearchHeader"></i>
        </div>
      </div>
    </div>

    <!-- Sidebar -->
    <div class="sidebar p-4">
      <h2 class="mt-4">My Recipes</h2>
      <ul class="list-group">
        <li
          v-for="recipe in savedRecipes"
          :key="recipe.id"
          class="list-group-item d-flex justify-content-between align-items-center"
        >
          <router-link
            :to="{ name: 'RecipeDetail', params: { id: recipe.id } }"
            >{{ recipe.name }}</router-link
          >
          <i
            class="fas fa-trash-alt text-danger"
            @click="toggleSave(recipe)"
          ></i>
        </li>
      </ul>
    </div>

    <div class="content-container" ref="contentContainer">
      <SearchBar
        v-if="!showSearchHeader"
        v-model="searchQuery"
        @search="handleSearch"
      />

      <!-- btm search icon -->
      <div
        class="floating-search"
        :class="{ show: showFloatingSearch }"
        @click="showSearchBar"
      >
        <div class="search-icon-container">
          <i class="fas fa-search"></i>
        </div>
      </div>

      <div class="mobile-responsive">
        <h2>Saved Recipes</h2>
        <ul class="list-group">
          <li
            v-for="recipe in savedRecipes"
            :key="recipe.id"
            class="list-group-item d-flex justify-content-between align-items-center"
          >
            <router-link
              :to="{ name: 'RecipeDetail', params: { id: recipe.id } }"
              >{{ recipe.name }}</router-link
            >
            <i
              class="fas fa-trash-alt text-danger"
              @click="toggleSave(recipe)"
            ></i>
          </li>
        </ul>
      </div>

      <!-- Public Recipes-->
      <div class="d-flex justify-content-between align-items-center mt-4">
        <div class="flex-grow-1">
          <h2>Public Recipes</h2>
        </div>
        <router-link to="/add-recipe">
          <button class="btn"><i class="fas fa-add"></i> Add Recipe</button>
        </router-link>
      </div>

      <!-- Recipe cards -->
      <div class="recipe-grid">
        <RecipeCard
          v-for="recipe in allPublicRecipes"
          :key="recipe.id"
          :recipe="recipe"
          class="recipe-card col-md-4 mb-3"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, onUnmounted, watch } from "vue";
import SearchBar from "@/components/SearchBar.vue";
import RecipeCard from "@/components/RecipeCard.vue";
import { useRecipeStore } from "@/store/recipeStore";

interface Recipe {
  id: number;
  name: string;
  author?: { name: string } | string;
  image: string[];
  ingredients: string[];
  instructions: string;
}

const store = useRecipeStore();
const contentContainer = ref<HTMLElement | null>(null);
const showFloatingSearch = ref(false);
const showSearchHeader = ref(false);
const searchQuery = ref("");

// card height when scroll
const calculateScrollThreshold = () => {
  const cardHeight = 300;
  const gap = 10;
  return (cardHeight + gap) * 2;
};

// scroll event
const handleScroll = () => {
  if (!contentContainer.value) return;

  const scrollTop = contentContainer.value.scrollTop;
  const threshold = calculateScrollThreshold();

  showFloatingSearch.value = scrollTop > threshold && !showSearchHeader.value;
};

// floating icon 
const showSearchBar = () => {
  showSearchHeader.value = true;
  showFloatingSearch.value = false;
  setTimeout(() => {
    const searchInput = document.querySelector(
      ".search-input"
    ) as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
    }
  }, 100);
};

const closeSearchHeader = () => {
  showSearchHeader.value = false;
};

const handleSearch = () => {
  store.filterRecipes(searchQuery.value);
};

//Watch for search query changes with debouncing
let debounceTimeout: NodeJS.Timeout;
watch(searchQuery, (newQuery) => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    handleSearch();
  }, 300);
});

onMounted(() => {
  store.fetchRecipes().then(() => {
    console.log("Recipes in store:", store.recipes);
  });

  contentContainer.value?.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  contentContainer.value?.removeEventListener("scroll", handleScroll);
  clearTimeout(debounceTimeout);
});

const allPublicRecipes = computed(() => store.filteredRecipes);
const savedRecipes = computed(() => store.savedRecipes);

const toggleSave = (recipe: Recipe) => {
  if (store.savedRecipes.some((r) => r.id === recipe.id)) {
    store.removeRecipe(recipe);
  } else {
    store.saveRecipe(recipe);
  }
};
</script>

<style scoped>
.main-container {
  display: flex;
  min-width: 100%;
  min-height: 100vh;
  background-color: #f9f9f9;
}

.fixed-search-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: white;
  padding: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transform: translateY(-100%);
  transition: transform 0.3s ease;
  z-index: 1001;
}

.fixed-search-header.show {
  transform: translateY(0);
}

.search-header-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
}

.search-input-container {
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  margin: 0.5rem 0;
}

.search-input {
  flex: 1;
  border: none;
  background: none;
  padding: 0 1rem;
  font-size: 1.1rem;
  outline: none;
}

.search-icon {
  color: #666;
  font-size: 1.1rem;
}

.close-icon {
  color: #666;
  cursor: pointer;
  padding: 0.5rem;
  font-size: 1.1rem;
  transition: color 0.2s ease;
}

.close-icon:hover {
  color: #333;
}

.sidebar-logo {
  max-width: 150px;
  height: auto;
  display: block;
}


.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 250px;
  height: 100vh;
  background-color: #727D73;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  border-right: 1px solid #ddd;
  overflow-y: auto;
  z-index: 1000;
}

.sidebar h2 {
  font-size: 1.5rem;
  color: #ffffff;
  margin-bottom: 1rem;
}

.list-group-item {
  transition: transform 0.2s ease;
}

.list-group-item:hover {
  background-color: #eef1f4;
}

.fa-trash-alt {
  cursor: pointer;
}


.content-container {
  flex-grow: 1;
  padding: 2rem 25vh 0 25vh;
  margin-left: 250px;
  height: 100vh;
  overflow-y: auto;
}

.content-container h2 {
  font-size: 2rem;
  font-weight: 600;
}

.btn-primary,
.btn-success {
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.2);
}

.pagination-text {
  padding: 0.5rem;
  font-size: 1.1rem;
  font-weight: bold;
  color: #333;
}


.recipe-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin-top: 2rem;
}

.recipe-card {
  flex: 1 1 calc(25% - 10px);
  max-width: 300px;
  display: block;
}


.floating-search {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  opacity: 0;
  visibility: hidden;
  transform: translateY(20px);
  transition: all 0.3s ease;
  z-index: 1000;
  cursor: pointer;
}

.floating-search.show {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.search-icon-container {
  width: 50px;
  height: 50px;
  background-color: #727D73;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease;
}

.search-icon-container:hover {
  transform: scale(1.1);
  background-color: #AAB99A;
}

.search-icon-container i {
  color: white;
  font-size: 1.5rem;
}

.mobile-responsive {
  display: none;
  margin-bottom: 1rem;
}


@media (max-width: 1200px) {
  .recipe-card {
    flex: 1 1 calc(50% - 10px);
  }

  .content-container {
    padding: 2rem;
  }
}


@media (max-width: 760px) {
  .sidebar {
    display: none;
  }

  .mobile-responsive {
    display: block;
  }

  .content-container {
    margin-left: 0;
    padding: 1rem;
  }

  .recipe-grid {
    flex-direction: column;
  }

  .recipe-card {
    flex: 1 1 100%;
    max-width: none;
  }

  .floating-search {
    bottom: 1rem;
    right: 1rem;
  }

  .search-icon-container {
    width: 45px;
    height: 45px;
  }

  .fixed-search-header {
    padding: 0.5rem;
  }

  .search-header-content {
    padding: 0 0.5rem;
  }

  .search-input-container {
    padding: 0.5rem;
  }

  .saved-recipes-mobile .logo-container {
    margin-bottom: 1.5rem;
  }

}
</style>
