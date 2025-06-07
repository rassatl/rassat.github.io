<script setup>
defineProps({
  speciality: String,
  name: String,
  city: String,
  country: String,
  pc: String,
})
</script>

<template>
  <!-- Composant d'affichage d'une entreprise -->
  <div class="company-item">
    <div class="top">
      <div class="left">
        <h3 class="speciality">
          <span v-if="speciality" class="text">
            {{ speciality === "Développement Logiciel, Tests et Qualité" ? "Dev Logiciel" : speciality }}
          </span>
          <span v-else class="skeleton skeleton-text"></span>
        </h3>
        <p class="name">
          <strong v-if="name" class="text">{{ name }}</strong>
          <span v-else class="skeleton skeleton-text"></span>
        </p>
      </div>
      <div class="right">
        <p class="city">
          <span v-if="city">Ville : {{ city }}</span>
          <span v-else class="skeleton skeleton-text short"></span>
        </p>
        <p class="country">
          <span v-if="country">Pays : {{ country }}</span>
          <span v-else class="skeleton skeleton-text short"></span>
        </p>
        <p class="pc">
          <span v-if="pc">Code Postal : {{ pc }}</span>
          <span v-else class="skeleton skeleton-text short"></span>
        </p>
      </div>
    </div>
    <p class="more">Cliquer pour plus d'informations</p>
  </div>
</template>

<style scoped>
.company-item {
  background-color: var(--red-esigelec);
  color: var(--white);
  border-radius: 8px;
  padding: 12px 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 10px;
  transition: transform 0.2s;
}

.company-item:hover {
  transform: translateY(-2px);
  cursor: pointer;
}

.top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.left, .right {
  flex: 1;
}

.left p, h3 {
  color: var(--white);
  text-align: left;
}

.right p {
  margin: 0;
  font-size: 0.9em;
  color: var(--white);
  text-align: right;
}

.speciality {
  font-size: 1.1em;
  font-weight: 600;
  margin: 0 0 5px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.name {
  margin: 0;
  font-weight: bold;
  color: var(--white);
}

.city, .pc, .country {
  margin: 0;
  font-size: 0.95em;
}

.more {
  font-style: italic;
  font-size: 0.85em;
  color: var(--gray-light);
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  padding-top: 6px;
  text-align: center;
  margin: 0;
}

/* 🔄 Skeleton Loading Style */
.skeleton {
  display: inline-block;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  animation: pulse 1.2s infinite ease-in-out;
  height: 1em;
}

.skeleton-text {
  width: 70%;
  height: 1em;
  margin: 2px 0;
}

.skeleton-text.short {
  width: 50%;
}

@keyframes pulse {
  0% { opacity: 0.5; }
  50% { opacity: 0.8; }
  100% { opacity: 0.5; }
}
</style>
