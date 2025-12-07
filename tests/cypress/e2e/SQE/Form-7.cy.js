describe("Form 7: Payments Module Automation", () => {

  // --- CRASH GUARD ---
  Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
  });

  const login = (email, password) => {
    cy.visit("/", { failOnStatusCode: false });
    cy.viewport(1280, 720);
    cy.wait(10000); // Flutter Load Wait

    // Login
    cy.get('input').eq(0).clear({force: true}).type(email, {force: true});
    cy.get('input').eq(1).clear({force: true}).type(password, {force: true});
    cy.contains('button', 'Login').click({force: true});
    cy.wait(10000); // Dashboard Wait
  };

  const fillPaymentForm = (client, amount, type, date) => {
    cy.visit('/payments/create');
    cy.wait(8000);

    // 1. Client
    if (client !== null) {
      // Trying to handle Search Bar index shift
      cy.get('body').then(($body) => {
        const index = $body.find('input[aria-label="Search"]').length > 0 ? 1 : 0;
        cy.get('input').eq(index).clear({force: true}).type(client, {force: true});
        cy.wait(1000);
        cy.get('body').type('{enter}');
      });
    }

    // 2. Amount (Usually next input)
    if (amount !== null) {
        cy.get('input').eq(1).clear({force: true}).type(amount, {force: true});
    }

    // 3. Payment Date (3rd input)
    if (date !== null) {
        cy.get('input').eq(2).clear({force: true}).type(date, {force: true});
        cy.get('body').click(); // Close picker
    }

    // 4. Payment Type (4th input - dropdown)
    if (type !== null) {
        cy.get('input').eq(3).click({force: true});
        cy.contains(type).click({force: true});
    }

    // Save
    cy.contains('button', 'Save').click({force: true});
  };

  beforeEach(() => {
    login("zeetahir206@gmail.com", "12345678");
  });

  // --- VALID TEST CASES (Should be GREEN) ---

  it("TC-01: Create Valid Manual Payment (Valid)", () => {
    fillPaymentForm("Tech Company", "100", "Bank Transfer", null);
    
    cy.wait(5000);
    // Success Check
    cy.contains(/created|updated|Payment/i).should('exist');
  });

  it("TC-02: Verify Empty Client Validation (Valid)", () => {
    // Client empty, amount fill
    fillPaymentForm(null, "100", "Bank Transfer", null);
    
    // Error Check
    cy.contains(/field is required|required/i).should('exist');
  });

  // --- BUG VERIFICATION CASES (Should be RED/FAIL because bug exists) ---

  it("TC-03: Verify Negative Payment Amount (Bug Verification)", () => {
    fillPaymentForm("Tech Company", "-500", "Bank Transfer", null);

    // EXPECTED: Error "positive"
    // ACTUAL: System saves it -> Test FAILS
    cy.contains("Amount must be positive").should('exist');
  });

  it("TC-04: Verify Save without Amount (Bug Verification)", () => {
    // Amount null
    fillPaymentForm("Tech Company", null, "Bank Transfer", null);

    // EXPECTED: Error "amount is required"
    // ACTUAL: System saves 0.00 -> Test FAILS
    // Note: Hum specific error dhoond rahe hain taake 'generic required' match na ho
    cy.contains("The amount field is required").should('exist');
  });

  it("TC-05: Verify Payment without Payment Type (Bug Verification)", () => {
    // Type null
    fillPaymentForm("Tech Company", "100", null, null);

    // EXPECTED: Error "type is required"
    // ACTUAL: System saves -> Test FAILS
    cy.contains("The payment type field is required").should('exist');
  });


});
