import { logEvent } from 'firebase/analytics';
import { getAppAnalytics } from '../firebase';

async function track(eventName: string, params?: Record<string, string>) {
  const analytics = await getAppAnalytics();
  if (analytics) {
    logEvent(analytics, eventName, params);
  }
}

// --- Page views (auto-tracked by GA4, but useful for SPA route changes) ---
export function trackPageView(pagePath: string, pageTitle?: string) {
  track('page_view', { page_path: pagePath, page_title: pageTitle ?? '' });
}

// --- CTA clicks ---
export function trackCTAClick(ctaName: string, location?: string) {
  track('cta_click', { cta_name: ctaName, cta_location: location ?? '' });
}

// --- Name generator ---
export function trackNameSpin(resultName: string) {
  track('name_spin', { result_name: resultName });
}

export function trackNameSuggest(firstName: string, lastName: string) {
  track('name_suggest', { first_name: firstName, last_name: lastName });
}

export function trackNameRate(name: string, rating: number) {
  track('name_rate', { rated_name: name, rating: String(rating) });
}

// --- Contact / forms ---
export function trackFormSubmit(formName: string) {
  track('form_submit', { form_name: formName });
}

// --- Navigation ---
export function trackNavClick(label: string, from: string) {
  track('nav_click', { nav_label: label, from_page: from });
}

// --- External links ---
export function trackOutboundClick(url: string, label?: string) {
  track('outbound_click', { url, link_label: label ?? '' });
}
