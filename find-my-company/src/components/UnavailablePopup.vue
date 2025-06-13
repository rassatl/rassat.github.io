<template>
  <div v-if="visible" class="popup-overlay">
    <div class="popup">
      <div>{{ message }}</div>
      <button @click="closePopup">OK</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const visible = ref(false)
const message = ref('')

function showPopup(msg = "Cette fonctionnalité n'est pas encore disponible.") {
  message.value = msg
  visible.value = true
}

function closePopup() {
  visible.value = false
}

defineExpose({ showPopup })
</script>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup {
  background: white;
  padding: 20px 30px;
  border-radius: 10px;
  text-align: center;
  max-width: 300px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  font-family: sans-serif;
  color: black;
}

.popup button {
  margin-top: 15px;
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  background-color: #4CAF50;
  color: white;
  cursor: pointer;
}

.popup button:hover {
  background-color: #45a049;
}
</style>
