// ==UserScript==
// @name         Desmos Scientific Calculator State Persistence
// @namespace    http://github.com/benonymity/desmos-scripts
// @updateURL    https://github.com/benonymity/desmos-scripts/raw/main/persist.user.js
// @downloadURL  https://github.com/benonymity/desmos-scripts/raw/main/persist.user.js
// @version      0.1
// @description  Persists calculator state across tabs/sessions in Desmos scientific calculator
// @author       Assistant
// @match        https://*.desmos.com/scientific
// @license      MIT
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(function () {
  "use strict";

  // Wait for page and calculator to load
  window.addEventListener("load", function () {
    // Check if Calc object is available
    if (typeof Calc !== "undefined") {
      // Load saved state on page load
      const savedState = GM_getValue("calculatorState", null);
      if (savedState) {
        try {
          const state = JSON.parse(savedState);
          // Remove @ characters
          state.expressions.list.forEach((expr) => {
            if (expr.latex) {
              expr.latex = expr.latex.replace(/@/g, "");
            }
          });
          // Filter out empty expressions
          state.expressions.list = state.expressions.list.filter(
            (expr) => expr.latex !== ""
          );
          Calc.setState(state);
          Calc.settings.invertedColors = true;
          Calc.updateSettings(Calc.settings);
        } catch (e) {
          console.error("Error loading saved calculator state:", e);
        }
      }

      // Save state before page unload
      window.addEventListener("beforeunload", function () {
        try {
          const currentState = Calc.getState();
          GM_setValue("calculatorState", JSON.stringify(currentState));
        } catch (e) {
          console.error("Error saving calculator state:", e);
        }
      });

      // Optional: Save periodically in case of crash
      setInterval(function () {
        try {
          const currentState = Calc.getState();
          GM_setValue("calculatorState", JSON.stringify(currentState));
        } catch (e) {
          console.error("Error in periodic state save:", e);
        }
      }, 30000); // Save every 30 seconds
    }
  });
})();
