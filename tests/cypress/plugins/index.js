/// <reference types="cypress" />

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
    // Removed swap-env as it does not exist in your project
    // and is not needed for your custom SQE tests.

    // --- CYPRESS TASK REGISTRATION ---
    // The following tasks are needed to prevent the 'cy.task not registered' error
    // from your support/index.js file (activateCypressEnvFile, activateLocalEnvFile).
    on("task", {
        "activateCypressEnvFile": () => { 
            console.log("CYPRESS TASK: activateCypressEnvFile called (Mocked)"); 
            return null; 
        },
        "activateLocalEnvFile": () => { 
            console.log("CYPRESS TASK: activateLocalEnvFile called (Mocked)"); 
            return null; 
        }
    });

    return config;
};
