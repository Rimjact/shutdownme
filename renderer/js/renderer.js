/**
 * Renderer script.
 * © Rimjact, 2024
 */

let appController = null;

/* == Functions == */
/**
 * Initialize the app scripts.
 */
function init() {
    appController = new AppController();
}

/* == Event Listeners == */
// Init
document.addEventListener('DOMContentLoaded', init);