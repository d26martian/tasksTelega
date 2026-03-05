<template>
  <div class="add-task">
    <!-- Input with minimum 16px font-size to prevent iOS zoom -->
    <input
      ref="titleInput"
      v-model="title"
      type="text"
      placeholder="What needs to be done?"
      class="task-input"
      @keyup.enter="submit"
      @focus="handleFocus"
      autocomplete="off"
      autocorrect="off"
      autocapitalize="off"
    />
    <input
      v-model="description"
      type="text"
      placeholder="Description (optional)"
      class="task-input description"
      @keyup.enter="submit"
      autocomplete="off"
      autocorrect="off"
    />
    <!-- Button with explicit touch handling -->
    <button 
      @click="handleSubmit" 
      @touchstart.prevent="handleTouchStart"
      class="add-btn" 
      :disabled="!title.trim()"
      type="button"
    >
      Add Task
    </button>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';

const emit = defineEmits(['add']);
const title = ref('');
const description = ref('');
const titleInput = ref(null);

// Prevent default touch behavior that might cause zoom
const handleTouchStart = (e) => {
  e.preventDefault();
  handleSubmit();
};

// Handle focus without zooming
const handleFocus = () => {
  // Scroll into view smoothly without zoom
  nextTick(() => {
    titleInput.value?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
};

const handleSubmit = () => {
  if (!title.value.trim()) return;
  
  emit('add', {
    title: title.value.trim(),
    description: description.value.trim() || null
  });
  
  title.value = '';
  description.value = '';
  
  // Blur input to dismiss keyboard and prevent zoom
  nextTick(() => {
    document.activeElement?.blur();
  });
};

// Keep for keyboard support
const submit = handleSubmit;
</script>

<style scoped>
.add-task {
  background: var(--surface-color);
  padding: 16px;
  border-radius: 12px;
  box-shadow: var(--shadow);
  margin-bottom: 16px;
  /* Prevent transform/zoom issues */
  transform: translateZ(0);
}

.task-input {
  width: 100%;
  /* CRITICAL: 16px minimum prevents iOS auto-zoom */
  font-size: 16px;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-color);
  color: var(--text-color);
  margin-bottom: 8px;
  /* Prevent zoom on focus */
  -webkit-appearance: none;
  appearance: none;
  /* Smooth transitions without scaling */
  transition: border-color 0.2s, box-shadow 0.2s;
  /* Prevent iOS rounded corners override */
  border-radius: 8px !important;
}

.task-input:focus {
  outline: none;
  border-color: var(--primary-color);
  /* Use shadow instead of scale/transform */
  box-shadow: 0 0 0 3px rgba(36, 129, 204, 0.1);
}

.task-input.description {
  /* Keep consistent 16px font */
  font-size: 16px;
}

/* Placeholder styling to ensure consistency */
.task-input::placeholder {
  font-size: 16px;
  color: var(--text-secondary);
  opacity: 0.6;
}

.add-btn {
  width: 100%;
  padding: 14px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  /* Consistent 16px font */
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.1s;
  /* Prevent zoom on tap */
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  /* Prevent button text scaling */
  text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
}

.add-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Active state without zoom */
.add-btn:not(:disabled):active {
  transform: scale(0.98);
  opacity: 0.9;
}

/* Remove default focus outline, use custom */
.add-btn:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(36, 129, 204, 0.3);
}

/* iOS specific: Prevent callout on long press */
.add-btn {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
}
</style>