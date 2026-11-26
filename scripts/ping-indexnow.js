import { SITE_CONFIG } from '../src/config.js';
import { ROUTES, getAbsoluteUrl } from '../src/data/routes.js';

/**
 * Zero-dependency IndexNow submission script for CalcLedger.
 * Notifies Bing, ChatGPT Search (via Bing), Yandex, Seznam, Naver, and Yep.
 *
 * Usage:
 *   npm run ping-indexnow                    # Submit all canonical URLs
 *   npm run ping-indexnow -- --dry-run       # Preview payload without sending
 *   npm run ping-indexnow -- /pl/ /loan-mortgage-calculator/
 */

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const customArgs = args.filter((a) => !a.startsWith('--'));

if (!SITE_CONFIG.indexNowKey) {
  console.error('ERROR: SITE_CONFIG.indexNowKey is not set in src/config.js.');
  process.exit(1);
}

let urlList = [];
if (customArgs.length > 0) {
  urlList = customArgs.map((u) => (u.startsWith('http://') || u.startsWith('https://') ? u : `${SITE_CONFIG.domain}${u.startsWith('/') ? u : `/${u}`}`));
} else {
  for (const pageKey of Object.keys(ROUTES)) {
    for (const lang of SITE_CONFIG.languages) {
      urlList.push(getAbsoluteUrl(pageKey, lang));
    }
  }
}

const payload = {
  host: SITE_CONFIG.host,
  key: SITE_CONFIG.indexNowKey,
  keyLocation: `${SITE_CONFIG.domain}/${SITE_CONFIG.indexNowKey}.txt`,
  urlList,
};

if (dryRun) {
  console.log(`IndexNow dry-run ready: ${urlList.length} URLs for ${payload.host}`);
  console.log(`Key location: ${payload.keyLocation}`);
  console.log('Sample URLs:', urlList.slice(0, 6));
  process.exit(0);
}

async function submit() {
  console.log(`Submitting ${urlList.length} URLs to IndexNow (${payload.host})...`);
  const res = await fetch('https://api.indexnow.org/IndexNow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload),
  });

  const text = await res.text().catch(() => '');
  if (res.status === 200 || res.status === 202) {
    console.log(`SUCCESS (HTTP ${res.status}): IndexNow accepted ${urlList.length} URLs.`);
  } else {
    console.error(`FAILED (HTTP ${res.status}): ${text || res.statusText}`);
    process.exit(1);
  }
}

submit().catch((err) => {
  console.error('IndexNow request failed:', err.message);
  process.exit(1);
});
