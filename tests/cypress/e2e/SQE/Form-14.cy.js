describe("Form 14: Expenses Module Automation (Final Recorder Fix)", () => {

    Cypress.on('uncaught:exception', (err, runnable) => {
        return false;
    });

    beforeEach(() => {
        cy.on('window:confirm', () => true);
        cy.on('window:alert', () => true);
        
        // Login
        login("najtahir75@gmail.com", "12345678");
        
        // Navigate
        cy.visit("https://app.invoicing.co/#/expenses/create");
        
        // Page Load Confirm
        cy.contains('Enter Expense', { timeout: 15000 }).should('be.visible');
    });

    const login = (email, password) => {
        cy.visit("https://app.invoicing.co/", { failOnStatusCode: false });
        cy.viewport(1366, 768);
        cy.wait(2000);
        cy.get('input').should('have.length.gt', 1);
        cy.get('input').eq(0).clear({force: true}).type(email);
        cy.get('input').eq(1).clear({force: true}).type(password);
        cy.contains('button', 'Login').click({force: true});
        cy.wait(5000);
    };

    // --- HELPER FUNCTION (Based on Recorder Logic) ---
    const fillExpenseForm = (vendor, amount, date) => {
        
        // 1. VENDOR (Dropdown)
        if (vendor !== null) {
            // Recorder logic: Click the combobox
            cy.get("div.py-4 > div:nth-of-type(1) [data-testid='combobox-input-field']").click({force: true});
            cy.wait(500); // Wait for dropdown

            // Select first option (mimicking recorder which clicks specific option ID)
            // or type if needed. Recorder clicked an option directly.
            // We will try to type + enter for robustness
            cy.focused().type(vendor, {force: true});
            cy.wait(1000);
            cy.get('body').type('{enter}');
        }

        // 2. AMOUNT (Recorder used div:nth-of-type(6))
        if (amount !== null) {
            // The recorder's XPath corresponds to the 6th div in the form list
            // We use a selector that targets this structure
            cy.get("form div:nth-of-type(6) input")
              .should('exist')
              .clear({force: true})
              .type(amount, {force: true});
        }

        // 3. DATE (Recorder used div:nth-of-type(8))
        if (date !== null) {
            // The recorder's XPath corresponds to the 8th div
            cy.get("form div:nth-of-type(8) input")
              .should('exist')
              .clear({force: true})
              .type(date, {force: true});
            cy.get('body').click(); // Close picker
        }

        // CLICK SAVE
        cy.contains('button', 'Save').click({force: true});
    };

    // --- TEST CASES ---

    it("TC-01: Create Expense with Valid Amount (PASS)", () => {
        fillExpenseForm("Zee Vendor", "100", null);
        cy.contains(/created|success|saved/i, { timeout: 10000 }).should('be.visible');
    });

    it("TC-02: Verify Empty Amount Validation (FAIL - Bug Verification)", () => {
        // Vendor selected, Amount NULL
        fillExpenseForm("Zee Vendor", null, null);

        // EXPECTED: Error "Amount is required"
        // ACTUAL: System saves it (Bug) -> Fail Test
        cy.contains(/Amount is required/i).should('be.visible');
        cy.contains(/created|success|saved/i).should('not.exist');
    });

    it("TC-03: Verify Negative Expense Amount (FAIL - Bug Verification)", () => {
        fillExpenseForm("Zee Vendor", "-500", null);

        // EXPECTED: Error "Amount must be positive"
        // ACTUAL: System saves it (Bug) -> Fail Test
        cy.contains(/positive|greater than/i).should('be.visible');
        cy.contains(/created|success|saved/i).should('not.exist');
    });

    it("TC-04: Verify Zero Amount Expense (PASS)", () => {
        fillExpenseForm("Zee Vendor", "0", null);
        // Expect Success
        cy.contains(/created|success|saved/i, { timeout: 10000 }).should('be.visible');
    });

    it("TC-05: Verify Future Expense Date (PASS)", () => {
        const nextYear = new Date();
        nextYear.setFullYear(nextYear.getFullYear() + 1);
        const dateStr = nextYear.toISOString().split('T')[0]; // Format: YYYY-MM-DD

        // Note: Recorder passed date as "2025-06-12", we pass dynamic future date
        fillExpenseForm("Zee Vendor", "100", dateStr);
        cy.contains(/created|success|saved/i, { timeout: 10000 }).should('be.visible');
    });

});