<script setup>
import { ref, watch } from 'vue'
import ListeDeroulante from './components/ListeDeroulante.vue'
import MapComponent from './components/MapView.vue'

// État centralisé pour l'ouverture de la sidebar
const isOpen = ref(true)
const visibleCompanies = ref([])
const selectedSpeciality = ref('');

// Watcher pour logger les changements
// watch(isOpen, (newVal) => {
//   console.log('🧭 isOpen value changed:', newVal)
// })
// watcher pour visibleCompanies
// watch(visibleCompanies, (newVal) => {
//   console.log('🧭 visibleCompanies value changed:', visibleCompanies.value.length)
// })
</script>


<template>
  <ListeDeroulante :isOpen="isOpen" :visibleCompanies="visibleCompanies" @toggle="isOpen = !isOpen" @update-speciality="selectedSpeciality = $event"/>
  <MapComponent :isOpen="isOpen" :selectedSpeciality="selectedSpeciality" @update-visible-companies="visibleCompanies = $event"/>
</template>
 