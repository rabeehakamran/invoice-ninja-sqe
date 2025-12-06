describe("Form 7: Payments Module Automation", () => {

  // --- CRASH GUARD (WASM Error Fix) ---
  // Yeh code zaroori hai taake demo site crash hone par bhi test chalta rahe
  Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
  });

  const login = (email, password) => {
    // Fail status code (403/500) ko ignore karo
    cy.visit("/", { failOnStatusCode: false });
    cy.viewport(1280, 720);
    
    // Flutter Load Wait (Bohot Zaroori)
    cy.wait(15000);

    // Login Steps
    cy.get('input').eq(0).clear({force: true}).type(email, {force: true});
    cy.get('input').eq(1).clear({force: true}).type(password, {force: true});
    cy.contains('button', 'Login').click({force: true});
    
    cy.wait(15000); // Dashboard Load Wait
  };

  const fillPaymentForm = (client, amount, type, date) => {
    cy.visit('/#/payments/create');
    cy.wait(10000); // Form Load Wait

    // 1. Client
    if (client !== null) {
      cy.get('body').then(($body) => {
        // Search bar adjustment
        const index = $body.find('input[aria-label="Search"]').length > 0 ? 1 : 0;
        cy.get('input').eq(index).clear({force: true}).type(client, {force: true});
        cy.wait(2000);
        cy.get('body').type('{enter}');
      });
    }

    // 2. Amount
    if (amount !== null) {
        cy.get('input').eq(1).clear({force: true}).type(amount, {force: true});
    }

    // 3. Payment Date
    if (date !== null) {
        cy.get('input').eq(2).clear({force: true}).type(date, {force: true});
        cy.get('body').click();
    }

    // 4. Payment Type
    if (type !== null) {
        cy.get('input').eq(3).click({force: true});
        cy.contains(type).click({force: true});
    }

    // Save Button
    cy.contains('button', 'Save').click({force: true});
  };

  beforeEach(() => {
    // Demo Site Credentials (Live credentials demo par nahi chalenge)
    login("zeetahir206@gmail.com", "12345678");
  });



  // --- BUG VERIFICATION CASES (RED / FAIL) ---

  it("TC-03: Verify Negative Payment Amount (Bug Verification)", () => {
    fillPaymentForm("Tech Company", "-500", "Bank Transfer", null);
    // FAIL hoga (Red) kyunke system error nahi deta
    cy.contains("Amount must be positive").should('exist');
  });

  it("TC-04: Verify Save without Amount (Bug Verification)", () => {
    fillPaymentForm("Tech Company", null, "Bank Transfer", null);
    // FAIL hoga (Red) kyunke system error nahi deta
    cy.contains("The amount field is required").should('exist');
  });

  it("TC-05: Verify Payment without Payment Type (Bug Verification)", () => {
    fillPaymentForm("Tech Company", "100", null, null);
    // FAIL hoga (Red) kyunke system error nahi deta
    cy.contains("The payment type field is required").should('exist');
  });

});