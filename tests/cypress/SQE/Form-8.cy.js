describe("Form 8: Quotes Module Automation (Live Site)", () => {

  Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
  });

  const login = (email, password) => {
    cy.visit("/", { failOnStatusCode: false });
    cy.viewport(1280, 720);
    cy.wait(10000); 

    cy.get('input').eq(0).clear({force: true}).type(email, {force: true});
    cy.get('input').eq(1).clear({force: true}).type(password, {force: true});
    cy.contains('button', 'Login').click({force: true});
    
    // FIX: Dashboard load hone ka pakka intezar
    cy.wait(15000); 
    cy.url().should('not.include', '/login'); // Confirm login success
  };

  const fillQuoteForm = (client, quoteDate, validUntil, cost, discount) => {
    // FIX: Force visit use kar rahe hain
    cy.visit('/#/quotes/create');
    cy.wait(8000); 

    // 1. Client Selection
    if (client !== null) {
        cy.get('body').then(($body) => {
            const index = $body.find('input[aria-label="Search"]').length > 0 ? 1 : 0;
            cy.get('input').eq(index).click({force: true});
            cy.wait(1000);
            
            // Slow typing fix
            cy.get('input').eq(index).clear({force: true}).type(client, {force: true, delay: 300});
            cy.wait(5000);
            
            // Selection
            cy.get('input').eq(index).type('{downarrow}', {force: true});
            cy.wait(500);
            cy.get('input').eq(index).type('{enter}', {force: true});
        });
    }

    // 2. Dates
    if (quoteDate !== null) {
        cy.get('input').eq(2).clear({force: true}).type(quoteDate, {force: true});
        cy.get('body').click(); 
    }
    
    if (validUntil !== null) {
        cy.get('input').eq(3).clear({force: true}).type(validUntil, {force: true});
        cy.get('body').click();
    }

    // 3. Discount
    if (discount !== null) {
        cy.get('input').eq(5).clear({force: true}).type(discount, {force: true});
    }

    // 4. Item Cost 
    if (cost !== null) {
        cy.get('input').eq(7).clear({force: true}).type(cost, {force: true});
    }

    // Save
    cy.contains('button', 'Save').click({force: true});
  };

  beforeEach(() => {
    login("zeetahir206@gmail.com", "12345678");
  });

  // --- TEST CASES ---


 

  it("TC-01: Create Quote with Valid Details (Valid)", () => {
    fillQuoteForm("sqe", null, null, "100", null);
    cy.wait(8000);
    cy.url().should('not.include', '/create');
  });

  it("TC-02: Verify Empty Client Validation (Valid)", () => {
    fillQuoteForm(null, null, null, "100", null);
    cy.contains('button', 'Save').should('have.attr', 'disabled');
  });

  it("TC-03: Verify Negative Unit Cost (Bug Verification)", () => {
    fillQuoteForm("sqe", null, null, "-500", null);
    // FAIL (Red) Expected
    cy.contains(/positive/i).should('exist');
  });

 

  it("TC-04: Verify Save without Items (Valid)", () => {
    fillQuoteForm("sqe", null, null, null, null);
    cy.wait(8000);
    cy.url().should('not.include', '/create');
  });

  

});