<script setup>
import { ref } from 'vue'
import CompanyItem from './CompanyItem.vue'
import Modal from './Modal.vue'
import CompanyInformations from './CompanyInformations.vue'

const props = defineProps({
  companies: {
    type: Array,
    required: true
  }
})

const isModalOpen = ref(false);
const selectedCompany = ref(null);

const openModal = (company) => {
  isModalOpen.value = true;
  selectedCompany.value = company;
  if (props.isOpen) {
    emit('toggle');
  }
};

// Fonction pour fermer la fenêtre modale d'ajout d'entreprise
const closeModal = () => {
  isModalOpen.value = false;
};
</script>

<template>
  <ul>
    <li v-for="company in companies" :key="company.id" @click="openModal(company)">
      <CompanyItem
        :speciality="company.speciality"
        :name="company.name"
        :city="company.city"
        :country="company.country"
        :pc="company.pc.toString()"
      />
    </li>
  </ul>

  <Modal :isOpen="isModalOpen" @close="closeModal">
    <CompanyInformations :company="selectedCompany" />
  </Modal>
</template>

<style scoped>
ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
li {
  margin-bottom: 12px;
  cursor: pointer;
}
</style>
