<template>
  <div class="container mt-5">
    <button @click="goBack" class="btn back-button"><i class="fas fa-arrow-left"></i></button>
    <h2 class="text-center mb-4">Add a New Recipe</h2>
    <form @submit.prevent="addRecipe" class="form-container">
      <div class="mb-3">
        <label for="name" class="form-label">Recipe Name</label>
        <input
          v-model="name"
          id="name"
          class="form-control form-control-lg"
          placeholder="Recipe Name"
          required
        />
      </div>
      <div class="mb-3">
        <label for="author" class="form-label">Author</label>
        <input
          v-model="author"
          id="author"
          class="form-control form-control-lg"
          placeholder="Author"
          required
        />
      </div>
      <div class="mb-3">
        <label for="description" class="form-label">Description</label>
        <textarea
          v-model="description"
          id="description"
          class="form-control form-control-lg"
          placeholder="Write a brief description"
          required
        ></textarea>
      </div>

      <!-- Image Upload Section -->
      <div class="mb-3">
        <label for="image" class="form-label">Recipe Image</label>
        <div class="image-upload-container">
          <input
            type="file"
            id="image"
            ref="imageInput"
            @change="handleImageUpload"
            accept="image/*"
            class="hidden-input"
            required
          />
          <div
            class="image-upload-area"
            @click="triggerImageUpload"
            @dragover.prevent
            @drop.prevent="handleImageDrop"
          >
            <template v-if="imagePreview">
              <img
                :src="imagePreview"
                alt="Recipe preview"
                class="image-preview"
              />
              <button
                type="button"
                class="remove-image-btn"
                @click.stop="removeImage"
              >
                ×
              </button>
            </template>
            <template v-else>
              <div class="upload-placeholder">
                <span>Click or drag image here</span>
              </div>
            </template>
          </div>
          <div v-if="imageError" class="error-message">
            {{ imageError }}
          </div>
        </div>
      </div>

      <div class="mb-3">
        <label for="ingredients" class="form-label"
          >Ingredients</label
        >
        <textarea
          v-model="ingredientsString"
          id="ingredients"
          class="form-control form-control-lg"
          placeholder="Use commas to separate the ingredient list"
          required
        ></textarea>
      </div>
      <div class="mb-3">
        <label for="instructions" class="form-label"
          >Instructions</label
        >
        <textarea
          v-model="instructions"
          id="instructions"
          class="form-control form-control-lg"
          placeholder="Use line breaks to separate the instruction"
          required
        ></textarea>
      </div>
      <button type="submit" class="btn btn-primary btn-block">
        Add Recipe
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRecipeStore } from "@/store/recipeStore";
import { useRouter } from "vue-router";

const store = useRecipeStore();
const router = useRouter();

const name = ref("");
const author = ref("");
const description = ref("");
const ingredientsString = ref("");
const instructions = ref("");
const imageFile = ref<File | null>(null);
const imagePreview = ref<string>("");
const imageError = ref("");
const imageInput = ref<HTMLInputElement | null>(null);

const goBack = () => {
  router.go(-1);
};

const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  processImage(file);
};

const handleImageDrop = (event: DragEvent) => {
  const file = event.dataTransfer?.files[0];
  processImage(file);
};

const processImage = (file: File | undefined) => {
  if (!file) return;

  // Validate image 
  if (!file.type.startsWith("image/")) {
    imageError.value = "Please upload an image file";
    return;
  }

  // size limit
  if (file.size > 5 * 1024 * 1024) {
    imageError.value = "Image size should be less than 5MB";
    return;
  }

  imageError.value = "";
  imageFile.value = file;

  const reader = new FileReader();
  reader.onload = (e) => {
    imagePreview.value = e.target?.result as string;
  };
  reader.readAsDataURL(file);
};

const removeImage = () => {
  imageFile.value = null;
  imagePreview.value = "";
  if (imageInput.value) {
    imageInput.value.value = "";
  }
};

const triggerImageUpload = () => {
  imageInput.value?.click();
};

const addRecipe = async () => {
  if (
    name.value &&
    author.value &&
    description.value &&
    ingredientsString.value &&
    instructions.value &&
    imageFile.value
  ) {
    const ingredientsArray = ingredientsString.value
      .split(",")
      .map((ingredient) => ingredient.trim())
      .filter((ingredient) => ingredient.length > 0);

    const newRecipe = {
      id: Date.now(),
      name: name.value,
      author: { name: author.value },
      description: description.value,
      image: [imagePreview.value],
      recipeIngredient: ingredientsArray,
      ingredients: ingredientsArray,
      recipeInstructions: instructions.value,
      instructions: instructions.value,
    };

    store.saveRecipe(newRecipe);

    name.value = "";
    author.value = "";
    description.value = "";
    ingredientsString.value = "";
    instructions.value = "";
    imageFile.value = null;
    imagePreview.value = "";

    router.push("/");
  } else {
    alert("Please fill in all fields including the image");
  }
};
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #727D73;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h2 {
  color: white;
  font-family: "Georgia", serif;
}

.form-container {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-weight: bold;
  color: white;
}

.form-control-lg {
  border: 2px solid #dee2e6;
  border-radius: 5px;
  font-size: 1.25rem;
  padding: 10px;
  margin-bottom: 15px;
}

.form-control-lg::placeholder {
  color: #adb5bd;
}

.btn-primary {
  background-color: #AAB99A;
  border: none;
  padding: 15px;
  font-size: 1.25rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-primary:hover {
  background-color: #D0DDD0;
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

.hidden-input {
  display: none;
}

.image-upload-container {
  width: 100%;
  margin-bottom: 15px;
}

.image-upload-area {
  width: 100%;
  height: 200px;
  border: 2px dashed #dee2e6;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;
  background-color: #fff;
  transition: border-color 0.3s ease;
}

.image-upload-area:hover {
  border-color: #647485;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #6c757d;
}

.upload-icon {
  font-size: 2rem;
  margin-bottom: 10px;
}

.image-preview {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.remove-image-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: rgba(255, 255, 255, 0.8);
  border: none;
  border-radius: 50%;
  width: 25px;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.2rem;
  color: #dc3545;
}

.error-message {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 5px;
}

@media (max-width: 768px) {
  .container {
    padding: 10px;
  }

  .form-control-lg {
    font-size: 1rem;
    padding: 8px;
  }

  .btn-primary {
    padding: 10px;
    font-size: 1rem;
  }

  .image-upload-area {
    height: 150px;
  }
}
</style>
