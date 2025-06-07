<script setup>
import { ref, watch, onMounted } from 'vue';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-control-geocoder';

const emit = defineEmits(['refresh']);
const speciality = ref('');
const name = ref('');
const address = ref('');
const city = ref('');
const pc = ref('');
const country = ref('');
const x = ref('');
const y = ref('');
const isLoading = ref(false);

let map = null;
let marker = null;
const mapContainer = ref(null);
let debounceTimeout = null;

var redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

onMounted(() => {
  map = L.map(mapContainer.value, {
    center: [46.656066, 0.364419],
    zoom: 5,
    minZoom: 3,
    maxBounds: [[-90, -180], [90, 180]],
    worldCopyJump: false,
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

});

// Récupérer les entreprises depuis Firestore
watch([address, city, pc, country], ([newAddress, newCity, newPc, newCountry]) => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(async () => {

    // Vérifier si tous les champs d'adresse sont remplis
    if (![newAddress, newCity, newPc, newCountry].every(field => field.trim() !== '')) {
      console.warn("Tous les champs d'adresse doivent être remplis avant de rechercher.");
      return;
    }
    const fullAddress = `${newAddress}, ${newPc} ${newCity}, ${newCountry}`;
    if (fullAddress.trim().length > 10) {
      isLoading.value = true;
      try {
        // console.log("🛰️ Fetching address:", fullAddress);
        // Appel à l'API Nominatim pour la géocodage
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}`, {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'VueApp/1.0 (youremail@example.com)'
          }
        });

        const results = await response.json();
        // console.log("📡 Résultats:", results);

        if (results && results.length > 0) {
          const { lat, lon } = results[0];
          const latLng = L.latLng(lat, lon);

          // Ajouter un marqueur sur la carte
          if (!marker) {
            marker = L.marker(latLng, {icon: redIcon}).addTo(map);
          } else {
            marker.setLatLng(latLng);
          }

          map.setView(latLng, 15);
          x.value = parseFloat(lat);
          y.value = parseFloat(lon);
        } else {
          console.warn("Aucun résultat pour:", fullAddress);
        }
      } catch (error) {
        console.error("Erreur lors de l'appel à Nominatim:", error);
      } finally {
        isLoading.value = false;
      }
    }
  }, 500);
});

// Fonction pour soumettre le formulaire
const submitForm = async () => {
  if (!speciality.value || !name.value || !address.value || !city.value || !country.value || !pc.value || !x.value || !y.value) {
    alert("Tous les champs sont obligatoires !");
    return;
  }

  try {
    await addDoc(collection(db, 'companies'), {
      speciality: speciality.value,
      name: name.value,
      address: address.value,
      city: city.value,
      country: country.value,
      pc: pc.value,
      x: x.value,
      y: y.value
    });

    speciality.value = '';
    name.value = '';
    address.value = '';
    city.value = '';
    country.value = '';
    pc.value = '';
    x.value = '';
    y.value = '';

    emit('refresh');
    emit('close');
  } catch (e) {
    console.error("Erreur lors de l'ajout de l'entreprise : ", e);
  }
};
</script>



<template>
  <div class="form-map-wrapper">
    <form class="form-container" @submit.prevent="submitForm">
      <h2>Ajouter une entreprise</h2>
      <div class="form-group">
        <label for="speciality">Spécialité</label>
        <select id="speciality" v-model="speciality" required>
          <option disabled value="">-- Sélectionner une spécialité --</option>
          <option value="Développement Logiciel, Tests et Qualité">Développement Logiciel, Tests et Qualité</option>
          <option value="IA & Big Data">IA & Big Data</option>
        </select>
      </div>
      <div class="form-group">
        <label for="name">Nom</label>
        <input id="name" v-model="name" required />
      </div>
      <div class="form-group">
        <label for="country">Pays</label>
        <input id="country" v-model="country" required />
      </div>
      <div class="form-group">
        <label for="address">Adresse</label>
        <input id="address" v-model="address" required />
      </div>
      <div class="form-group">
        <label for="city">Ville</label>
        <input id="city" v-model="city" required />
      </div>
      <div class="form-group">
        <label for="pc">Code Postal</label>
        <input id="pc" v-model="pc" required />
      </div>
      <button type="submit" class="submit-button">Ajouter l'entreprise</button>
    </form>

    <div class="mini-map" ref="mapContainer"></div>
  </div>
</template>


<style scoped>

.form-map-wrapper {
  display: flex;
  justify-content: space-between;
  gap: 50px;
}

select {
  width: 100%;
  padding: 8px 12px;
  border: 2px solid var(--gray-white-light);
  border-radius: 6px;
  font-size: 14px;
  background-color: var(--white);
  transition: border 0.2s;
}

.form-container {
  background: var(--white);
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-width: 500px;
  margin: 0 auto;
  font-family: 'Segoe UI', sans-serif;
}

h2 {
  color: var(--red-esigelec);
  text-align: center;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
  color: var(--gray-dark);
}

input {
  width: 90%;
  padding: 8px 12px;
  border: 2px solid var(--gray-white-light);
  border-radius: 6px;
  font-size: 14px;
  transition: border 0.2s;
  background-color: var(--white);
  color: var(--gray-dark);
}

input:focus {
  border-color: var(--red-esigelec);
  outline: none;
}

.submit-button {
  background-color: var(--red-esigelec);
  color: var(--white);
  border: none;
  border-radius: 6px;
  padding: 10px;
  width: 100%;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.submit-button:hover {
  background-color: var(--red-btn-hover);
}

.mini-map {
  width: 600px;
  height: auto;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  flex-shrink: 0;
}
</style>
