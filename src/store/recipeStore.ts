import { defineStore } from "pinia";
import axios from "axios";

interface Recipe {
  id: number;
  name: string;
  author: { name: string } | string;
  description: string;
  image: string[];
  recipeIngredient?: string[];
  ingredients?: string[];
  recipeInstructions?: string | string[];
  instructions: string;
}

//return initial state 
export const useRecipeStore = defineStore("recipeStore", {
  state: () => ({
    recipes: [] as Recipe[],
    savedRecipes: JSON.parse(
      localStorage.getItem("savedRecipes") || "[]"
    ) as Recipe[],
    filteredRecipes: [] as Recipe[],
    currentPage: 1,
    itemsPerPage: 9,
  }),

  //define app logic
  actions: {
    async fetchRecipes() {
      try {
        const response = await axios.get(
          "https://raw.githubusercontent.com/micahcochran/json-cookbook/refs/heads/main/cookbook-100.json"
        );
        this.recipes = response.data.map((recipe: any, index: number) => ({
          id: index + 1,
          name: recipe.name,
          author: recipe.author,
          description: recipe.description,
          image:
            recipe.image && recipe.image[0]?.length >= 5
              ? recipe.image
              : [
                  "https://via.placeholder.com/300x200?text=Image+Not+Available",
                ],
          recipeIngredient: recipe.recipeIngredient || [],
          ingredients: recipe.recipeIngredient || [],
          recipeInstructions: recipe.recipeInstructions,
          instructions: this.formatInstructions(recipe.recipeInstructions),
        }));
        this.filteredRecipes = this.recipes;
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    },

    formatInstructions(instructions: any): string {
      if (Array.isArray(instructions)) {
        if (
          instructions.every(
            (step: any) => typeof step === "object" && step.text
          )
        ) {
          return instructions.map((step: any) => step.text).join("\n");
        }
        if (instructions.every((step: any) => typeof step === "string")) {
          return instructions.join("\n");
        }
      }
      if (typeof instructions === "string") {
        return instructions;
      }
      return "Instructions not available";
    },

    saveRecipe(recipe: Recipe) {
      const formattedRecipe: Recipe = {
        ...recipe,
        ingredients: recipe.recipeIngredient || recipe.ingredients || [],
        recipeIngredient: recipe.recipeIngredient || recipe.ingredients || [],
        instructions:
          recipe.instructions ||
          this.formatInstructions(recipe.recipeInstructions),
        author:
          typeof recipe.author === "string"
            ? { name: recipe.author }
            : recipe.author,
      };

      this.savedRecipes.push(formattedRecipe);
      //store recipe to local storage
      localStorage.setItem("savedRecipes", JSON.stringify(this.savedRecipes));
    },

    removeRecipe(recipe: Recipe) {
      this.savedRecipes = this.savedRecipes.filter(
        (r: Recipe) => r.id !== recipe.id
      );
      localStorage.setItem("savedRecipes", JSON.stringify(this.savedRecipes));
    },

    addRecipe(recipe: Recipe) {
      this.recipes.push(recipe);
      this.filteredRecipes = this.recipes;
    },

    filterRecipes(query: string) {
      const cleanedQuery = query.toLowerCase();
      this.filteredRecipes = this.recipes.filter((recipe) => {
        let authorName = "";
        if (typeof recipe.author === "object" && recipe.author !== null) {
          authorName = recipe.author.name || "Unknown Author";
        } else {
          authorName = recipe.author || "Unknown Author";
        }
        authorName = authorName
          .split(/[^a-zA-Z\s]/)[0]
          .trim()
          .toLowerCase();

        return (
          recipe.name.toLowerCase().includes(cleanedQuery) ||
          authorName.includes(cleanedQuery)
        );
      });
      this.currentPage = 1;
    },

    nextPage() {
      if (this.currentPage * this.itemsPerPage < this.filteredRecipes.length) {
        this.currentPage++;
      }
    },

    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
  },

  //computed values of the app
  getters: {
    paginatedRecipes: (state) => {
      const start = (state.currentPage - 1) * state.itemsPerPage;
      const end = start + state.itemsPerPage;
      return state.filteredRecipes.slice(start, end);
    },

    totalPages: (state) => {
      return Math.ceil(state.filteredRecipes.length / state.itemsPerPage);
    },
  },
});
