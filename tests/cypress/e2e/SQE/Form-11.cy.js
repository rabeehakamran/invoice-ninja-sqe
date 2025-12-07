describe("Form 11: Tasks Module Automation ", () => {

    Cypress.on('uncaught:exception', (err, runnable) => {
        return false;
    });

    beforeEach(() => {
        cy.on('window:confirm', () => true);
        cy.on('window:alert', () => true);
        
        // Login Logic
        login("hashaamwbhatti@gmail.com", "12345678");
    });

    const login = (email, password) => {
        cy.visit("/", { failOnStatusCode: false });
        cy.viewport(1280, 720);
        cy.wait(2000);
        
        cy.get('input').should('have.length.gt', 1);
        cy.get('input').eq(0).clear({force: true}).type(email, {force: true});
        cy.get('input').eq(1).clear({force: true}).type(password, {force: true});
        cy.contains('button', 'Login').click({force: true});
        
        // Dashboard load wait
        cy.wait(5000);
    };

    // --- HELPER FUNCTION ---
    const fillTaskForm = (client, description, rate, duration) => {
        cy.visit('https://app.invoicing.co/#/tasks/create');
        
        // Confirm Page Load
        cy.contains('New Task', { timeout: 15000 }).should('be.visible');

        // 1. CLIENT (Focus Method - Sabse Reliable)
        if (client !== null) {
            cy.contains('label', 'Client').parent().find("input, [data-testid='combobox-input-field']")
              .first()
              .click({force: true});

            cy.wait(500); // Animation wait

            // Focus kar ke type karein (Portal/Popup ka masla khatam)
            cy.focused().type(client, {force: true});
            
            cy.wait(1000); // Result wait
            cy.get('body').type('{enter}'); // Enter to select
        }

        // 2. DESCRIPTION
        if (description !== null) {
            cy.contains('label', 'Description').parent().find('textarea')
              .clear({force: true})
              .type(description, {force: true});
        }

        // 3. RATE (Negative value fix)
        if (rate !== null) {
            // 'Rate' label ke neeche input dhoond raha hun
            cy.contains('label', 'Rate').parent().find('input')
              .should('exist')
              .clear({force: true})
              .type(rate, {force: true}); // Force true se negative sign type ho jana chahiye
        }

        // 4. DURATION (Negative Duration fix)
        if (duration !== null) {
            // Duration input
            cy.contains('label', 'Duration').parent().find('input')
              .clear({force: true})
              .type(duration, {force: true});
        }

        // SAVE BUTTON
        cy.contains('button', 'Save').click({force: true});
    };

    // --- TEST CASES ---


    
    it("TC-02: Verify Empty Client Validation (FAIL - Bug Verification)", () => {
        // Step 1: Visit Page
        cy.visit('https://app.invoicing.co/#/tasks/create');
        cy.contains('New Task', { timeout: 15000 }).should('be.visible');

        // Step 2: Fill Description (Client ko Empty chor diya)
        cy.contains('label', 'Description').parent().find('textarea')
          .clear({force: true})
          .type("Task without Client", {force: true});

        // Step 3: ASSERTION - Check Disabled Attribute
        // Agar Client empty hai, to Save button Disabled hona chahiye.
        // Agar Bug hai (Button Enabled hai), to yeh line FAIL hogi.
        cy.contains('button', 'Save').should('have.attr', 'disabled');
    });

    it("TC-03: Verify Negative Rate (FAIL - Bug Verification)", () => {
        fillTaskForm("Hashaam", "Negative Rate Test", "-50", null);

        // EXPECTED: Error "Rate must be positive"
        // ACTUAL: Save ho jata hai. Test FAIL hoga.
        cy.contains(/positive|greater than/i).should('be.visible');
    });

    it("TC-01: Create Task with Valid Details (PASS)", () => {
        fillTaskForm("Hashaam", "Valid Task Test", null, null);
        // Expect Success
        cy.contains(/created|success|saved/i, { timeout: 10000 }).should('be.visible');
    });

  


    it("TC-04: Verify Long Description (PASS)", () => {
        const longText = "A".repeat(1000);
        fillTaskForm("Hashaam", longText, null, null);
        cy.contains(/created|success|saved/i, { timeout: 10000 }).should('be.visible');
    });

});
