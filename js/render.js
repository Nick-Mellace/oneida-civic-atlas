import { getGeometryLabel } from './filters.js';

export function escapeHTML(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function formatMoney(value) {
  if (value === null || value === undefined || value === '') return 'Not established';
  return new Intl.NumberFormat('en-US', { style:'currency', currency:'USD', maximumFractionDigits:0 }).format(value);
}

function cleanUrl(url) {
  try {
    const u = new URL(url);
    return u.protocol === 'http:' || u.protocol === 'https:' ? u.href : null;
  } catch { return null; }
}

export function sourceLinks(sourceUrls) {
  if (!sourceUrls) return [];
  return sourceUrls.split('|').map(s => s.trim()).filter(Boolean).map((url, i) => ({
    label: `Source ${i + 1}`,
    url: cleanUrl(url)
  })).filter(x => x.url);
}

function textOrUnknown(value, fallback='Not established in reviewed records') {
  return value ? escapeHTML(value) : fallback;
}

function factRow(label, value) {
  return `<div class="fact-row"><dt>${escapeHTML(label)}</dt><dd>${value}</dd></div>`;
}

export function projectCardHTML(project, features=[]) {
  const geometry = getGeometryLabel(features);
  const mappedClass = geometry === 'Verified on map' ? 'mapped' : 'pending';
  return `
    <article class="project-card" data-project-id="${escapeHTML(project.project_id)}" tabindex="0" role="button" aria-label="Open ${escapeHTML(project.project_name)}">
      <div class="card-topline">
        <span class="status-pill">${escapeHTML(project.status ?? 'UNKNOWN')}</span>
        <span class="geometry-pill ${mappedClass}">${escapeHTML(geometry)}</span>
      </div>
      <h3>${escapeHTML(project.project_name)}</h3>
      <p class="card-category">${escapeHTML(project.category ?? 'Uncategorized')}</p>
      <p class="card-summary">${textOrUnknown(project.status_reason, 'Status explanation unavailable.')}</p>
      <div class="card-meta">
        <span>Research: ${escapeHTML(project.confidence ?? 'UNKNOWN')}</span>
        <span>Geography: ${escapeHTML(project.geo_confidence ?? 'PENDING')}</span>
      </div>
      <p class="next-step"><strong>Next:</strong> ${textOrUnknown(project.next_milestone, 'No next milestone established.')}</p>
    </article>`;
}

export function projectDetailHTML(project, features=[]) {
  const links = sourceLinks(project.source_urls);
  const sourceMarkup = links.length ? links.map(({label,url}) => `<li><a href="${escapeHTML(url)}" target="_blank" rel="noopener">${escapeHTML(label)}</a></li>`).join('') : '<li>No source link is stored for this record.</li>';
  const addresses = [...new Set(features.map(f => f.properties?.address).filter(Boolean))];
  const geometry = getGeometryLabel(features);
  const mappedFeatures = features.filter(f => f.geometry !== null).length;
  const location = addresses.length ? addresses.map(escapeHTML).join('<br>') : textOrUnknown(project.verified_location, 'Location not established.');

  return `
    <div class="detail-header">
      <div>
        <p class="eyebrow">${escapeHTML(project.project_id)} · ${escapeHTML(project.category ?? '')}</p>
        <h2 id="detail-title">${escapeHTML(project.project_name)}</h2>
      </div>
      <button class="icon-button" id="close-detail" aria-label="Close project details">×</button>
    </div>
    <div class="detail-badges">
      <span class="status-pill">${escapeHTML(project.status ?? 'UNKNOWN')}</span>
      <span class="geometry-pill ${geometry === 'Verified on map' ? 'mapped' : 'pending'}">${escapeHTML(geometry)}</span>
    </div>
    <section class="detail-section">
      <h3>Current status</h3>
      <p>${textOrUnknown(project.status_reason, 'No status rationale is stored.')}</p>
    </section>
    <section class="detail-section">
      <h3>Where and who</h3>
      <dl class="facts">
        ${factRow('Location', location)}
        ${factRow('Ward', textOrUnknown(project.ward, 'Ward assignment pending authoritative spatial join'))}
        ${factRow('Jurisdiction', textOrUnknown(project.jurisdiction))}
        ${factRow('Lead entity', textOrUnknown(project.lead_entity))}
        ${factRow('Mapped features', escapeHTML(mappedFeatures))}
      </dl>
    </section>
    <section class="detail-section">
      <h3>Money</h3>
      <dl class="facts">
        ${factRow('Estimated cost', escapeHTML(formatMoney(project.estimated_cost)))}
        ${factRow('Committed funding', escapeHTML(formatMoney(project.committed_funding)))}
        ${factRow('Funding sources', textOrUnknown(project.funding_sources))}
      </dl>
      <p class="fine-print">Committed funding is not the same as actual spending.</p>
    </section>
    <section class="detail-section">
      <h3>What happens next</h3>
      <p>${textOrUnknown(project.next_milestone, 'No next milestone established in reviewed records.')}</p>
    </section>
    <section class="detail-grid">
      <div><h3>Blockers / dependencies</h3><p>${textOrUnknown(project.blockers)}</p></div>
      <div><h3>Public concerns</h3><p>${textOrUnknown(project.public_concerns, 'No recurring public concern is recorded in this dataset.')}</p></div>
      <div><h3>Government response</h3><p>${textOrUnknown(project.government_response)}</p></div>
      <div><h3>How to follow this</h3><p>${textOrUnknown(project.civic_opportunity)}</p></div>
    </section>
    <section class="detail-section open-question">
      <h3>Open questions</h3>
      <p>${textOrUnknown(project.open_questions, 'No open research question is stored.')}</p>
    </section>
    <section class="detail-section">
      <h3>Confidence & verification</h3>
      <dl class="facts">
        ${factRow('Research confidence', escapeHTML(project.confidence ?? 'UNKNOWN'))}
        ${factRow('Geographic confidence', escapeHTML(project.geo_confidence ?? 'PENDING'))}
        ${factRow('Last verified', escapeHTML(project.last_verified_date ?? 'Unknown'))}
      </dl>
    </section>
    <details class="sources-drawer">
      <summary>Sources & evidence (${links.length})</summary>
      <ul>${sourceMarkup}</ul>
    </details>`;
}
