import { SITE_CONFIG } from '../config.js';
import { getRoutePath, getAbsoluteUrl } from '../data/routes.js';
import { getI18n, escapeHtml } from '../data/i18n.js';
import {
  renderLayout,
  renderBreadcrumbs,
  buildBreadcrumbJsonLd,
} from './layout.js';

export function renderLegalPage(lang, type) {
  const t = getI18n(lang);
  const pageData = t.legal[type];
  if (!pageData) {
    throw new Error(`Unknown legal page type: ${type}`);
  }

  const breadcrumbs = [
    { label: t.common.home, href: getRoutePath('home', lang), url: getAbsoluteUrl('home', lang) },
    { label: pageData.h1, href: getRoutePath(type, lang), url: getAbsoluteUrl(type, lang) },
  ];

  let mainContentHtml = '';

  if (type === 'contact') {
    const subjectOpts = pageData.subjects
      .map((s) => `<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`)
      .join('');

    mainContentHtml = `
      <div class="contact-grid">
        <section class="legal-card">
          <h2>${escapeHtml(pageData.directHeading)}</h2>
          <p class="prose">${escapeHtml(pageData.directDesc)}</p>
          <p class="contact-email">
            <a href="mailto:${SITE_CONFIG.contactEmail}">${SITE_CONFIG.contactEmail}</a>
          </p>
          <button type="button" class="btn btn--secondary" data-copy-email="${SITE_CONFIG.contactEmail}">${escapeHtml(pageData.copyEmail)}</button>
        </section>

        <section class="legal-card">
          <h2>${escapeHtml(pageData.composerHeading)}</h2>
          <p class="prose">${escapeHtml(pageData.composerDesc)}</p>
          <form class="contact-form" id="contact-mailto-form" data-email="${SITE_CONFIG.contactEmail}">
            <div class="field">
              <label class="field__label" for="contact-subject">${escapeHtml(pageData.subjectLabel)}</label>
              <select class="input" id="contact-subject">${subjectOpts}</select>
            </div>
            <div class="field">
              <label class="field__label" for="contact-message">${escapeHtml(pageData.messageLabel)}</label>
              <textarea class="input textarea" id="contact-message" rows="5" placeholder="${escapeHtml(pageData.messagePlaceholder)}" required></textarea>
            </div>
            <button type="submit" class="btn btn--primary">${escapeHtml(pageData.sendButton)}</button>
          </form>
        </section>
      </div>
    `;
  } else {
    const sectionsHtml = pageData.sections
      .map(
        (sec) => `<section class="legal-block">
          <h2>${escapeHtml(sec.heading)}</h2>
          ${sec.paragraphs.map((p) => `<p class="prose">${escapeHtml(p)}</p>`).join('')}
        </section>`
      )
      .join('');

    const consentButton =
      type === 'privacy'
        ? `<div class="legal-actions"><button type="button" class="btn btn--secondary" data-open-consent>${escapeHtml(t.footer.cookieSettings)}</button></div>`
        : '';

    mainContentHtml = `<article class="legal-card">${sectionsHtml}${consentButton}</article>`;
  }

  const bodyHtml = `
    <div class="container page-narrow">
      ${renderBreadcrumbs(breadcrumbs)}

      <header class="page-head">
        <h1>${escapeHtml(pageData.h1)}</h1>
        <p class="page-head__sub">${escapeHtml(pageData.subtitle)}</p>
      </header>

      ${mainContentHtml}
    </div>
  `;

  return renderLayout({
    lang,
    pageKey: type,
    activeNav: type === 'about' ? 'about' : '',
    title: pageData.title,
    description: pageData.description,
    bodyHtml,
    jsonLd: [buildBreadcrumbJsonLd(breadcrumbs)],
  });
}
