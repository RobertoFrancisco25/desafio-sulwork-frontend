// cypress/e2e/cafe-manha.cy.ts

describe('Sistema de Café da Manhã - Angular', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('deve navegar entre as páginas', () => {
    // SOLUÇÃO 1: Usar texto visível
    cy.contains('Dashboard').click();
    cy.url().should('include', '/');
    
    cy.contains('Cafés').click();
    cy.url().should('include', '/cafes');
    
    cy.contains('Itens').click();
    cy.url().should('include', '/itens');
   
    cy.contains('Colaboradores').click();
    cy.url().should('include', '/colaboradores');

    
  });

  it('deve verificar se a aplicação carregou', () => {
    // Verificar elementos básicos da aplicação
    cy.get('app-root').should('exist');
    cy.get('nav').should('be.visible');
  });
});