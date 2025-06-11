<script setup>
const props = defineProps({
  company: {
    type: Object,
    required: true
  }
})
const UNDIFINED = "TO DO";
</script>

<template>
  <div class="details">
    <h2>{{ company.name }}</h2>
    <p><strong>Description :</strong> {{ UNDIFINED }}</p>
    <p><strong>Secteurs d'activités :</strong> {{ UNDIFINED }}</p>
    <p><strong>Date depuis la dernière embauche :</strong> {{ UNDIFINED }}</p>
    <p><strong>Spécialité :</strong> {{ company.speciality }}</p>
    <p><strong>Ville :</strong> {{ company.city }}</p>
    <p><strong>Pays :</strong> {{ company.country }}</p>
    <p><strong>Code Postal :</strong> {{ company.pc }}</p>
    <p><strong>Avis des étudiants :</strong> {{ UNDIFINED }}</p>
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
