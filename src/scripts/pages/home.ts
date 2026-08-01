import { initHeroes } from '@components/Hero/Hero';
import { initNewsletterForms } from '@components/Newsletter/Newsletter';

/**
 * NOVA Theme — Home Page Script
 * Loaded only on src/views/pages/index.twig via {% block scripts %}.
 * Keep this file focused on home-page-only behavior — shared logic
 * belongs in main.ts.
 */

initHeroes();
initNewsletterForms();
