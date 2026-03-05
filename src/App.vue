<template>
  <div class="app" :class="{ 'dark': isDark }">
    <div class="container">
      <header class="header">
        <h1>📝 Task Manager</h1>
        <div class="user-info">
          <p v-if="user">Welcome, {{ user.first_name || user.firstName }}</p>
          <p v-else-if="tg.devMode" class="dev-badge">🛠️ Dev Mode</p>
        </div>
      </header>
      
      <div v-if="!isInTelegram && !tg.devMode" class="warning-banner">
        ⚠️ Please open this app in Telegram
      </div>
      
      <AddTask @add="handleAddTask" />
      
      <TaskList 
        :tasks="tasks"
        @toggle="handleToggle"
        @delete="handleDelete"
        @edit="handleEdit"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, inject, computed } from 'vue';
import { taskApi } from './api/tasks.js';
import TaskList from './components/TaskList.vue';
import AddTask from './components/AddTask.vue';

const tg = inject('tg');
const tasks = ref([]);
const user = ref(null);
const isDark = computed(() => tg.colorScheme === 'dark');
const isInTelegram = computed(() => !tg.devMode && window.Telegram?.WebApp);

const loadTasks = async () => {
  try {
    const { data } = await taskApi.getAll();
    tasks.value = data;
  } catch (error) {
    console.error('Failed to load tasks:', error);
    if (tg.showAlert) {
      tg.showAlert('Failed to load tasks');
    }
  }
};

const handleAddTask = async (taskData) => {
  try {
    const { data } = await taskApi.create(taskData);
    tasks.value.unshift(data);
    if (tg.HapticFeedback) {
      tg.HapticFeedback.notificationOccurred('success');
    }
  } catch (error) {
    console.error('Failed to create task:', error);
    if (tg.showAlert) tg.showAlert('Failed to create task');
  }
};

const handleToggle = async (task) => {
  try {
    const { data } = await taskApi.toggle(task.id);
    const index = tasks.value.findIndex(t => t.id === task.id);
    if (index !== -1) {
      tasks.value[index] = data;
    }
    if (tg.HapticFeedback) {
      tg.HapticFeedback.impactOccurred('light');
    }
  } catch (error) {
    console.error('Failed to toggle task:', error);
    if (tg.showAlert) tg.showAlert('Failed to update task');
  }
};

const handleDelete = async (id) => {
  try {
    await taskApi.delete(id);
    tasks.value = tasks.value.filter(t => t.id !== id);
    if (tg.HapticFeedback) {
      tg.HapticFeedback.impactOccurred('medium');
    }
  } catch (error) {
    console.error('Failed to delete task:', error);
    if (tg.showAlert) tg.showAlert('Failed to delete task');
  }
};

const handleEdit = async (task) => {
  // Simple prompt fallback for dev mode
  const newTitle = prompt('Edit task title:', task.title);
  
  if (newTitle && newTitle.trim() && newTitle !== task.title) {
    try {
      const { data } = await taskApi.update(task.id, { title: newTitle.trim() });
      const index = tasks.value.findIndex(t => t.id === task.id);
      if (index !== -1) {
        tasks.value[index] = data;
      }
    } catch (error) {
      console.error('Failed to update task:', error);
      if (tg.showAlert) tg.showAlert('Failed to update task');
    }
  }
};

onMounted(() => {
  // Safely get user data
  if (tg.initDataUnsafe?.user) {
    user.value = tg.initDataUnsafe.user;
  } else if (tg.devMode) {
    user.value = { first_name: 'Developer', id: 123456 };
  }
  
  // loadTasks();
});
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --bg-color: #f5f5f5;
  --surface-color: #ffffff;
  --text-color: #333333;
  --text-secondary: #666666;
  --primary-color: #2481cc;
  --success-color: #31b545;
  --danger-color: #e74c3c;
  --border-color: #e0e0e0;
  --shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  --warning-bg: #fff3cd;
  --warning-text: #856404;
}

.dark {
  --bg-color: #0f0f0f;
  --surface-color: #1a1a1a;
  --text-color: #ffffff;
  --text-secondary: #aaaaaa;
  --border-color: #333333;
  --shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  --warning-bg: #3d3d00;
  --warning-text: #ffeb3b;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background: var(--bg-color);
  color: var(--text-color);
  line-height: 1.6;
}

.app {
  min-height: 100vh;
  padding-bottom: 20px;
}

.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 16px;
}

.header {
  text-align: center;
  margin-bottom: 24px;
  padding-top: 8px;
}

.header h1 {
  font-size: 24px;
  margin-bottom: 4px;
  color: var(--text-color);
}

.user-info p {
  color: var(--text-secondary);
  font-size: 14px;
}

.dev-badge {
  background: var(--primary-color);
  color: white !important;
  padding: 4px 12px;
  border-radius: 12px;
  display: inline-block;
  font-size: 12px !important;
  font-weight: 600;
}

.warning-banner {
  background: var(--warning-bg);
  color: var(--warning-text);
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 16px;
  text-align: center;
  font-weight: 500;
}
</style>