describe("10", () => {
  it("TC 10.1", () => {
    cy.viewport(1365, 901);
    cy.visit("https://app.invoicing.co/#/login");
    cy.get("section:nth-of-type(1) input").click();
    cy.get("section:nth-of-type(1) input").type("hashaamw29@gmail.com");
    cy.get("#password").click();
    cy.get("#password").type("12345678");
    cy.get("div.p-8 button").click();
    cy.get("div:nth-of-type(9) div").click();
    cy.get("div.p-4 div.lg\\:flex-row a").click();
    cy.get("div.py-4 > div:nth-of-type(2) [data-testid='combobox-input-field']").click();
    cy.get("div.py-4 > div:nth-of-type(2) [data-testid='combobox-input-field']").type("Hashaam");
    cy.get("div.py-4 > div:nth-of-type(2) [data-testid='combobox-input-field']").type("{enter}");
    cy.get("div:nth-of-type(4) input").click();
    cy.get("div:nth-of-type(4) input").type("2025-12-12");
    cy.get("div:nth-of-type(5) input").click();
    cy.get("div:nth-of-type(5) input").type("2");
    cy.get("div:nth-of-type(6) input").click();
    cy.get("div:nth-of-type(6) input").type("4");
    cy.get("div:nth-of-type(7) textarea").click();
    cy.get("div:nth-of-type(7) textarea").type("hi");
    cy.get("div:nth-of-type(8) textarea").click();
    cy.get("div:nth-of-type(8) textarea").type("bye");
    cy.get("[data-cy='name']").click();
    cy.get("[data-cy='name']").type("SQEProject");
    cy.get("div.ml-4 > div:nth-of-type(2) > button").click();
  });
});


describe("10", () => {
  it("TC 10.2", () => {
    cy.viewport(1365, 901);
    cy.visit("https://app.invoicing.co/#/login");
    cy.get("section:nth-of-type(1) input").click();
    cy.get("section:nth-of-type(1) input").type("hashaamw29@gmail.com");
    cy.get("#password").click();
    cy.get("#password").type("12345678");
    cy.get("div.p-8 button").click();
    cy.get("div:nth-of-type(9) div").click();
    cy.get("div.p-4 div.lg\\:flex-row a").click();
    cy.get("div:nth-of-type(4) input").click();
    cy.get("div:nth-of-type(4) input").type("2025-12-01");
    cy.get("div:nth-of-type(5) input").click();
    cy.get("div:nth-of-type(5) input").type("2");
    cy.get("div:nth-of-type(6) input").click();
    cy.get("div:nth-of-type(6) input").type("4");
    cy.get("div:nth-of-type(7) textarea").click();
    cy.get("div:nth-of-type(7) textarea").type("hi");
    cy.get("div:nth-of-type(8) textarea").click();
    cy.get("div:nth-of-type(8) textarea").type("bye");
    cy.get("div.ml-4 > div:nth-of-type(2) > button").click();
  });
});

describe("10", () => {
  it("TC 10.3 (Negative Budget/Rate Check)", () => {
    cy.viewport(1365, 901);
    cy.visit("https://app.invoicing.co/#/login");
    // --- Login --- (Use reliable selectors)
    cy.get('input[type="email"]').first().type("i230002@isb.nu.edu.pk");
    cy.get('input[type="password"]').first().type("12345678");
    cy.get("div.p-8 button").click();
    
    // Wait for Dashboard
    cy.url().should("include", "/dashboard");
    cy.contains('Projects').click();
    cy.get('a[href*="/projects/create"]').first().click(); 

    // --- Fill Name & Client ---
    cy.get("[data-cy='name']").type("NegativeTest");
    cy.get("div.py-4 > div:nth-of-type(2) [data-testid='combobox-input-field']").type("Hashaam{enter}");

    // --- Enter Negative Values ---
    cy.get("div:nth-of-type(5) input").type("-2"); // Budgeted Hours
    cy.get("div:nth-of-type(6) input").type("-4"); // Task Rate
    
    // Attempt Save (Even though we expect it to fail validation on click)
    cy.get("div.ml-4 > div:nth-of-type(2) > button").click();

    // ASSERTION: Check for the negative value error (The test FAILed in manual testing, so we check the correct error)
    cy.contains(/Value must be positive|must be greater than 0/i, { timeout: 8000 }).should("be.visible");
  });
});

describe("10", () => {
  it("TC 10.4", () => {
    cy.viewport(1365, 901);
    cy.visit("https://app.invoicing.co/#/login");
    cy.get("section:nth-of-type(1) input").click();
    cy.get("section:nth-of-type(1) input").type("i230002@isb.nu.edu.pk");
    cy.get("#password").click();
    cy.get("#password").type("12345678");
    cy.get("div.p-8 button").click();
    cy.get("div:nth-of-type(9) div").click();
    cy.get("div.p-4 div.lg\\:flex-row a").click();
    cy.get("div.py-4 > div:nth-of-type(2) [data-testid='combobox-input-field']").click();
    cy.get("div.py-4 > div:nth-of-type(2) [data-testid='combobox-input-field']").type("Hashaam");
    cy.get("div.py-4 > div:nth-of-type(2) [data-testid='combobox-input-field']").type("{enter}");
    cy.get("div:nth-of-type(4) input").click();
    cy.get("div:nth-of-type(4) input").type("2025-12-01");
    cy.get("div:nth-of-type(5) input").click();
    cy.get("div:nth-of-type(5) input").type("Ten");
    cy.get("[data-cy='name']").click();
    cy.get("[data-cy='name']").type("SQEProject");
    cy.get("div.ml-4 > div:nth-of-type(2) > button").click();
  });
});





