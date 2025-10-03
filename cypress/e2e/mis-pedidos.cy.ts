describe('MisPedidosComponent', () => {

  beforeEach(() => {
    // Esto depende de tu routing, ajusta el path:
    cy.visit('/dashboard/mis-pedidos');
  });

  it('debe mostrar mensaje cuando no hay pedidos', () => {
    // Limpiar token y simular no pedidos
    window.localStorage.setItem('token', 'fake-token');
    cy.intercept('GET', '**/mis-pedidos', []).as('getPedidosVacio');

    cy.reload();
    cy.wait('@getPedidosVacio');

    cy.contains('No tienes pedidos todavía.').should('be.visible');
  });

  it('debe listar pedidos en la tabla', () => {
    window.localStorage.setItem('token', 'fake-token');
    cy.intercept('GET', '**/mis-pedidos', [
      {
        id_pedido: 1,
        id_envio: 10,
        estado: 'En camino',
        costo: 50,
        fecha_asignacion: '2025-09-01T12:00:00Z',
        paquete: 'Caja pequeña',
        origen: 'Guatemala',
        destino: 'Antigua'
      }
    ]).as('getPedidos');

    cy.reload();
    cy.wait('@getPedidos');

    cy.get('table').should('contain', 'Caja pequeña');
    cy.get('table').should('contain', 'Guatemala');
    cy.get('table').should('contain', 'Antigua');
    cy.get('table').should('contain', 'En camino');
  });

  it('debe navegar al hacer click en Ver mapa', () => {
    window.localStorage.setItem('token', 'fake-token');
    cy.intercept('GET', '**/mis-pedidos', [
      {
        id_pedido: 2,
        id_envio: 99,
        estado: 'Entregado',
        costo: 100,
        fecha_asignacion: '2025-09-01T12:00:00Z',
        paquete: 'Laptop',
        origen: 'Mixco',
        destino: 'Quetzaltenango'
      }
    ]).as('getPedidos');

    cy.reload();
    cy.wait('@getPedidos');

    cy.contains('Ver mapa').click();

    cy.url().should('include', '/dashboard/seguimiento/99');
  });
});
