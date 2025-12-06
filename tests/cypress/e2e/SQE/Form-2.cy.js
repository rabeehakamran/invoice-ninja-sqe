describe("Form 2: Login Module Automation (Live Site)", () => {

  // --- CRASH GUARD ---
  Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
  });

  const fillLoginForm = (email, password) => {
    cy.get('input').eq(0).clear({force: true}).type(email, {force: true});
    cy.get('input').eq(1).clear({force: true}).type(password, {force: true});
    cy.contains('button', 'Login').click({force: true});
  };

  beforeEach(() => {
    cy.visit("/", { failOnStatusCode: false });
    cy.wait(10000); 
    cy.get('input', {timeout: 40000}).should('exist');
  });

  // --- PASSING TEST CASES ---


   it("TC-04: Verify Invalid Email Format (Invalid) [PASS]", () => {
    // 1. Enter Invalid Email
    cy.get('input').eq(0).clear({force: true}).type("zeetahir.com", {force: true});
    cy.get('input').eq(1).clear({force: true}).type("12345678", {force: true});
    
    // 2. Click Login
    cy.contains('button', 'Login').click({force: true});

   
    cy.get('input').eq(0).then(($input) => {
        expect($input[0].checkValidity()).to.be.false;
    });
  });

  it("TC-01: Verify Successful Login (Valid) [PASS]", () => {
    fillLoginForm("zeetahir206@gmail.com", "12345678");
    cy.wait(10000);
    cy.url().should('not.include', '/login');
    cy.get('body').should('contain', 'Dashboard');
  });

  it("TC-02: Verify Login with Invalid Password (Invalid) [PASS]", () => {
    fillLoginForm("zeetahir206@gmail.com", "WrongPass123");
    cy.wait(5000);
    // Logic: Agar URL abhi bhi /login hai to Pass
    cy.url().should('include', '/login');
  });

  it("TC-03: Verify Empty Fields Validation (Invalid) [PASS]", () => {
    cy.contains('button', 'Login').click({force: true});
    cy.contains(/field is required|required/i).should('exist');
  });

  it("TC-04: Verify Invalid Email Format (Invalid) [PASS]", () => {
    // 1. Enter Invalid Email
    cy.get('input').eq(0).clear({force: true}).type("invalid-email-no-at", {force: true});
    cy.get('input').eq(1).clear({force: true}).type("12345678", {force: true});
    
    // 2. Click Login
    cy.contains('button', 'Login').click({force: true});

   
    cy.get('input').eq(0).then(($input) => {
        expect($input[0].checkValidity()).to.be.false;
    });
  });

  it("TC-05: Verify Login with Invalid 2FA Code (Invalid) [PASS]", () => {
    fillLoginForm("zeetahir206@gmail.com", "12345678");
    cy.get('body').then(($body) => {
        if ($body.find('input[type="number"]').length > 0) {
            cy.get('input[type="number"]').type("000000", {force: true}); 
            cy.contains('button', 'Login').click({force: true});
            cy.contains(/Invalid Token/i).should('exist');
        }
    });
  });

 
  it("TC-06: Verify Forgot Password Link [PASS]", () => {
    cy.contains(/Forgot your password/i).click({force: true});
    cy.wait(3000);
    cy.url().should('include', 'recover_password');
  });

});