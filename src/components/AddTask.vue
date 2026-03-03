<template>
  <div class="add-task">
    <input
      v-model="title"
      type="text"
      placeholder="What needs to be done?"
      class="task-input"
      @keyup.enter="submit"
    />
    <input
      v-model="description"
      type="text"
      placeholder="Description (optional)"
      class="task-input description"
      @keyup.enter="submit"
    />
    <button @click="submit" class="add-btn" :disabled="!title.trim()">
      Add Task
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['add']);
const title = ref('');
const description = ref('');

const submit = () => {
  if (!title.value.trim()) return;
  
  emit('add', {
    title: title.value.trim(),
    description: description.value.trim() || null
  });
  
  title.value = '';
  description.value = '';
};
</script>

<style scoped>
.add-task {
  background: var(--surface-color);
  padding: 16px;
  border-radius: 12px;
  box-shadow: var(--shadow);
  margin-bottom: 16px;
}

.task-input {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-color);
  color: var(--text-color);
  font-size: 16px;
  margin-bottom: 8px;
  transition: border-color 0.2s;
}

.task-input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.task-input.description {
  font-size: 14px;
}

.add-btn {
  width: 100%;
  padding: 12px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.add-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.add-btn:not(:disabled):hover {
  opacity: 0.9;
}
</style>