<script setup>
import { onMounted, ref, computed } from 'vue'
import { db } from '../firebase'
import { collection, getDocs } from 'firebase/firestore'
import CompanyItem from './CompanyItem.vue'
import Modal from './Modal.vue';
import AddCompanyForm from './AddCompanyForm.vue';
import ListCompanies from './ListCompanies.vue';

// Props et événements
const props = defineProps({isOpen: Boolean, visibleCompanies: Array})
const emit = defineEmits(['toggle', 'update-speciality'])

const isModalOpen = ref(false);
const companies = ref([])
const selectedSpeciality = ref('')

// Fonction pour ouvrir la fenêtre modale d'ajout d'entreprise
const openModal = () => {
  isModalOpen.value = true;
  if (props.isOpen) {
    emit('toggle');
  }
};

// Fonction pour fermer la fenêtre modale d'ajout d'entreprise
const closeModal = () => {
  isModalOpen.value = false;
};

// Filtre pour les entreprises selon la spécialité sélectionnée 
// et la liste des entreprises visibles fournies par le composant MapView
const filteredCompanies = computed(() => {
  let base = props.visibleCompanies.length ? props.visibleCompanies : companies.value
  if (!selectedSpeciality.value || selectedSpeciality.value === 'Toutes') {
    return base
  }
  return base.filter(c =>
    c.speciality.includes(selectedSpeciality.value)
  )
})


// Fonction pour récupérer la liste des entreprises depuis Firestore
const fetchCompanies = async () => {
  const querySnapshot = await getDocs(collection(db, 'companies'));
  companies.value = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

// Fonction pour ouvrir/fermer la sidebar
function toggleSideBar() {
  emit('toggle')
}

onMounted(fetchCompanies);
</script>

<template>
  <div>
    <div
      class="sidebar"
      :class="{ closed: !props.isOpen }"
      :style="{ width: props.isOpen ? '400px' : '0' }">

      <!-- Bouton pour se connecter -->
      <div v-if="props.isOpen" class="connection-action">
        <button @click="fetchCompanies" class="refresh-button" aria-label="Rafraîchir"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-user"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></button>
      </div>

      <!-- Bouton pour afficher la liste des entreprises en attentes --> 
      <div v-if="props.isOpen" class="list-action">
        <button @click="fetchCompanies" class="refresh-button" aria-label="Rafraîchir"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-list"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg></button>
      </div>

      <!-- Bouton pour rafraîchir la liste des entreprises --> 
      <div v-if="props.isOpen" class="refresh-action">
        <button @click="fetchCompanies" class="refresh-button" aria-label="Rafraîchir">⟳</button>
      </div>

      <!-- Bouton d'ajout d'entreprise -->
      <div v-if="props.isOpen" class="add-company-action">
        <button @click="openModal" class="plus-button" aria-label="Ajouter">+</button>
      </div>
      
      <hr class="separator" />
      <h1>Find My Company</h1>
      <hr class="separator" />
      <h2 v-if="props.isOpen">Liste des entreprises</h2>

      <!-- Barre de filtre pour les spécialités -->
      <div v-if="props.isOpen" class="filter-bar">
        <label for="speciality-select">Spécialité :</label>
        <select id="speciality-select" v-model="selectedSpeciality" @change="$emit('update-speciality', selectedSpeciality)" required>
            <option value="" >Toutes</option>
            <option value="Développement Logiciel, Tests et Qualité">Développement Logiciel, Tests et Qualité</option>
            <option value="IA & Big Data">IA & Big Data</option>
        </select>
      </div>

      <!-- Affiche la liste des entreprises si la sidebar est visible -->
      <ListCompanies v-if="props.isOpen" :companies="filteredCompanies" />
    </div>

    <!-- Fenêtre d'ajout d'entreprise -->
    <Modal :isOpen="isModalOpen" @close="closeModal">
      <AddCompanyForm @refresh="fetchCompanies" />
    </Modal>

    <!-- Bouton Ouverture/Fermeture sidebar -->
    <button
      class="toggle-button"
      @click="toggleSideBar"
      :class="{ closed: !props.isOpen }"
      :style="{ left: props.isOpen ? '400px' : '0' }"
    >
      <!-- Flèche pour savoir dans quel sens la sidebar va aller si on clique sur le bouton -->
      <span><i :class="['arrow', props.isOpen ? 'left' : 'right']"></i></span> 
    </button>
  </div>
</template>

<style scoped>
h1{
  font-size: 2rem;
  margin-bottom: 1rem;
}

.separator {
  border: none;
  height: 4px;
  background-color: var(--red-esigelec);
  margin: 10px 0;
  width: 100%;
}

h2 {
  color: var(--red-esigelec);
  margin-bottom: 1rem;
}

.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  background-color: var(--background-white);
  padding: 20px;
  overflow-y: auto;
  transition: transform 0.3s ease, width 0.3s ease;
  box-sizing: border-box;
  z-index: 1000;
}
.sidebar.closed {
  transform: translateX(-100%);
}

.toggle-button {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  width: 35px;
  height: 60px;
  background-color: var(--red-esigelec);
  border: none;
  border-radius: 0 5px 5px 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: left 0.3s ease;
  z-index: 1001;
}
.toggle-button:hover {
  background-color: var(--red-btn-hover);
}

.arrow {
  border: solid var(--white);;
  border-width: 0 3px 3px 0;
  display: inline-block;
  padding: 5px;
}
.right {
  transform: rotate(-45deg);
}
.left {
  transform: rotate(135deg);
}

.filter-bar {
  margin-bottom: 1rem;
  color: var(--red-esigelec);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

select {
  padding: 5px 10px;
  border-radius: 5px;
  border: none;
  font-size: 1rem;
}

.add-company-action {
  position: absolute;
  top: -5px;
  right: 0px;
}
.list-action {
  position: absolute;
  top: 0px;
  left: 30px;
}
.connection-action {
  position: absolute;
  top: 0px;
  left: 0px;
}

.plus-button {
  width: 32px;
  height: 32px;
  background: transparent;
  border: none;
  font-size: 30px;
  font-weight: bold;
  color: var(--red-esigelec);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s ease, transform 0.3s ease;
  padding: 0;
  border-radius: 4px;
  outline: none;
}
.plus-button:focus {
  outline: none;
  box-shadow: none;
}
.plus-button:focus:not(:focus-visible) {
  outline: none;
}
.plus-button:hover {
  color: var(--red-btn-hover);
  transform: scale(1.2);
}

.refresh-action {
  position: absolute;
  top: -2px;
  right: 30px;
}
.refresh-button {
  width: 32px;
  height: 32px;
  background: transparent;
  border: none;
  font-size: 22px;
  font-weight: bold;
  color: var(--red-esigelec);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s ease, transform 0.3s ease;
  padding: 0;
  border-radius: 4px;
  outline: none;
}

.refresh-button:hover {
  color: var(--red-btn-hover);
  transform: scale(1.2);
}

</style>
