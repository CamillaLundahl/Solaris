const API_CONFIG = {
  baseUrl: 'https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com',
  endpoints: {
      keys: '/keys',
      bodies: '/bodies'
  }
};

const planets = document.querySelectorAll('button');

/* Event Listeners för planeter */
planets.forEach((planet) => {
  planet.addEventListener('click', () => {
      const planetClass = planet.className;
      openPopup(`popup-${planetClass}`);
  });
});

/* Popup funktioner */
function openPopup(popupId) {
  const popup = document.getElementById(popupId);
  if (popup) {
      popup.style.display = 'flex';
  }
}

function closePopup(popupId) {
  const popup = document.getElementById(popupId);
  if (popup) {
      popup.style.display = 'none';
  }
}

/* Hämta API */
async function getKey() {
  try {
      const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.keys}`, {
          method: 'POST'
      });
      const data = await response.json();
      await getPlanets(data.key);
  } catch (error) {
      console.error('Fel vid hämtning av API-nyckel:', error);
  }
}

async function getPlanets(key) {
  try {
      const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.bodies}`, {
          method: 'GET',
          headers: {
              'x-zocom': key
          }
      });
      const data = await response.json();
      updatePlanetInfo(data.bodies);
  } catch (error) {
      console.error('Fel vid hämtning av planetdata:', error);
  }
}

function updatePlanetInfo(planets) {
  planets.forEach(planet => {
      const planetName = planet.name.toLowerCase();
      const infoElement = document.querySelector(`#info-${planetName}`);
      
      if (infoElement) {
          infoElement.innerHTML = createPlanetInfoHTML(planet);
      }
  });
}

/* innerHTML för att kunna uppdatera innehållet dynamiskt */
function createPlanetInfoHTML(planet) {
  return `
      <h2>${planet.name}</h2>
      <section class="latin-name">${planet.latinName}</section>
      
      <section class="description">
          <section class="label"></section>
          <section class="value">${planet.desc}</section>
      </section>

      <section class="divider"></section>
      
      <section class="data-grid">
          <section class="data-item">
              <section class="label">Omkrets</section>
              <section class="value">${formatNumber(planet.circumference)} km</section>
          </section>
          
          <section class="data-item">
              <section class="label">Avstånd till solen</section>
              <section class="value">${formatNumber(planet.distance)} km</section>
          </section>
          
          <section class="data-item">
              <section class="label">Temperatur dag</section>
              <section class="value">${planet.temp.day}°C</section>
          </section>
          
          <section class="data-item">
              <section class="label">Temperatur natt</section>
              <section class="value">${planet.temp.night}°C</section>
          </section>
      </section>

      <section class="divider"></section>

      <section class="data-grid">
          <section class="data-item" style="grid-column: 1 / -1;">
              <section class="label">Månar</section>
              <section class="value">${formatMoons(planet.moons)}</section>
          </section>
      </section>
  `;
}

function formatNumber(number) {
  return number.toLocaleString('sv-SE');
}

function formatMoons(moons) {
  return moons.length > 0 ? moons.join(', ') : 'Inga';
}

getKey();