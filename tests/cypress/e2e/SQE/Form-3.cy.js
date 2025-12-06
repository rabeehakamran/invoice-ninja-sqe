describe("Form 14: Client Module Automation (Final Fix via Recording)", () => {

    Cypress.on('uncaught:exception', (err, runnable) => {
        return false;
    });

    beforeEach(() => {
        cy.on('window:confirm', () => true);
        cy.on('window:alert', () => true);
        
        // Login
        login("najtahir75@gmail.com", "12345678");
        
        // Navigate
        cy.visit("https://app.invoicing.co/#/clients/create");
        
        // Confirm Page Load
        cy.contains(/New Client|Client Details/i, { timeout: 15000 }).should('be.visible');
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

    // --- HELPER FUNCTION (Using Logic from Recording) ---
    const fillClientForm = (name, phone, email, address) => {
        
        // 1. CLIENT NAME (Mandatory)
        if (name !== null) {
            // Strategy: Recording shows this is the FIRST input clicked.
            // We try to find it by ID first, then fallback to robust attribute selectors.
            cy.get('body').then($body => {
                if ($body.find("#name").length > 0) {
                    cy.get("#name").click({force: true}).clear({force: true}).type(name, {force: true});
                } 
                else if ($body.find("input[name='name']").length > 0) {
                    cy.get("input[name='name']").first().click({force: true}).clear({force: true}).type(name, {force: true});
                }
                else {
                    // Fallback: Use the first text input in the form (matches recording flow)
                    cy.get("form input[type='text']").first().click({force: true}).clear({force: true}).type(name, {force: true});
                }
            });
        }

        // --- CONTACTS SECTION (Using IDs from Recording: #first_name_0, #email_0, #phone_0) ---

        // 2. PHONE (Optional)
        if (phone !== null) {
            cy.get('body').then($body => {
                // Recording confirmed ID: #phone_0
                if ($body.find("#phone_0").length > 0) {
                    cy.get("#phone_0").click({force: true}).clear({force: true}).type(phone, {force: true});
                } 
                else {
                    // Fallback to name attribute
                    cy.get("input[name='work_phone'], input[placeholder='Phone']").last().type(phone, {force: true});
                }
            });
        }

        // 3. EMAIL (For TC-03)
        if (email !== null) {
            cy.get('body').then($body => {
                // Recording confirmed ID: #email_0
                if ($body.find("#email_0").length > 0) {
                    cy.get("#email_0").click({force: true}).clear({force: true}).type(email, {force: true});
                } 
                else {
                    cy.get("input[type='email']").last().type(email, {force: true});
                }
            });
        }

        // 4. ADDRESS (For TC-04 - Tab Switching)
        if (address !== null) {
            cy.get('body').then($body => {
                // If Address tab/input logic is needed
                if ($body.find("textarea[name='address1']").length === 0) {
                     cy.contains(/Address|Billing/i).click({force: true}); 
                     cy.wait(500);
                }
                cy.get("textarea[name='address1'], textarea[placeholder*='Address']")
                  .first()
                  .clear({force: true})
                  .type(address, {force: true});
            });
        }

        // SAVE BUTTON
        cy.contains('button', 'Save').click({force: true});
    };

    // --- TEST CASES ---

    it("TC-01: Create Client with Mandatory Fields (PASS)", () => {
        fillClientForm("Test Client A", null, null, null);
        cy.contains(/created|success|saved/i, { timeout: 10000 }).should('be.visible');
    });

    it("TC-02: Verify Client Creation without Name (FAIL - Bug Verification)", () => {
        // Name NULL, Fill Phone
        fillClientForm(null, "1234567890", null, null);

        // EXPECTED: Error "Name is required"
        // ACTUAL: System saves it (Bug) -> Fail Test
        cy.contains(/created|success|saved/i).should('not.exist');
        cy.contains(/field is required|Name/i).should('be.visible');
    });

    it("TC-03: Verify saving client with phone number (PASS)", () => {
        // Name and Phone provided
        fillClientForm("Client With Phone", "1234567890", null, null);
        
        // Expect Success
        cy.contains(/created|success|saved/i).should('be.visible');
    });

    it("TC-04: Verify Client Creation without Info (FAIL - Bug Verification)", () => {
        // Empty Form (All NULL)
        fillClientForm(null, null, null, null);

        // EXPECTED: Error or blocked save
        // ACTUAL: System saves blank record (Bug) -> Fail Test
        cy.contains(/created|success|saved/i).should('not.exist');
        cy.contains(/field is required|Name/i).should('be.visible');
    });

});