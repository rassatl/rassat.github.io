<script setup>
const props = defineProps({
  company: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="details">
    <h2>{{ company.name }}</h2>
    <p><strong>Spécialité :</strong> {{ company.speciality }}</p>
    <p><strong>Ville :</strong> {{ company.city }}</p>
    <p><strong>Pays :</strong> {{ company.country }}</p>
    <p><strong>Code Postal :</strong> {{ company.pc }}</p>
  </div>
</template>

<style scoped>
.details {
    display: flex;
    flex-direction: column;
    gap: 10px;
    color: var(--black);
}
h2 {
  color: var(--red-esigelec);
  margin-bottom: 0.5rem;
}
</style>
