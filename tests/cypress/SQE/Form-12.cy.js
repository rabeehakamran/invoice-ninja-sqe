describe("Form 12: Vendor Module Automation ", () => {

    Cypress.on('uncaught:exception', (err, runnable) => {
        return false;
    });

    beforeEach(() => {
        cy.on('window:confirm', () => true);
        cy.on('window:alert', () => true);
        
        // Login
        login("hashaamwbhatti@gmail.com", "12345678");
        
        // Navigate and wait for page load
        cy.visit("https://app.invoicing.co/#/vendors/create");
        cy.wait(3000); // Wait for form to load
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

    // --- HELPER FUNCTION (Using IDs - Most Reliable) ---
    const fillVendorForm = (name, email, website, phone) => {
        
        // DEBUG: Check what elements exist
        cy.get('body').then($body => {
            console.log('=== AVAILABLE IDs ===');
            const elementsWithId = $body.find('[id]');
            elementsWithId.each((i, el) => {
                console.log(`Element ${i}: Tag: ${el.tagName}, ID: "${el.id}"`);
            });
        });

        // 1. VENDOR NAME - Use ID directly
        if (name !== null) {
            cy.get("#name")
              .should('be.visible')
              .click({force: true}) // Focus first
              .clear({force: true})
              .type(name, {force: true, delay: 100}); // Add delay to mimic human typing

            // Verify value actually entered
            cy.get("#name").should('have.value', name);
        }

        // 2. EMAIL - Check if there's an email ID
        if (email !== null) {
            cy.get('body').then($body => {
                // Try different email selectors
                if ($body.find("#email").length > 0) {
                    cy.get("#email")
                      .clear({force: true})
                      .type(email, {force: true, delay: 100})
                      .should('have.value', email);
                } else if ($body.find("input[type='email']").length > 0) {
                    cy.get("input[type='email']").first()
                      .clear({force: true})
                      .type(email, {force: true, delay: 100})
                      .should('have.value', email);
                } else if ($body.find("input[name*='email']").length > 0) {
                    cy.get("input[name*='email']").first()
                      .clear({force: true})
                      .type(email, {force: true, delay: 100})
                      .should('have.value', email);
                }
            });
        }

        // 3. WEBSITE
        if (website !== null) {
            cy.get('body').then($body => {
                if ($body.find("#website").length > 0) {
                    cy.get("#website").clear({force: true}).type(website, {force: true});
                } else if ($body.find("input[name*='website']").length > 0) {
                    cy.get("input[name*='website']").first().clear({force: true}).type(website, {force: true});
                }
            });
        }

        // 4. PHONE
        if (phone !== null) {
            cy.get('body').then($body => {
                if ($body.find("#phone").length > 0) {
                    cy.get("#phone").clear({force: true}).type(phone, {force: true});
                } else if ($body.find("input[name*='phone']").length > 0) {
                    cy.get("input[name*='phone']").first().clear({force: true}).type(phone, {force: true});
                }
            });
        }

        // SAVE BUTTON
        cy.contains('button', 'Save').click({force: true});
    };

    // --- TEST CASES ---

    it("TC-00: Debug - Find all form elements", () => {
        cy.get('body').then($body => {
            console.log('=== FORM ELEMENTS DEBUG ===');
            
            // All inputs
            console.log('\n=== ALL INPUTS ===');
            const inputs = $body.find('input, textarea, select');
            inputs.each((i, el) => {
                console.log(`Input ${i}:`, {
                    tag: el.tagName,
                    id: el.id,
                    name: el.name,
                    type: el.type,
                    placeholder: el.placeholder,
                    value: el.value,
                    className: el.className
                });
            });
            
            // All IDs
            console.log('\n=== ALL IDs ===');
            const ids = $body.find('[id]');
            ids.each((i, el) => {
                console.log(`ID ${i}: "${el.id}" - Tag: ${el.tagName}`);
            });
        });
    });

    it("TC-01: Create Vendor with Valid Details (PASS)", () => {
        // Simple test using the ID we know exists
        fillVendorForm("Tech Vendor", null, null, null);
        cy.contains(/created|success|saved/i, { timeout: 10000 }).should('be.visible');
    });

    it("TC-02: Verify Empty Name Validation (PASS)", () => {
        // Leave name empty, try to fill email
        fillVendorForm(null, "test@tech.com", null, null);
        
        // Error should appear
        cy.contains(/field is required|Name.*required|required.*Name/i, { timeout: 10000 }).should('be.visible');
        cy.contains(/created|success|saved/i).should('not.exist');
    });

    it("TC-03: Verify Invalid Email Format (PASS)", () => {
        fillVendorForm("Tech Vendor", "invalid-email-format", null, null);
        cy.contains(/valid email|email.*valid|invalid.*email/i, { timeout: 10000 }).should('be.visible');
    });

    it("TC-04: Verify Duplicate Vendor Name (PASS)", () => {
        fillVendorForm("SQE Duplicate", null, null, null);
        cy.contains(/created|success|saved/i, { timeout: 10000 }).should('be.visible');

        // Create Second Vendor
        cy.visit("https://app.invoicing.co/#/vendors/create");
        cy.wait(3000);
        
        fillVendorForm("SQE Duplicate", null, null, null);
        cy.contains(/created|success|saved/i, { timeout: 10000 }).should('be.visible');
    });

    it("TC-05: Verify Invalid Website (FAIL - Bug Verification)", () => {
        // Direct fill to ensure we target correctly
        cy.get("#name").clear({force: true}).type("Vendor Bad URL", {force: true, delay: 100});
        
        // Try to find website field
        cy.get('body').then($body => {
            if ($body.find("#website").length > 0) {
                cy.get("#website").clear({force: true}).type("http://url", {force: true});
            } else if ($body.find("input[name*='website']").length > 0) {
                cy.get("input[name*='website']").first().clear({force: true}).type("http://url", {force: true});
            }
        });
        
        cy.contains('button', 'Save').click({force: true});
        // Bug: System saves invalid URL
        cy.contains(/valid url|invalid.*url|url.*valid/i, { timeout: 10000 }).should('be.visible');
    });

    it("TC-06: Verify Alphabets in Phone Number (FAIL - Bug Verification)", () => {
        cy.get("#name").clear({force: true}).type("Vendor Bad Phone", {force: true, delay: 100});
        
        // Try to find phone field
        cy.get('body').then($body => {
            if ($body.find("#phone").length > 0) {
                cy.get("#phone").clear({force: true}).type("abcd", {force: true});
            } else if ($body.find("input[name*='phone']").length > 0) {
                cy.get("input[name*='phone']").first().clear({force: true}).type("abcd", {force: true});
            }
        });
        
        cy.contains('button', 'Save').click({force: true});
        // Bug: System saves alphabets
        cy.contains(/numeric|valid phone|phone.*valid|number.*valid/i, { timeout: 10000 }).should('be.visible');
    });

});