describe('Login & Registro flow', () => {

  it('should show login form and reject bad creds', () => {
    cy.visit('/login');

    cy.get('input[formControlName="email"]').type('no@user.test');
    cy.get('input[formControlName="password"]').type('badpassword');
    cy.contains('Entrar').click();

    // Busca el Swal de error que aparece al credenciales malas
    cy.contains('Credenciales incorrectas', { timeout: 5000 }).should('exist');
  });

  it('should allow user to register then login', () => {
    const email = `e2e_${Date.now()}@mail.test`;

    // Registro
    cy.visit('/register');
    cy.get('input[formControlName="nombre"]').type('E2E User');
    cy.get('input[formControlName="telefono"]').type('55500000');
    cy.get('input[formControlName="email"]').type(email);
    cy.get('input[formControlName="password"]').type('P4ssw0rd!');
    cy.contains('Registrarse').click();

    // Espera el Swal de éxito
    cy.contains('Registro exitoso', { timeout: 5000 }).should('exist');

    // Login con el usuario recién creado
    cy.visit('/login');
    cy.get('input[formControlName="email"]').type(email);
    cy.get('input[formControlName="password"]').type('P4ssw0rd!');
    cy.contains('Entrar').click();

    // Asegura que no estamos más en /login
    cy.url().should('not.include', '/login');
  });

});
