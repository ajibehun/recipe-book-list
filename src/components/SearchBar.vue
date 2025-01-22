<template>
  <div class="search-bar-container">
    <div class="search-bar">
      <input 
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        placeholder="Search Recipes" 
        class="form-control" 
      />
      <button @click="$emit('search')" class="btn-search">
        <i class="fas fa-search"></i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string
}>();

defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'search'): void
}>();
</script>

<style scoped>
.search-bar-container {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.search-bar {
  display: flex;
  align-items: center;
  width: 50%; 
  background-color: white;
  border-radius: 25px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.form-control {
  flex: 1;
  border: none;
  outline: none;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border-radius: 25px 0 0 25px;
}

.form-control::placeholder {
  color: #a3a3a3;
}

.form-control:focus {
  outline: none;
  box-shadow: none;
}

.btn-search {
  background: none;
  border: none;
  padding: 0.5rem 1rem;
  color: #a3a3a3;
  cursor: pointer;
  font-size: 1.2rem;
  border-radius: 0 25px 25px 0;
}

.btn-search:hover {
  color: #707772;
}

.btn-search:focus {
  outline: none;
}
</style>