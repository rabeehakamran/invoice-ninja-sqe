describe("Form 9: Credits Module Automation", () => {

    // 1. Handle Uncaught Exceptions
    Cypress.on('uncaught:exception', (err, runnable) => {
        return false;
    });

    // 2. Handle "Leave Site" Alerts (FIX FOR YOUR ISSUE)
    // This automatically accepts the "Unsaved changes" popup
    beforeEach(() => {
        cy.on('window:confirm', () => true);
        cy.on('window:alert', () => true);
        
        // Log in before every test
        login("heenuworld@gmail.com", "12345678"); 
    });

    const login = (email, password) => {
        // Reduced wait times and added checks
        cy.visit("/", { failOnStatusCode: false });
        cy.viewport(1280, 720);
        
        // Wait for input to be visible instead of hard wait
        cy.get('input', { timeout: 20000 }).should('be.visible'); 

        cy.get('input').eq(0).clear({force: true}).type(email, {force: true});
        cy.get('input').eq(1).clear({force: true}).type(password, {force: true});
        cy.contains('button', 'Login').click({force: true});
        
        // Wait for dashboard to load
        cy.url().should('not.include', '/login');
        cy.wait(5000); 
    };

    const fillCreditForm = (client, creditDate, validUntil, cost, discount) => {
        cy.visit('/#/credits/create');
        // Wait for the form to actually load
        cy.get('input').should('have.length.gt', 2); 

        // 1. Client
      // 1. Client (FIXED WITH DELAY)
   if (client !== null) {
        cy.get('body').then(($body) => {
            const index = $body.find('input[aria-label="Search"]').length > 0 ? 1 : 0;
            
            cy.get('input').eq(index).click({force: true});
            cy.wait(1000);
            cy.get('input').eq(index).type("T", {force: true, delay: 200});
            cy.wait(4000); 
            
            cy.get('input').eq(index).type('{downarrow}', {force: true});
            cy.wait(500);
            cy.get('input').eq(index).type('{enter}', {force: true});
        });
    }

        // 2. Dates
        if (creditDate !== null) {
            cy.get('input').eq(2).clear({force: true}).type(creditDate, {force: true});
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
            cy.get('input').last().clear({force: true}).type(cost, {force: true});
        }

        cy.contains('button', 'Save').click({force: true});
    };


    it("TC-01: Create Credit with Valid Details (Valid)", () => {
        fillCreditForm("Tech", null, null, "100", null);
        cy.contains(/created|updated|Credit/i, {timeout: 10000}).should('exist');
    });

   

    it("TC-02: Verify Negative Unit Cost (Bug Verification)", () => {
        fillCreditForm("Tech", null, null, "-500", null);
        cy.contains(/positive/i).should('exist');
    });

    it("TC-03: Verify Save without Items (Valid)", () => {
        fillCreditForm("Tech", null, null, null, null);
        cy.contains(/created|updated/i, {timeout: 10000}).should('exist');
    });

    it("TC-04: Verify 'Valid Until' Date Logic (Valid)", () => {
        fillCreditForm("Tech", "12/01/2025", "11/11/2023", "100", null);
        cy.contains(/date must be a date after/i).should('exist');
    });

});