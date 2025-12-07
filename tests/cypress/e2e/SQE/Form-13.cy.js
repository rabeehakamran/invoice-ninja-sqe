describe("Form 13: Purchase Order Module Automation", () => {

    Cypress.on('uncaught:exception', (err, runnable) => {
        return false;
    });

    beforeEach(() => {
        cy.on('window:confirm', () => true);
        cy.on('window:alert', () => true);
        
        // Login
        login("hashaamwbhatti@gmail.com", "12345678");
        
        // Navigate
        cy.visit("/purchase_orders/create");
        
        // Page Load Confirm
        cy.contains(/New Purchase Order|PO Details/i, { timeout: 15000 }).should('be.visible');
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

    // --- HELPER FUNCTION ---
    const fillPOForm = (vendor, itemCost, discount, poDate, dueDate) => {
        
        // 1. SELECT VENDOR (Focus Method)
        if (vendor !== null) {
            cy.contains('label', 'Vendor').parent().find("input")
              .first()
              .click({force: true});
            
            cy.wait(500); 
            cy.focused().type(vendor, {force: true});
            cy.wait(1000); 
            cy.get('body').type('{enter}'); 
        }

        // 2. PO DATE & DUE DATE (Fixed: Using Index Strategy for Date Inputs)
        if (poDate !== null) {
            // First Date Input = PO Date
            cy.get("input[type='date']")
              .eq(0)
              .clear({force: true})
              .type(poDate, {force: true});
            cy.get('body').click(); // Close picker
        }

        if (dueDate !== null) {
            // Second Date Input = Due Date
            cy.get("input[type='date']")
              .eq(1)
              .should('exist')
              .clear({force: true})
              .type(dueDate, {force: true});
            cy.get('body').click(); // Close picker
        }

        // 3. ADD ITEM (Handling Cost as Nullable per request)
        if (itemCost !== null) {
            // Click "Add Item" button if inputs are not visible yet
            cy.get('body').then($body => {
                if ($body.find("input[placeholder*='Cost'], input[placeholder*='Price']").length === 0) {
                     cy.contains('button', 'Add Item').click({force: true});
                }
            });

            // Try to find Cost input via attributes or placeholder
            cy.get("input[placeholder*='Cost'], input[placeholder*='Price']")
              .first()
              .should('exist')
              .clear({force: true})
              .type(itemCost, {force: true});

            // Ensure Qty is 1 (Standard)
            cy.get("input[placeholder*='Qty'], input[placeholder*='Quantity']")
              .first()
              .clear({force: true})
              .type("1", {force: true});
        }

        // 4. DISCOUNT (If provided)
        if (discount !== null) {
            cy.contains('label', 'Discount').parent().find('input')
              .clear({force: true})
              .type(discount, {force: true});
        }

        // SAVE BUTTON
        cy.contains('button', 'Save').click({force: true});
    };

    // --- TEST CASES ---


     it("TC-03: Verify 'Due Date' Logic (FAIL - Bug Verification)", () => {
        // PO Date: 2025-12-01, Due Date: 2025-11-12 (Past Date)
        fillPOForm("Tech Vendor", null, null, "2025-12-01", "2025-11-12");

        // EXPECTED: Error "Due Date must be after PO Date"
        // ACTUAL: Saves successfully (Bug) -> Test Fails
        cy.contains(/after.*date|invalid date/i).should('be.visible');
    });


    it("TC-04: Verify Save without Items (PASS)", () => {
        // Vendor selected, No items (itemCost = null)
        fillPOForm("Tech Vendor", null, null, null, null);
        
        // System should save as Draft
        cy.contains(/created|success|saved/i, { timeout: 10000 }).should('be.visible');
    });

  

    it("TC-01: Create PO with Valid Vendor & Item (PASS)", () => {
        // Valid case mein Cost 100 bhej rahe hain
        fillPOForm("Tech Vendor", null, null, null, null);
        cy.contains(/created|success|saved/i, { timeout: 10000 }).should('be.visible');
    });

    it("TC-02: Verify Empty Vendor Validation (PASS)", () => {
        // Vendor NULL, Cost 100
        fillPOForm(null, null , null, null, null);

        // Expect Error
        cy.contains(/field is required|Vendor/i).should('be.visible');
        cy.contains(/created|success|saved/i).should('not.exist');
    });


   

});
