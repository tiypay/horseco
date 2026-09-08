/* ============================================================
   HORSECO — Intégration du Google Form
   ------------------------------------------------------------
   UNE SEULE LIGNE À REMPLIR : collez ci-dessous le lien donné
   par le script Apps Script (« LIEN À DIFFUSER »).

   Le formulaire n'est chargé qu'après acceptation des cookies :
   tant que le visiteur n'a pas accepté, aucune requête n'est
   envoyée à Google et aucun cookie tiers n'est déposé.
   ============================================================ */

var FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSd_B-GZ0P3lBtfHZcepFdf5fCavXH1gQkCQISdLK-naSxXJCA/viewform";

(function () {
  "use strict";

  var zone = document.getElementById("frame-zone");
  var direct = document.getElementById("direct");
  if (!zone) return;

  if (!FORM_URL) {
    zone.innerHTML =
      '<div class="embed-setup">' +
      '  <p class="caps">À faire avant la mise en ligne</p>' +
      '  <h2>Le lien du formulaire n’est pas encore renseigné.</h2>' +
      '  <p>Ouvrez <code>assets/js/form-embed.js</code> et collez le lien du Google Form ' +
      '     dans <code>FORM_URL</code>, à la première ligne. Rien d’autre à modifier.</p>' +
      '</div>';
    if (direct) direct.hidden = true;
    return;
  }

  if (direct) {
    direct.href = FORM_URL;
    direct.target = "_blank";
    direct.rel = "noopener";
  }

  function afficherFormulaire() {
    zone.textContent = "";
    // Version « embedded » : Google retire son propre en-tête.
    var frame = document.createElement("iframe");
    frame.src = FORM_URL.replace(/\?.*$/, "") + "?embedded=true";
    frame.title = "Questionnaire HorseCo";
    frame.loading = "lazy";
    frame.setAttribute("frameborder", "0");
    zone.appendChild(frame);
  }

  function afficherRepli() {
    zone.innerHTML =
      '<div class="embed-setup">' +
      '  <p class="caps">Formulaire non chargé</p>' +
      '  <h2>Vous avez refusé les cookies.</h2>' +
      '  <p>Le questionnaire est hébergé par Google Forms, qui dépose ses propres ' +
      '     cookies. Nous ne le chargeons donc pas ici. Deux solutions :</p>' +
      '  <div class="embed-repli">' +
      '    <a class="btn btn--solid" href="' + FORM_URL + '" target="_blank" rel="noopener">Ouvrir chez Google</a>' +
      '    <button type="button" class="btn" data-cookies-rouvrir>Changer mon choix</button>' +
      '  </div>' +
      '  <p><a href="questionnaire-hors-ligne.html">Ou répondre sans Google, hors ligne</a></p>' +
      '</div>';
  }

  function appliquer(choix) {
    if (choix === "accepte") afficherFormulaire();
    else if (choix === "refuse") afficherRepli();
  }

  document.addEventListener("horseco:consentement", function (e) { appliquer(e.detail); });

  // Si le choix a déjà été fait lors d'une visite précédente,
  // cookies.js a posé l'attribut avant que ce script ne s'exécute.
  appliquer(document.documentElement.dataset.consentement);
})();
