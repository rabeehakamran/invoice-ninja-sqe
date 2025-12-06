describe("Form 16: Transactions Module Automation (Final Fix)", () => {

    Cypress.on('uncaught:exception', (err, runnable) => {
        return false;
    });

    beforeEach(() => {
        cy.on('window:confirm', () => true);
        cy.on('window:alert', () => true);

        // Login
        login("hashaamwbhati@gmail.com", "12345678");

        // Navigate
        cy.visit("https://app.invoicing.co/#/transactions/create");
        cy.wait(2000);
    });

    const login = (email, password) => {
        cy.visit("https://app.invoicing.co/", { failOnStatusCode: false });
        cy.viewport(1227, 879);
        cy.wait(2000);
        cy.get('input').should('have.length.gt', 1);
        cy.get('input').eq(0).clear({force: true}).type(email);
        cy.get('input').eq(1).clear({force: true}).type(password);
        cy.contains('button', 'Login').click({force: true});
        cy.wait(4000);
    };

    // --- HELPER FUNCTION (Updated) ---
    const fillTransactionForm = (bank, amount, date, desc) => {
        
        // 1. AMOUNT (Order changed - Ab pehle Amount fill hoga)
        if (amount !== null) {
            // Maine selector change kiya hai taake wo specific number field dhoonday
            // Agar yeh fail ho to bataiye ga
            cy.get('input[type="number"], input[placeholder*="Amount"]')
              .should('be.visible')
              .clear({force: true})
              .type(amount, {force: true});
        }

        // 2. BANK SELECTION (Fixed Logic)
        if (bank !== null) {
            // Dropdown Trigger
            cy.get("[data-testid='combobox-input-field']").click({force: true});
            
            // IMPORTANT: Wait for dropdown animation to open
            cy.wait(1000); 

            // Ab Portal input dhoondtay hain
            cy.get("#headlessui-portal-root input")
              .should('be.visible')
              .clear({force: true})
              .type(bank, {force: true});

            // Result select karna
            cy.wait(1000);
            cy.get("#headlessui-portal-root > div > div button").first().click({force: true});
        }

        // 3. DATE
        if (date !== null) {
            cy.get('input[type="date"], input[placeholder*="Date"]')
              .type(date, {force: true});
            cy.get('body').click(); 
        }

        // 4. DESCRIPTION
        if (desc !== null) {
            cy.get('textarea').first().clear({force: true}).type(desc, {force: true});
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
        cy.contains(/bank integration id|required/i).should('be.visible');
    });

    it("TC-03: Verify Negative Amount (Bug Verification)", () => {
        fillTransactionForm("HBL", "-500", null, "Negative Test");
        cy.contains(/positive|greater than/i).should('be.visible');
    });

    it("TC-04: Verify Empty Amount Field (Bug Verification)", () => {
        fillTransactionForm("HBL", null, null, "Empty Amount Test");
        cy.contains(/Amount is required/i).should('be.visible');
    });

    it("TC-05: Verify Future Date (Valid)", () => {
        const nextYear = new Date();
        nextYear.setFullYear(nextYear.getFullYear() + 1);
        const dateStr = nextYear.toISOString().split('T')[0];

        fillTransactionForm("HBL", "500", dateStr, "Future Date Payment");
        cy.contains(/created|success/i, { timeout: 10000 }).should('be.visible');
    });

});