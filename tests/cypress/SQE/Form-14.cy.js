describe("Form 14: Expenses Module Automation ", () => {

    Cypress.on('uncaught:exception', (err, runnable) => {
        return false;
    });

    beforeEach(() => {
        cy.on('window:confirm', () => true);
        cy.on('window:alert', () => true);

        login("hashaamtemp@gmail.com", "12345678");

        // FIX 1: Login ke baad pehle Dashboard confirm karein, phir move karein
        cy.url().should('include', '/dashboard'); 
        
        // Ab Visit karein
        cy.visit("https://app.invoicing.co/#/expenses/create");
        
        // Ensure karein ke form waqai load ho gaya hai
        cy.contains('Enter Expense', { timeout: 20000 }).should('be.visible');
    });

    const login = (email, password) => {
        cy.visit("https://app.invoicing.co/", { failOnStatusCode: false });
        cy.viewport(1366, 768);
        cy.wait(2000);
        
        cy.get('input').should('have.length.gt', 1);
        cy.get('input').eq(0).clear({force: true}).type(email);
        cy.get('input').eq(1).clear({force: true}).type(password);
        cy.contains('button', 'Login').click({force: true});
        
        // Wait for login to complete
        cy.wait(5000);
    };

    // --- UPDATED HELPER FUNCTION ---
    const fillExpenseForm = (vendor, amount, date) => {
        
        // 1. VENDOR (Selector Fixed)
        if (vendor !== null) {
            // FIX 2: 'label' tag hata diya. Ab 'Vendor' text dhoond ke uske parent/sibling input ko pakar rahe hain
            cy.contains('Vendor').parent().find('input')
              .should('exist') // visible check kabhi kabhi dropdown me fail hota hai
              .click({force: true});
            
            cy.wait(500); // Animation wait
            
            // Focused element (Input) me type karein
            cy.focused().type(vendor, {force: true});
            cy.wait(1000); // Search result wait
            cy.get('body').type('{enter}');
        }

        // 2. AMOUNT
        if (amount !== null) {
            cy.contains('Amount').parent().find('input')
              .clear({force: true})
              .type(amount, {force: true});
        }

        // 3. DATE
        if (date !== null) {
            // "Date" text dhoond kar input fill karna
            cy.contains('Date').parent().find('input')
              .clear({force: true})
              .type(date, {force: true});
            cy.get('body').click(); // Close picker
        }

        // CLICK SAVE
        cy.contains('button', 'Save').click({force: true});
    };

    // --- TEST CASES ---

    it("TC-01: Create Expense with Valid Amount (PASS)", () => {
        fillExpenseForm("Demo Vendor", "100", null);
        cy.contains(/created|success|saved/i, { timeout: 10000 }).should('be.visible');
    });

    it("TC-02: Verify Empty Amount Validation (FAIL - Bug Verification)", () => {
        fillExpenseForm("Demo Vendor", null, null);
        // Bug: System saves 0.00 instead of error
        cy.contains(/Amount is required/i).should('be.visible');
    });

    it("TC-03: Verify Negative Expense Amount (FAIL - Bug Verification)", () => {
        fillExpenseForm("Demo Vendor", "-500", null);
        // Bug: System saves negative amount
        cy.contains(/positive|greater than/i).should('be.visible');
    });

    it("TC-05: Verify Zero Amount Expense (PASS)", () => {
        fillExpenseForm("Demo Vendor", "0", null);
        cy.contains(/created|success|saved/i, { timeout: 10000 }).should('be.visible');
    });

    it("TC-06: Verify Future Expense Date (PASS)", () => {
        const nextYear = new Date();
        nextYear.setFullYear(nextYear.getFullYear() + 1);
        const dateStr = nextYear.toISOString().split('T')[0];

        fillExpenseForm("Demo Vendor", "100", dateStr);
        cy.contains(/created|success|saved/i, { timeout: 10000 }).should('be.visible');
    });
});