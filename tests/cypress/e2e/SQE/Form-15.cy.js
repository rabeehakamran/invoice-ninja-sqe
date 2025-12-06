describe("Form 15: Recurring Expenses Module Automation", () => {

    Cypress.on('uncaught:exception', (err, runnable) => {
        return false;
    });

    beforeEach(() => {
        cy.on('window:confirm', () => true);
        cy.on('window:alert', () => true);
        
        // Login
        login("najtahir75@gmail.com", "12345678");
        
        // Navigate
        cy.visit("https://app.invoicing.co/#/recurring_expenses/create");
        
        // Page Load Confirm
        cy.contains(/New Recurring Expense|Recurring Expense Details/i, { timeout: 15000 }).should('be.visible');
    });

    const login = (email, password) => {
        cy.visit("https://app.invoicing.co/", { failOnStatusCode: false });
        cy.viewport(1280, 720);
        cy.wait(2000);
        
        cy.get('input').should('have.length.gt', 1);
        cy.get('input').eq(0).clear({force: true}).type(email, {force: true});
        cy.get('input').eq(1).clear({force: true}).type(password, {force: true});
        cy.contains('button', 'Login').click({force: true});
        
        cy.wait(5000);
    };

    // --- HELPER FUNCTION (Updated with Recorder Logic: Div 6, 10, 11) ---
    const fillRecurringExpenseForm = (vendor, amount, cycles, startDate) => {
        
        // 1. VENDOR (Standard Combobox Logic)
        if (vendor !== null) {
            cy.get("div.py-4 > div:nth-of-type(1) [data-testid='combobox-input-field']")
              .first()
              .click({force: true});
            
            cy.wait(500);
            cy.focused().type(vendor, {force: true});
            cy.wait(1000);
            cy.get('body').type('{enter}'); 
        }

        // 2. AMOUNT (Recorder: div:nth-of-type(6))
        if (amount !== null) {
            cy.get("form div:nth-of-type(6) input")
              .should('exist')
              .clear({force: true})
              .type(amount, {force: true});
        }

        // 3. START DATE (Recorder: div:nth-of-type(10))
        // Updated from 8 to 10 based on recording
        if (startDate !== null) {
            cy.get("form div:nth-of-type(10) input")
              .should('exist')
              .clear({force: true})
              .type(startDate, {force: true});
            cy.get('body').click(); // Close picker
        }

        // 4. REMAINING CYCLES (Recorder: div:nth-of-type(11))
        if (cycles !== null) {
            // Recorder tried to click/type in the 11th div
            // We target input or select inside that div
            cy.get("form div:nth-of-type(11) input, form div:nth-of-type(11) select")
              .first()
              .clear({force: true})
              .type(cycles, {force: true});
        }

        // CLICK SAVE
        cy.contains('button', 'Save').click({force: true});
    };

    // --- TEST CASES ---

    it("TC-01: Create Monthly Recurring Expense (PASS)", () => {
        fillRecurringExpenseForm("Zee Vendor", "100", null, null);
        cy.contains(/created|success|saved/i, { timeout: 10000 }).should('be.visible');
    });

    it("TC-02: Verify Empty Amount Validation (FAIL - Bug Verification)", () => {
        fillRecurringExpenseForm("Zee Vendor", null, null, null);

        // EXPECTED: Error "Amount is required"
        // ACTUAL: System saves it (Bug) -> Fail Test
        cy.contains(/Amount is required/i).should('be.visible');
        cy.contains(/created|success|saved/i).should('not.exist');
    });

    it("TC-03: Verify Negative Amount (FAIL - Bug Verification)", () => {
        fillRecurringExpenseForm("Zee Vendor", "-500", null, null);

        // EXPECTED: Error "Amount must be positive"
        // ACTUAL: System saves it (Bug) -> Fail Test
        cy.contains(/positive|greater than/i).should('be.visible');
        cy.contains(/created|success|saved/i).should('not.exist');
    });



    it("TC-04: Verify Past Start Date (PASS)", () => {
        const lastYear = new Date();
        lastYear.setFullYear(lastYear.getFullYear() - 1);
        const dateStr = lastYear.toISOString().split('T')[0];

        fillRecurringExpenseForm("Zee Vendor", "100", null, dateStr);
        cy.contains(/created|success|saved/i).should('be.visible');
    });

});