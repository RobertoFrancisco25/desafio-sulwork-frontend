describe('Teste de Componentes Angular', () => {
    it('deve interagir com formulários Angular', () => {
      cy.visit('/itens');
  
      cy.get('[data-cy="input-data"]').type('2024-01-20');
      cy.get('[data-cy="input-data"]').should('have.value', '2024-01-20');
  
      cy.get('[data-cy="btn-criar"]').click();
      cy.get('[data-cy="erro-validacao"]')
        .should('be.visible')
        .and('contain', 'Campo obrigatório');
    });
  
    it('deve testar *ngFor e *ngIf', () => {
      cy.visit('/cafes');
  
      cy.get('[data-cy="lista-cafes"]').find('tr').should('have.length.gt', 0);
  
      cy.get('[data-cy="lista-vazia"]').should('not.exist');
    });
  });