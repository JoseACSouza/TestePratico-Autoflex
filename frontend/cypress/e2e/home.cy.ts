describe('Home', () => {
  beforeEach(() => {
    // Avoid real backend calls when navigating from Home.
    cy.intercept('GET', '**/feedstocks*', { items: [], total: 0 }).as('getFeedstocks');
    cy.intercept('GET', '**/products*', { items: [], total: 0 }).as('getProducts');
  });

  it('navigates to Feedstocks and Products pages', () => {
    cy.visit('/');

    cy.contains('Matérias-Primas').click();
    cy.location('pathname').should('eq', '/materias-primas');

    // Navbar back to home
    cy.contains('Artesano').click();
    cy.location('pathname').should('eq', '/');

    cy.contains('Produtos').click();
    cy.location('pathname').should('eq', '/produtos');
  });
});
