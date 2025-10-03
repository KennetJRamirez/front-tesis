describe('Seguridad UI', () => {
  it('no debe mostrar stacktrace en errores HTTP', () => {
    cy.request({
      url: 'http://localhost:3000/ruta-que-no-existe',
      failOnStatusCode: false
    }).then(res => {
      expect(res.status).to.eq(404);
      expect(JSON.stringify(res.body)).to.not.match(/\bat\s+[\w_.]+\s+\(/);
    });
  });
});
