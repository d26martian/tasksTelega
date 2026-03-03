<template>
  <div class="task-item" :class="{ 'completed': task.completed }">
    <div class="task-content" @click="$emit('toggle')">
      <div class="checkbox" :class="{ 'checked': task.completed }">
        <svg v-if="task.completed" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>
      
      <div class="task-text">
        <h3 :class="{ 'completed': task.completed }">{{ task.title }}</h3>
        <p v-if="task.description" class="description">{{ task.description }}</p>
        <span class="date">{{ formatDate(task.createdAt) }}</span>
      </div>
    </div>
    
    <div class="task-actions">
      <button @click.stop="$emit('edit')" class="btn-icon edit" title="Edit">
        ✏️
      </button>
      <button @click.stop="confirmDelete" class="btn-icon delete" title="Delete">
        🗑️
      </button>
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue';

const tg = inject('tg');

const props = defineProps({
  task: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['toggle', 'delete', 'edit']);

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const confirmDelete = () => {
  tg.showPopup({
    title: 'Delete Task',
    message: `Delete "${props.task.title}"?`,
    buttons: [
      { id: 'delete', type: 'destructive', text: 'Delete' },
      { type: 'cancel' }
    ]
  }, (buttonId) => {
    if (buttonId === 'delete') {
      emit('delete');
    }
  });
};
</script>

<style scoped>
.task-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--surface-color);
  padding: 16px;
  border-radius: 12px;
  box-shadow: var(--shadow);
  transition: transform 0.2s, box-shadow 0.2s;
}

.task-item:active {
  transform: scale(0.98);
}

.task-content {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  flex: 1;
  cursor: pointer;
}

.checkbox {
  width: 24px;
  height: 24px;
  border: 2px solid var(--border-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s;
  margin-top: 2px;
}

.checkbox.checked {
  background: var(--success-color);
  border-color: var(--success-color);
}

.checkbox svg {
  width: 14px;
  height: 14px;
  color: white;
  stroke-width: 3;
}

.task-text {
  flex: 1;
}

.task-text h3 {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-color);
  margin-bottom: 4px;
  transition: color 0.2s;
}

.task-text h3.completed {
  text-decoration: line-through;
  color: var(--text-secondary);
}

.description {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 4px;
  line-height: 1.4;
}

.date {
  font-size: 12px;
  color: var(--text-secondary);
  opacity: 0.7;
}

.task-actions {
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.2s;
}

.task-item:hover .task-actions {
  opacity: 1;
}

@media (max-width: 480px) {
  .task-actions {
    opacity: 1;
  }
}

.btn-icon {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background 0.2s;
}

.btn-icon:hover {
  background: var(--bg-color);
}

.btn-icon.delete:hover {
  background: rgba(231, 76, 60, 0.1);
}
</style>