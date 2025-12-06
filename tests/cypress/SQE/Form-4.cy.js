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

  it("TC-01: Create Product with All Valid Details (Valid)", () => {
    fillProductForm("Laptop", "50000", "High Performance Laptop", null);
    cy.wait(5000);
   
    cy.contains(/created|updated|Laptop/i).should('exist');
  });

  it("TC-02: Create Product with Mandatory Fields Only (Valid)", () => {
    fillProductForm("Mouse", "0", null, null);
    cy.wait(5000);
    cy.contains(/created|updated|Mouse/i).should('exist');
  });

  it("TC-03: Verify Empty Item Name Validation (Bug Verification)", () => {
    fillProductForm(null, "500", "No Name Item", null);
    
   
    cy.contains(/field is required|required/i).should('exist');
  });



});