// Loaded automatically before your test files.
// https://docs.cypress.io/guides/core-concepts/writing-and-organizing-tests#Support-file

// If you want to add custom commands, put them in ./commands.ts and import here.
import './commands';

// Make alerts and confirms deterministic.
Cypress.on('window:alert', () => true);
Cypress.on('window:confirm', () => true);
