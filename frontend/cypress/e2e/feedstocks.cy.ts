import { Feedstock } from './types';

describe('Feedstocks', () => {
  it('lists feedstocks and allows creating a new one', () => {
    let feedstocks: Feedstock[] = [
      {
        id: 1,
        name: 'Carvalho Americano',
        feedstockCode: 'F-001',
        unitOfMeasure: 'KG',
        stock: 10,
        products: [],
      },
    ];

    const replyPage0 = () => ({ items: feedstocks, total: feedstocks.length });

    cy.intercept('GET', '**/feedstocks*', (req) => {
      req.reply(replyPage0());
    }).as('getFeedstocks');

    cy.intercept('POST', '**/feedstocks', (req) => {
      const body = req.body as { name: string; feedstockCode: string; stock: number; unitOfMeasure: string };
      const created: Feedstock = {
        id: 99,
        name: body.name,
        feedstockCode: body.feedstockCode,
        unitOfMeasure: body.unitOfMeasure,
        stock: body.stock,
        products: [],
      };

      feedstocks = [created, ...feedstocks];
      req.reply(created);
    }).as('createFeedstock');

    cy.visit('/materias-primas');
    cy.wait('@getFeedstocks');

    cy.contains('Matérias-Primas').should('be.visible');
    cy.contains('Carvalho Americano').should('be.visible');
    cy.contains('F-001').should('be.visible');

    cy.contains('Novo Material').click();
    cy.contains('Nova Matéria-Prima').should('be.visible');

    cy.get('input[placeholder="Ex: Carvalho Americano"]').type('Aço Inox');
    cy.get('input[placeholder="F-001"]').type('F-002');
    cy.get('select').first().select('Unidade (UN)');
    cy.get('input[placeholder="0.0000"]').type('25');

    cy.contains('Salvar Material').click();
    cy.wait('@createFeedstock');

    cy.wait('@getFeedstocks');

    cy.contains('Aço Inox').should('be.visible');
    cy.contains('F-002').should('be.visible');
  });

  it('blocks deletion when feedstock is in use (safety lock)', () => {
    const locked: Feedstock = {
      id: 10,
      name: 'Tecido Linho',
      feedstockCode: 'F-010',
      unitOfMeasure: 'M',
      stock: 100,
      products: [{ id: 1 }],
    };

    cy.intercept('GET', '**/feedstocks*', { items: [locked], total: 1 }).as('getFeedstocks');

    let alertText = '';
    cy.on('window:alert', (txt) => {
      alertText = String(txt);
      return true;
    });

    cy.visit('/materias-primas');
    cy.wait('@getFeedstocks');

    cy.get('button[title="Excluir"]').click({ force: true });

    cy.wrap(null).then(() => {
      expect(alertText).to.contain('TRAVA DE SEGURANÇA');
      expect(alertText).to.contain('Não é possível excluir');
    });
  });

  it('deletes a feedstock when allowed', () => {
    const fs: Feedstock = {
      id: 2,
      name: 'Espuma D28',
      feedstockCode: 'F-020',
      unitOfMeasure: 'UN',
      stock: 50,
      products: [],
    };

    cy.intercept('GET', '**/feedstocks*', { items: [fs], total: 1 }).as('getFeedstocks');
    cy.intercept('DELETE', '**/feedstocks/2', { statusCode: 204, body: {} }).as('deleteFeedstock');

    cy.on('window:confirm', () => true);

    cy.visit('/materias-primas');
    cy.wait('@getFeedstocks');

    cy.get('button[title="Excluir"]').click({ force: true });
    cy.wait('@deleteFeedstock');
  });
});
