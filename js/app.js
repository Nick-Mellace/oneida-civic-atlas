import { loadAtlasData } from './data.js';
import { filterProjects } from './filters.js';
import { projectCardHTML, projectDetailHTML } from './render.js';
import { createAtlasMap } from './map.js';

const els = {
  search: document.querySelector('#search-input'),
  category: document.querySelector('#category-filter'),
  status: document.querySelector('#status-filter'),
  geometry: document.querySelector('#geometry-filter'),
  clear: document.querySelector('#clear-filters'),
  list: document.querySelector('#project-list'),
  count: document.querySelector('#result-count'),
  error: document.querySelector('#data-error'),
  detailPanel: document.querySelector('#detail-panel'),
  detailContent: document.querySelector('#detail-content'),
  scrim: document.querySelector('#detail-scrim'),
  fit: document.querySelector('#fit-map-button'),
  methodology: document.querySelector('#methodology-dialog'),
  methodologyButton: document.querySelector('#methodology-button'),
  methodologyClose: document.querySelector('#close-methodology'),
  tabs: [...document.querySelectorAll('.tab-button')],
};

const state = { query:'', category:'', status:'', geometry:'', selectedProjectId:null, activeView:'explore' };
let atlas;
let mapController;

function options(values) {
  return [...new Set(values.filter(Boolean))].sort((a,b) => a.localeCompare(b));
}

function populateFilters() {
  for (const category of options(atlas.projects.map(p => p.category))) {
    els.category.insertAdjacentHTML('beforeend', `<option value="${escapeAttr(category)}">${escapeText(category)}</option>`);
  }
  for (const status of options(atlas.projects.map(p => p.status))) {
    els.status.insertAdjacentHTML('beforeend', `<option value="${escapeAttr(status)}">${escapeText(status)}</option>`);
  }
}

function currentProjects() {
  return filterProjects(atlas.projects, atlas.featuresByProject, state);
}

function render() {
  const projects = currentProjects();
  els.count.textContent = `${projects.length} of ${atlas.projects.length}`;
  els.list.innerHTML = projects.map(p => projectCardHTML(p, atlas.featuresByProject.get(p.project_id) ?? [])).join('') || '<p class="fine-print">No projects match those filters.</p>';
  bindCards();

  const visibleIds = new Set(projects.map(p => p.project_id));
  mapController.setFeatures(atlas.mapFeatures.filter(f => visibleIds.has(f.properties.project_id)));
}

function bindCards() {
  for (const card of els.list.querySelectorAll('.project-card')) {
    const open = () => openProject(card.dataset.projectId);
    card.addEventListener('click', open);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
    });
  }
}

function openProject(projectId) {
  const project = atlas.projectById.get(projectId);
  if (!project) return;
  state.selectedProjectId = projectId;
  const features = atlas.featuresByProject.get(projectId) ?? [];
  els.detailContent.innerHTML = projectDetailHTML(project, features);
  els.detailPanel.classList.add('open');
  els.detailPanel.setAttribute('aria-hidden', 'false');
  els.scrim.hidden = false;
  document.body.style.overflow = 'hidden';
  els.detailContent.querySelector('#close-detail')?.addEventListener('click', closeDetail);
  mapController.focusProject(projectId);
  requestAnimationFrame(() => els.detailContent.querySelector('#close-detail')?.focus());
}

function closeDetail() {
  els.detailPanel.classList.remove('open');
  els.detailPanel.setAttribute('aria-hidden', 'true');
  els.scrim.hidden = true;
  document.body.style.overflow = '';
  state.selectedProjectId = null;
}

function bindControls() {
  els.search.addEventListener('input', (e) => { state.query = e.target.value; render(); });
  els.category.addEventListener('change', (e) => { state.category = e.target.value; render(); });
  els.status.addEventListener('change', (e) => { state.status = e.target.value; render(); });
  els.geometry.addEventListener('change', (e) => { state.geometry = e.target.value; render(); });
  els.clear.addEventListener('click', () => {
    Object.assign(state, {query:'',category:'',status:'',geometry:''});
    els.search.value = ''; els.category.value = ''; els.status.value = ''; els.geometry.value = '';
    render();
  });
  els.scrim.addEventListener('click', closeDetail);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (els.detailPanel.classList.contains('open')) closeDetail();
      else if (els.methodology.open) els.methodology.close();
    }
  });
  els.fit.addEventListener('click', () => mapController.fitVerified());
  els.methodologyButton.addEventListener('click', () => els.methodology.showModal());
  els.methodologyClose.addEventListener('click', () => els.methodology.close());

  for (const tab of els.tabs) {
    tab.addEventListener('click', () => setView(tab.dataset.view));
  }
}

function setView(view) {
  state.activeView = view;
  document.body.classList.toggle('projects-only', view === 'projects');
  for (const tab of els.tabs) {
    const active = tab.dataset.view === view;
    tab.classList.toggle('active', active);
    tab.setAttribute('aria-pressed', String(active));
  }
  setTimeout(() => mapController.invalidate(), 0);
}

function showFatal(error) {
  console.error(error);
  els.error.hidden = false;
  els.error.textContent = `The Atlas could not load its verified dataset: ${error.message}`;
  els.count.textContent = 'Data unavailable';
}

function escapeText(v) { return String(v).replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c])); }
function escapeAttr(v) { return escapeText(v).replaceAll('"', '&quot;'); }

try {
  atlas = await loadAtlasData();
  mapController = createAtlasMap('map', openProject);
  populateFilters();
  bindControls();
  render();
  mapController.fitVerified();
} catch (error) {
  showFatal(error);
}
