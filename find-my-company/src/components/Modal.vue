<script setup>

defineProps({
  isOpen: Boolean,
});

const emit = defineEmits(['close']);
</script>

<template>
  <!-- Utilisation de Teleport pour rendre le modal dans le body -->
  <Teleport to="body">
    <div v-if="isOpen" class="modal-overlay" @click.self="emit('close')">
      <div class="modal-content">
        <button class="modal-close" @click="emit('close')">×</button>
        <slot></slot>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  position: relative;
}
.modal-close {
  color: var(--black);
  position: absolute;
  top: 0px;
  right: 0px;
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  z-index: 10000 !important;
}
</style>
