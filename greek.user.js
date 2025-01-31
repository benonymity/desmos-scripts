// ==UserScript==
// @name         Desmos Scientific Greek Shortcuts
// @namespace    http://github.com/benonymity/desmos-scripts
// @updateURL    https://github.com/benonymity/desmos-scripts/raw/main/greek.user.js
// @downloadURL  https://github.com/benonymity/desmos-scripts/raw/main/greek.user.js
// @version      0.1
// @description  Provides shortcuts for Greek letters in Desmos scientific calculator
// @author       Assistant
// @match        https://*.desmos.com/scientific
// @license      MIT
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  // Wait for page to load
  window.addEventListener("load", function () {
    // Map of shortcuts to Greek letters
    const greekLetters = {
      "@a": "\\alpha",
      "@b": "\\beta",
      "@g": "\\gamma",
      "@G": "\\Gamma",
      "@d": "\\delta",
      "@D": "\\Delta",
      "@e": "\\epsilon",
      "@z": "\\zeta",
      "@h": "\\eta",
      "@t": "\\theta",
      "@T": "\\Theta",
      "@i": "\\iota",
      "@k": "\\kappa",
      "@l": "\\lambda",
      "@L": "\\Lambda",
      "@m": "\\mu",
      "@n": "\\nu",
      "@x": "\\xi",
      "@X": "\\Xi",
      "@p": "\\pi",
      "@P": "\\Pi",
      "@r": "\\rho",
      "@s": "\\sigma",
      "@S": "\\Sigma",
      "@t": "\\tau",
      "@u": "\\upsilon",
      "@U": "\\Upsilon",
      "@f": "\\phi",
      "@F": "\\Phi",
      "@c": "\\chi",
      "@y": "\\psi",
      "@Y": "\\Psi",
      "@w": "\\omega",
      "@W": "\\Omega",
    };

    let lastChar = "";

    document.addEventListener("keydown", function (e) {
      // If @ was pressed previously and this is a letter
      if (lastChar === "@" && e.key.length === 1) {
        const shortcut = "@" + e.key;

        if (greekLetters[shortcut]) {
          // Get calculator state
          const state = Calc.getState();

          // Find the current expression being edited
          const expressions = state.expressions.list;
          let currentExpr = null;
          for (let expr of expressions) {
            if (expr.latex.includes("@")) {
              currentExpr = expr;
              break;
            }
          }

          if (currentExpr) {
            // Find position of @ in the latex
            const latex = currentExpr.latex;
            const atPos = latex.lastIndexOf("@");

            if (atPos !== -1) {
              // Replace @letter with Greek letter
              const newLatex =
                latex.substring(0, atPos) +
                greekLetters[shortcut] +
                latex.substring(atPos + 1);

              // Update the expression
              currentExpr.latex = newLatex;
              Calc.setState(state);
            }
          }
        }
        lastChar = "";
      } else if (e.key === "@") {
        lastChar = "@";
      } else {
        lastChar = "";
      }
    });
  });
})();
