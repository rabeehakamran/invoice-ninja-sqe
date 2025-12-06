
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
    cy.get("div:nth-of-type(4) input").type("2025-12-12");
    cy.get("div:nth-of-type(5) input").click();
    cy.get("div:nth-of-type(5) input").type("Ten");
    cy.get("[data-cy='name']").click();
    cy.get("[data-cy='name']").type("SQEProject");
    cy.get("div.ml-4 > div:nth-of-type(2) > button").click();
  });
});





describe("10", () => {
  it("TC 10.5", () => {
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
    cy.get("div:nth-of-type(4) input").type("2023-12-01");
    cy.get("div:nth-of-type(5) input").click();
    cy.get("div:nth-of-type(5) input").type("Ten");
    cy.get("[data-cy='name']").click();
    cy.get("[data-cy='name']").type("SQEProject");
    cy.get("div.ml-4 > div:nth-of-type(2) > button").click();
  });
});
