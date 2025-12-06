describe("Form 4: Products Module Automation (Live Site)", () => {

  
  Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
  });

  // --- Helper 1: Login Function ---
  const login = (email, password) => {
    cy.visit("/", { failOnStatusCode: false });
    cy.viewport(1280, 720);
    
    
    cy.wait(15000);

 
    cy.get('input').eq(0).clear({force: true}).type(email, {force: true});
    cy.get('input').eq(1).clear({force: true}).type(password, {force: true});
    cy.contains('button', 'Login').click({force: true});
    
    
    cy.wait(12000);
  };

  
  const fillProductForm = (item, price, description, imageUrl) => {
  
    cy.visit('/#/products/create');
    cy.wait(10000); 

   
    if (item !== null) {
        
        cy.get('body').then(($body) => {
           
            if ($body.find('input[aria-label="Search"]').length > 0) {
                cy.get('input').eq(1).clear({force: true}).type(item, {force: true});
            } else {
               
                cy.get('input').eq(0).clear({force: true}).type(item, {force: true});
            }
        });
    }

   
    if (description !== null) {
      cy.get('body').then(($body) => {
        if ($body.find('textarea').length > 0) {
            cy.get('textarea').first().clear({force: true}).type(description, {force: true});
        } else {
            
            cy.get('input').eq(2).clear({force: true}).type(description, {force: true});
        }
      });
    }

   
    if (price !== null) {
      
      cy.get('input').eq(3).clear({force: true}).type(price, {force: true});
    }

    
    if (imageUrl !== null) {
      cy.get('input').last().clear({force: true}).type(imageUrl, {force: true});
    }

   
    cy.contains('button', 'Save').click({force: true});
  };

 
  beforeEach(() => {
    
    login("zeetahir206@gmail.com", "12345678");
  });

  // --- TEST CASES ---


  it("TC-04: Verify Non-Positive Input in Price (Bug Verification)", () => {
    fillProductForm("Negative Price Item", "-1", "Bad Price", null);
    
    
    cy.contains(/positive/i).should('exist');
  });

  it("TC-05: Verify Invalid Image URL Format (Bug Verification)", () => {
    fillProductForm("Bad URL Item", "100", "Desc", "photo1");
    
    
    cy.contains(/valid url/i).should('exist');
  });

  it("TC-06: Verify Long Description Limit (Valid)", () => {
    const longDesc = "A".repeat(1000);
    fillProductForm("Long Desc Item", "100", longDesc, null);
    
    cy.wait(4000);
  
    cy.contains(/created|updated/i).should('exist');
  });

});