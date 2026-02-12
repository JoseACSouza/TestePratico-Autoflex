import { Feedstock, Product } from './types';

describe('Products', () => {
  it('lists products and allows creating a new one', () => {
    let products: Product[] = [
      {
        id: 1,
        name: 'Mesa de Centro',
        productCode: 'P001',
        unitPrice: 799.9,
        feedstocks: [{ id: 10, name: 'Carvalho Americano', quantity: 2, stock: 10 }],
      },
    ];

    const feedstocks: Feedstock[] = [
      { id: 10, name: 'Carvalho Americano', unitOfMeasure: 'KG', stock: 10, feedstockCode: 'F-050' },
      { id: 11, name: 'Aço Inox', unitOfMeasure: 'UN', stock: 100, feedstockCode: 'F-030' },
    ];

    const replyProducts = () => ({ items: products, total: products.length });

    cy.intercept('GET', '**/products*', (req) => {
      req.reply(replyProducts());
    }).as('getProducts');

    cy.intercept({ method: 'GET', url: '**/*' }, (req) => {
      if (/feedstocks|materias-primas|materials/i.test(req.url)) {
        req.reply({
          items: feedstocks,
          total: feedstocks.length,
          content: feedstocks,
          totalElements: feedstocks.length,
        });
      }
    }).as('getFeedstocks');

    cy.intercept('POST', '**/products', (req) => {
      const body = req.body as {
        name: string;
        productCode: string;
        unitPrice: number;
        feedstocks: Array<{ feedstockId: number; quantity: number }>;
      };

      const created: Product = {
        id: 99,
        name: body.name,
        productCode: body.productCode,
        unitPrice: body.unitPrice,
        feedstocks: body.feedstocks.map((i) => {
          const fs = feedstocks.find((f) => f.id === i.feedstockId)!;
          return { id: fs.id, name: fs.name, quantity: i.quantity, stock: fs.stock };
        }),
      };

      products = [created, ...products];
      req.reply(created);
    }).as('createProduct');

    cy.visit('/produtos');
    cy.wait('@getProducts');

    cy.contains('Catálogo de Produtos').should('be.visible');
    cy.contains('Mesa de Centro').should('be.visible');
    cy.contains('P001').should('be.visible');

    cy.contains('Novo Produto').click();
    cy.contains('Novo Produto').should('be.visible');
    cy.wait('@getFeedstocks');

    cy.get('input[placeholder="Ex: Poltrona de Couro Legítimo"]').type('Poltrona Premium');
    cy.get('input[placeholder="P001"]').type('P999');
    cy.get('input[type="number"]').first().clear().type('1499.90');

    cy.contains('h2', 'Novo Produto')
      .should('be.visible')
      .closest('div.p-8')
      .within(() => {
        cy.get('select')
          .should('have.length', 1)
          .should('be.visible')
          .and('not.be.disabled')
          .find('option[value="11"]', { timeout: 15000 })
          .should('exist');

        cy.get('select').select('11');

        cy.get('input[placeholder="Qtd"]').clear().type('4');
        cy.get('input[placeholder="Qtd"]').parent().find('button[type="button"]').click();
      });

    cy.contains('Aço Inox').should('be.visible');

    cy.contains('Criar Produto').click();
    cy.wait('@createProduct');
    cy.wait('@getProducts');

    cy.contains('Poltrona Premium').should('be.visible');
    cy.contains('P999').should('be.visible');
  });

  it('deletes a product when confirmed', () => {
    const products: Product[] = [
      {
        id: 2,
        name: 'Cadeira',
        productCode: 'P002',
        unitPrice: 199.9,
        feedstocks: [{ id: 10, name: 'Carvalho Americano', quantity: 1, stock: 10 }],
      },
    ];

    cy.intercept('GET', '**/products*', { items: products, total: 1 }).as('getProducts');
    cy.intercept('DELETE', '**/products/2', { statusCode: 204, body: {} }).as('deleteProduct');

    cy.on('window:confirm', () => true);

    cy.visit('/produtos');
    cy.wait('@getProducts');

    cy.get('button[title="Excluir"]').click({ force: true });
    cy.wait('@deleteProduct');
  });
});
