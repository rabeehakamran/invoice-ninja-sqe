describe("Form 1: Registration Module (Live Site)", () => {

  // Crash Guard
  Cypress.on('uncaught:exception', (err, runnable) => { return false; });

  const fillRegistrationForm = (email, password, confirmPass) => {
    // Email
    if (email) cy.get('input').eq(0).clear({force: true}).type(email, {force: true});
    // Password
    if (password) cy.get('input').eq(1).clear({force: true}).type(password, {force: true});
    // Confirm Password
    if (confirmPass) cy.get('input').eq(2).clear({force: true}).type(confirmPass, {force: true});
    
    // Checkbox
    cy.get('body').then(($body) => {
        if ($body.find('input[type="checkbox"]').length > 0) {
           cy.get('input[type="checkbox"]').check({force: true});
        }
    });

    // Register Button
    cy.contains('button', 'Register').click({force: true});
  };

  beforeEach(() => {
    // Live site visit
    cy.visit("/register", { failOnStatusCode: false });
    cy.wait(8000); // Flutter Load Wait
    cy.get('input', {timeout: 40000}).should('exist');
  });

  it("TC-01: Verify Successful Registration (Valid)", () => {
    const randomEmail = `live_test_${Math.floor(Math.random() * 999999)}@example.com`;
    fillRegistrationForm(randomEmail, "Password123!", "Password123!");
    cy.wait(5000);
    cy.url().should('not.include', '/register');
  });

  it("TC-02: Verify Empty Fields Validation (Invalid)", () => {
    cy.contains('button', 'Register').click({force: true});
    cy.contains(/field is required|required/i).should('exist');
  });

  // Baaki tests same logic par...
  it("TC-03: Password Mismatch", () => {
    fillRegistrationForm("mismatch@test.com", "Pass123", "WrongPass");
    cy.contains(/match/i).should('exist');
  });

  it("TC-04: Invalid Email", () => {
    fillRegistrationForm("invalid-email", "Pass123", "Pass123");
    cy.contains(/valid/i).should('exist');
  });

  it("TC-05: Short Password", () => {
    fillRegistrationForm("short@test.com", "123", "123");
    cy.contains(/password/i).should('exist');
  });

  it("TC-06: Existing Email", () => {
    // Live site par koi bhi registered email daal do check karne ke liye
    fillRegistrationForm("zeetahir206@gmail.com", "Pass123", "Pass123");
    cy.contains(/taken|already/i).should('exist');
  });
});
