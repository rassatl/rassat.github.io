<script setup>
import { onMounted, ref, watch } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const mapContainer = ref(null);
const props = defineProps({
  isOpen: Boolean,
  selectedSpeciality: String
});
const emit = defineEmits(['update-visible-companies'])

const companies = ref([])

let map = null;

// Icon pour les marqueurs
var redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Fonction pour mettre à jour les entreprises visibles sur la carte
function updateVisibleCompanies() {
  const bounds = map.getBounds()
  emit('update-visible-companies', companies.value.filter(company => {
    return (
      company.x >= bounds.getSouth() &&
      company.x <= bounds.getNorth() &&
      company.y >= bounds.getWest() &&
      company.y <= bounds.getEast()
    )
  }))
}


onMounted(async () => {
  // Initialiser la carte
  map = L.map(mapContainer.value, {
    center: [46.656066, 0.364419],
    zoom: 5,
    minZoom: 3,
    maxBounds: [
      [-90, -180],
      [90, 180],
    ],
    worldCopyJump: false,
  });

  // Ajouter une couche de tuiles OpenStreetMap
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map);

  // L.marker([46.656066, 0.364419], {icon: redIcon})
  //   .addTo(map)
  //   .bindPopup('ESIGELEC - Poitiers')
  //   .openPopup()

  // Récupérer les entreprises depuis Firestore et ajouter des marqueurs
  await fetchCompaniesAndAddMarkers();

  map.on('moveend', () => {
    updateVisibleCompanies()
  })
  map.on('zoomend', () => {
    updateVisibleCompanies()
  })
  map.on('resize', () => {
    updateVisibleCompanies()
  })
});

// Fonction pour récupérer les entreprises et ajouter des marqueurs
const fetchCompaniesAndAddMarkers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'companies'));
    const companyList = [];
    querySnapshot.forEach((doc) => {
      const company = doc.data();
      const { x, y, name } = company;
      if (x && y && name) {
        const marker = L.marker([x, y], {icon: redIcon}).addTo(map);
        marker.bindPopup(name);
        companyList.push({ ...company, marker });
      }
    });
    companies.value = companyList
  } catch (error) {
    console.error('Erreur lors de la récupération des entreprises:', error);
  }
};

// Redimensionner la carte lorsque la sidebar change d'état
watch(
  () => props.isOpen,
  () => {
    setTimeout(() => {
      map.invalidateSize();
    }, 400);
  }
);

watch(
  () => props.selectedSpeciality,
  (newCategory) => {
    if (!map) return;
    companies.value.forEach(company => {
      if (company.marker) {
        if (!newCategory || company.speciality === newCategory) {
          if (!map.hasLayer(company.marker)) {
            company.marker.addTo(map);
          }
        } else {
          if (map.hasLayer(company.marker)) {
            company.marker.remove();
          }
        }
      }
    });
    updateVisibleCompanies();
  },
  { immediate: true }
);

</script>

<template>
  <!-- Conteneur pour la carte Leaflet -->
  <div
    id="map"
    ref="mapContainer"
    class="map-container"
    :class="{ 'sidebar-open': isOpen, 'sidebar-closed': !isOpen }"
  ></div>
</template>

<style scoped>
.map-container {
  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100%;
  transition: all 0.3s ease;
  z-index: 0;
  overflow: hidden;
}
</style>
