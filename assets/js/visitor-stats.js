// Visitor Statistics Tracker
// Uses: CountAPI for page view counter, ip-api for geolocation, Leaflet for map

(function() {
  'use strict';
  
  // Configuration
  const CONFIG = {
    countApiUrl: 'https://api.countapi.xyz/hit/yultheconkor.github.io/visits',
    geoApiUrl: 'https://ip-api.com/json',
    mapId: 'visitor-map',
    containerId: 'visitor-stats-container'
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeVisitorStats);
  } else {
    initializeVisitorStats();
  }

  async function initializeVisitorStats() {
    try {
      // Skip if container doesn't exist
      const container = document.getElementById(CONFIG.containerId);
      if (!container) return;

      // Fetch visitor data in parallel
      const [viewCount, geoData] = await Promise.all([
        fetchPageViews(),
        fetchGeoLocation()
      ]);

      // Update display
      updateViewCount(viewCount);
      initializeMap(geoData);
    } catch (error) {
      console.warn('Visitor stats error:', error);
    }
  }

  async function fetchPageViews() {
    try {
      const response = await fetch(CONFIG.countApiUrl);
      const data = await response.json();
      return data.value || 0;
    } catch (error) {
      console.warn('Failed to fetch page views:', error);
      return 0;
    }
  }

  async function fetchGeoLocation() {
    try {
      const response = await fetch(CONFIG.geoApiUrl);
      const data = await response.json();
      return {
        lat: data.lat || 0,
        lon: data.lon || 0,
        country: data.country || 'Unknown',
        city: data.city || '',
        ip: data.query || ''
      };
    } catch (error) {
      console.warn('Failed to fetch geolocation:', error);
      return { lat: 20, lon: 0, country: 'Unknown', city: '', ip: '' };
    }
  }

  function updateViewCount(count) {
    const countElement = document.getElementById('visitor-count');
    if (countElement) {
      countElement.textContent = count;
    }
  }

  function initializeMap(geoData) {
    const mapElement = document.getElementById(CONFIG.mapId);
    if (!mapElement) return;

    // Initialize Leaflet map
    const map = L.map(CONFIG.mapId).setView([geoData.lat, geoData.lon], 5);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add marker for current visitor
    const markerIcon = L.icon({
      iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjRkY0NDQ0IiBkPSJNMTIgMGM2LjYyNyAwIDEyIDUuMzczIDEyIDEycy01LjM3MyAxMi0xMiAxMlMwIDE4LjYyNyAwIDEyczUuMzczLTEyIDEyLTEyeiIvPjwvc3ZnPg==',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });

    L.marker([geoData.lat, geoData.lon], { icon: markerIcon })
      .addTo(map)
      .bindPopup(`<strong>${geoData.country}</strong><br/>${geoData.city}`)
      .openPopup();

    // Adjust map for small size
    setTimeout(() => map.invalidateSize(), 100);
  }
})();
