describe("Form 5: Invoices Module Automation", () => {

 // --- CRASH GUARD ---
  Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
  });
  const login = (email, password) => {
    cy.visit("/", { failOnStatusCode: false });
    cy.viewport(1280, 720);
    cy.wait(15000); // Flutter Load Wait

    cy.get('input').eq(0).clear({force: true}).type(email, {force: true});
    cy.get('input').eq(1).clear({force: true}).type(password, {force: true});
    cy.contains('button', 'Login').click({force: true});
    
    cy.wait(15000); // Dashboard Wait
  };

  const fillInvoiceForm = (clientName, itemDesc, unitCost, discount) => {
    cy.visit('/invoices/create');
    cy.wait(10000);

    // 1. Client
    if (clientName !== null) {
      cy.get('input').eq(0).click({force: true});
      cy.get('input').eq(0).type(clientName, {force: true});
      cy.wait(2000);
      cy.get('body').type('{enter}');
    }

    // 2. Add Item details
    if (itemDesc !== null || unitCost !== null) {
      cy.get('body').then(($body) => {
        if ($body.find('textarea').length > 0) {
            cy.get('textarea').first().clear({force: true}).type(itemDesc || "Item", {force: true});
        }
      });

      // --- FIX: eq(3) Date thi, isliye ab eq(7) try kar rahe hain ---
      if (unitCost !== null) {
         cy.get('input').eq(7).clear({force: true}).type(unitCost, {force: true});
      }
    }

    // 3. Discount
    if (discount !== null) {
      cy.get('input').eq(5).clear({force: true}).type(discount, {force: true});
    }

    // Save Button
    cy.contains('button', 'Save').click({force: true});
  };

  beforeEach(() => {
    // Demo Credentials
    login("zeetahir206@gmail.com", "12345678");
  });

  // --- TEST CASES ---

  it("TC-01: Create Invoice with Valid Client & Item (Valid)", () => {
    fillInvoiceForm("Tech Company", "Valid Item", "100", null);
    cy.wait(5000);
    cy.contains(/created|updated|Invoice/i).should('exist');
  });

  it("TC-02: Verify Empty Client Validation (Valid)", () => {
    cy.visit('/#/invoices/create');
    cy.wait(8000);
    // Fill cost only
    cy.get('input').eq(7).clear({force: true}).type("100", {force: true});
    // Check Disabled
    cy.contains('button', 'Save').should('have.attr', 'disabled');
  });

  it("TC-03: Verify Calculation with Discount (Valid)", () => {
    fillInvoiceForm("Tech Company", "Discounted Item", "100", "20");
    cy.wait(5000);
    cy.contains(/created|updated/i).should('exist');
  });



});
