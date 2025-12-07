describe("Form 16: Transactions Module Automation (Dropdown Fix)", () => {

    Cypress.on('uncaught:exception', (err, runnable) => { return false; });

    beforeEach(() => {
        cy.on('window:confirm', () => true);
        cy.on('window:alert', () => true);
        
        login("najtahir75@gmail.com", "12345678");
        
        // Navigate
        cy.visit("/transactions/create");
        cy.wait(5000); 
    });

    const login = (email, password) => {
        cy.visit("https://app.invoicing.co/", { failOnStatusCode: false });
        cy.viewport(1280, 720);
        cy.wait(2000);
        cy.get('input').eq(0).clear({force: true}).type(email, {force: true});
        cy.get('input').eq(1).clear({force: true}).type(password, {force: true});
        cy.contains('button', 'Login').click({force: true});
        cy.wait(5000);
    };

    // --- HELPER FUNCTION ---
    const fillTransactionForm = (bank, amount, date, desc) => {
        
        // 1. AMOUNT (Verified Working)
        if (amount !== null) {
            cy.contains('Amount', { timeout: 10000 }) 
              .should('be.visible')
              .parent().parent()
              .find('input')
              .first()
              .clear({force: true})
              .type(amount, {force: true});
        }

        // 2. BANK SELECTION (FIXED)
        if (bank !== null) {
            // Step A: Find the Trigger (Input or Button next to label) and click IT
            cy.contains('Bank Account', { timeout: 10000 })
              .parent().parent()
              .find('input, button') // Find the interactive element inside
              .first()
              .click({force: true}); 
            
            // Wait for animation
            cy.wait(2000);

            // Step B: Select Option (Generic 'li' is safer than role="option")
            cy.get('body').then($body => {
                // Check if any list item is visible
                if ($body.find('li').length > 0) {
                    // Click the last item (often "Create New" is first, existing banks are later)
                    // Or click the first available one
                    cy.get('li').last().click({force: true});
                } else {
                    // If no list, try typing in the portal input if it exists
                    cy.get('#headlessui-portal-root input').type(bank + '{enter}', {force: true});
                }
            });
        }

        // 3. DATE
        if (date !== null) {
            cy.contains('Date') 
              .parent().parent()
              .find('input')
              .clear({force: true})
              .type(date, {force: true});
            cy.get('body').click(); 
        }

        // 4. DESCRIPTION
        if (desc !== null) {
            cy.contains('Description') 
              .parent().parent()
              .find('textarea') 
              .clear({force: true})
              .type(desc, {force: true});
        }

        // SAVE BUTTON
        cy.contains('button', 'Save').click({force: true});
    };

    // --- TEST CASES ---

    it("TC-01: Create Transaction with Valid Details", () => {
        fillTransactionForm("HBL", "500", null, "Recording Logic Test");
        cy.contains(/created|success/i, { timeout: 10000 }).should('be.visible');
    });

    it("TC-02: Verify Empty Bank Account (Validation)", () => {
        fillTransactionForm(null, "500", null, "No Bank Test");
        cy.contains(/bank account field is required|required/i).should('be.visible');
    });

    it("TC-03: Verify Negative Amount (Bug Verification)", () => {
        fillTransactionForm("HBL", "-500", null, "Negative Test");
        cy.contains(/positive|greater than/i, { timeout: 10000 }).should('be.visible');
    });

    it("TC-04: Verify Empty Amount Field (PASS)", () => {
        fillTransactionForm("HBL", null, null, "Empty Amount Test");
        cy.contains(/Amount.*required/i).should('be.visible'); 
    });

    it("TC-05: Verify Future Date (Valid)", () => {
        const nextYear = new Date();
        nextYear.setFullYear(nextYear.getFullYear() + 1);
        const dateStr = nextYear.toISOString().split('T')[0]; 

        fillTransactionForm("HBL", "500", dateStr, "Future Date Payment");
        cy.contains(/created|success/i, { timeout: 10000 }).should('be.visible');
    });

});
