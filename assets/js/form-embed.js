/* ============================================================
   HORSECO — Intégration du Google Form
   ------------------------------------------------------------
   UNE SEULE LIGNE À REMPLIR : collez ci-dessous le lien donné
   par le script Apps Script (« LIEN À DIFFUSER »).

   Il ressemble à :
   https://docs.google.com/forms/d/e/1FAIpQLSxxxxxxxxxxxx/viewform
   ============================================================ */

var FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSd_B-GZ0P3lBtfHZcepFdf5fCavXH1gQkCQISdLK-naSxXJCA/viewform";

(function () {
  "use strict";

  var zone = document.getElementById("frame-zone");
  var direct = document.getElementById("direct");

  if (!FORM_URL) {
    zone.innerHTML =
      '<div class="embed-setup">' +
      '  <p class="eyebrow">À faire avant la mise en ligne</p>' +
      '  <h2>Le lien du formulaire n’est pas encore renseigné.</h2>' +
      '  <p>Ouvrez <code>assets/js/form-embed.js</code> et collez le lien du Google Form ' +
      '     dans <code>FORM_URL</code>, à la première ligne. Rien d’autre à modifier.</p>' +
      '</div>';
    direct.hidden = true;
    return;
  }

  // Version « embedded » : Google retire son propre en-tête, la page reste HorseCo.
  var src = FORM_URL.replace(/\?.*$/, "") + "?embedded=true";

  var frame = document.createElement("iframe");
  frame.src = src;
  frame.title = "Questionnaire HorseCo";
  frame.loading = "lazy";
  frame.setAttribute("frameborder", "0");
  frame.setAttribute("marginheight", "0");
  frame.setAttribute("marginwidth", "0");
  frame.textContent = "Chargement…";
  zone.appendChild(frame);

  direct.href = FORM_URL;
  direct.target = "_blank";
  direct.rel = "noopener";
})();
