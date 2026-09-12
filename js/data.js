export function validateAtlasData(projects, mapFeatures) {
  const errors = [];
  if (!Array.isArray(projects)) return ['Projects payload is not an array.'];
  if (!Array.isArray(mapFeatures)) return ['Map feature payload is not an array.'];

  const projectIds = projects.map((p) => p.project_id);
  const uniqueIds = new Set(projectIds);
  if (projectIds.length !== uniqueIds.size) errors.push('Duplicate project IDs detected.');

  for (const feature of mapFeatures) {
    const pid = feature?.properties?.project_id;
    if (!pid || !uniqueIds.has(pid)) {
      errors.push(`Map feature ${feature?.id ?? '(unknown)'} references unknown project ${pid ?? '(missing)'}.`);
    }
  }
  return errors;
}

export async function loadAtlasData() {
  const [bundleResponse, geoResponse] = await Promise.all([
    fetch('./data/app_bundle.json'),
    fetch('./data/map_features.geojson'),
  ]);

  if (!bundleResponse.ok) throw new Error(`Could not load project bundle (${bundleResponse.status}).`);
  if (!geoResponse.ok) throw new Error(`Could not load map features (${geoResponse.status}).`);

  const bundle = await bundleResponse.json();
  const geojson = await geoResponse.json();
  const projects = bundle.projects ?? [];
  const mapFeatures = geojson.features ?? [];
  const errors = validateAtlasData(projects, mapFeatures);
  if (errors.length) throw new Error(errors.join(' '));

  const projectById = new Map(projects.map((p) => [p.project_id, p]));
  const featuresByProject = new Map();
  for (const feature of mapFeatures) {
    const pid = feature.properties.project_id;
    if (!featuresByProject.has(pid)) featuresByProject.set(pid, []);
    featuresByProject.get(pid).push(feature);
  }

  return { projects, mapFeatures, projectById, featuresByProject, bundle, geojson };
}
