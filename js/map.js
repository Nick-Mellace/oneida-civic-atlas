export function createAtlasMap(elementId, onProjectSelect) {
  if (!window.L) throw new Error('Leaflet did not load. Check internet access for the Leaflet CDN.');

  const map = L.map(elementId, { zoomControl: true }).setView([43.0948, -75.6513], 14);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  const layer = L.featureGroup().addTo(map);
  const markersByProject = new Map();

  function setFeatures(features) {
    layer.clearLayers();
    markersByProject.clear();

    for (const feature of features) {
      if (!feature.geometry) continue;
      const pid = feature.properties?.project_id;
      const title = feature.properties?.project_name ?? pid;
      const category = feature.properties?.category ?? '';
      const geoLayer = L.geoJSON(feature, {
        pointToLayer: (_f, latlng) => L.circleMarker(latlng, {
          radius: 8,
          color: '#0e625d',
          weight: 2,
          fillColor: '#167f78',
          fillOpacity: .88
        })
      });
      geoLayer.bindPopup(`<button class="map-popup-button" data-map-project="${pid}"><strong>${escapeBasic(title)}</strong><span>${escapeBasic(category)}</span></button>`);
      geoLayer.on('popupopen', (event) => {
        const button = event.popup.getElement()?.querySelector('[data-map-project]');
        button?.addEventListener('click', () => onProjectSelect(pid), { once: true });
      });
      geoLayer.on('click', () => onProjectSelect(pid));
      geoLayer.addTo(layer);
      if (!markersByProject.has(pid)) markersByProject.set(pid, []);
      markersByProject.get(pid).push(geoLayer);
    }
  }

  function focusProject(projectId) {
    const groups = markersByProject.get(projectId) ?? [];
    if (!groups.length) return false;
    const bounds = L.featureGroup(groups).getBounds();
    if (bounds.isValid()) map.fitBounds(bounds.pad(.5), { maxZoom: 16 });
    const first = groups[0];
    const child = first.getLayers?.()[0];
    child?.openPopup?.();
    return true;
  }

  function fitVerified() {
    const bounds = layer.getBounds();
    if (bounds.isValid()) map.fitBounds(bounds.pad(.25), { maxZoom: 15 });
  }

  function invalidate() { map.invalidateSize(); }

  return { setFeatures, focusProject, fitVerified, invalidate, raw: map };
}

function escapeBasic(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
