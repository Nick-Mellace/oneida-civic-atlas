function searchableText(project) {
  return [
    project.project_name,
    project.category,
    project.status,
    project.jurisdiction,
    project.lead_entity,
    project.verified_location,
    project.verified_address,
    project.open_questions,
    project.next_milestone,
    project.blockers,
  ].filter(Boolean).join(' ').toLowerCase();
}

export function getGeometryLabel(features = []) {
  if (!features.length) return 'Map geometry pending';
  const hasGeometry = features.some((f) => f.geometry !== null);
  if (hasGeometry) return 'Verified on map';
  const isCitywide = features.some((f) => {
    const s = f.properties?.geometry_status ?? '';
    const k = f.properties?.feature_kind ?? '';
    return s.includes('nonspatial_citywide') || k.includes('nonspatial_or_citywide');
  });
  return isCitywide ? 'Citywide / non-spatial' : 'Map geometry pending';
}

export function filterProjects(projects, featuresByProject, state = {}) {
  const query = (state.query ?? '').trim().toLowerCase();
  const category = state.category ?? '';
  const status = state.status ?? '';
  const geometry = state.geometry ?? '';

  return projects.filter((project) => {
    if (query && !searchableText(project).includes(query)) return false;
    if (category && project.category !== category) return false;
    if (status && project.status !== status) return false;

    const features = featuresByProject?.get(project.project_id) ?? [];
    const hasMapped = features.some((f) => f.geometry !== null);
    if (geometry === 'mapped' && !hasMapped) return false;
    if (geometry === 'pending' && hasMapped) return false;
    return true;
  });
}
