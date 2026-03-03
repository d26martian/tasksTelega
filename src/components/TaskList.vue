<template>
  <div class="task-list">
    <div v-if="tasks.length === 0" class="empty-state">
      <p>No tasks yet. Add one above! 🚀</p>
    </div>
    
    <TransitionGroup name="list" tag="div">
      <TaskItem
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        @toggle="$emit('toggle', task)"
        @delete="$emit('delete', task.id)"
        @edit="$emit('edit', task)"
      />
    </TransitionGroup>
  </div>
</template>

<script setup>
import TaskItem from './TaskItem.vue';

defineProps({
  tasks: {
    type: Array,
    required: true
  }
});

defineEmits(['toggle', 'delete', 'edit']);
</script>

<style scoped>
.task-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: var(--text-secondary);
}

.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>