/* ============================================================
   HORSECO — Consentement cookies
   ------------------------------------------------------------
   Le bandeau ne fait pas de la figuration : tant que le choix
   n'est pas « accepte », le formulaire Google n'est pas chargé,
   donc aucun cookie tiers n'est déposé.

   Ce que le site utilise réellement :
   - aucune mesure d'audience, aucun traceur publicitaire
   - un stockage local pour retenir ce choix (et, sur la page
     hors ligne, les réponses saisies) : ça reste sur l'appareil
   - le formulaire intégré depuis Google Forms, qui lui dépose
     ses propres cookies — c'est ce que le bandeau conditionne
   ============================================================ */

(function () {
  "use strict";

  var CLE = "horseco.consentement";   // "accepte" | "refuse"
  var boite = null;

  function lire() { try { return localStorage.getItem(CLE); } catch (e) { return null; } }
  function ecrire(v) { try { localStorage.setItem(CLE, v); } catch (e) { /* navigation privée */ } }

  function diffuser(v) {
    document.documentElement.dataset.consentement = v;
    document.dispatchEvent(new CustomEvent("horseco:consentement", { detail: v }));
  }

  function construire() {
    if (boite) return boite;
    boite = document.createElement("div");
    boite.className = "cookies";
    boite.setAttribute("role", "dialog");
    boite.setAttribute("aria-modal", "true");
    boite.setAttribute("aria-labelledby", "cookies-titre");
    boite.hidden = true;
    boite.innerHTML =
      '<div class="cookies-carte">' +
      '  <p class="caps" id="cookies-titre">Cookies</p>' +
      '  <p>Ce site ne mesure pas son audience et ne vous suit pas. Seul le' +
      '     questionnaire, intégré depuis Google Forms, dépose des cookies.' +
      '     Si vous refusez, il ne sera pas chargé : un lien direct vous sera' +
      '     proposé à la place.</p>' +
      '  <div class="cookies-choix">' +
      '    <button type="button" class="btn" data-choix="refuse">Refuser</button>' +
      '    <button type="button" class="btn btn--solid" data-choix="accepte">Accepter</button>' +
      '  </div>' +
      '  <a class="cookies-plus" href="confidentialite.html">Ce que nous utilisons exactement</a>' +
      '</div>';

    boite.addEventListener("click", function (e) {
      var b = e.target.closest("[data-choix]");
      if (!b) return;
      var choix = b.dataset.choix;
      ecrire(choix);
      masquer();
      diffuser(choix);
    });

    document.body.appendChild(boite);
    return boite;
  }

  function afficher() {
    construire().hidden = false;
    var premier = boite.querySelector("[data-choix]");
    if (premier) premier.focus();
  }

  function masquer() { if (boite) boite.hidden = true; }

  // Le choix doit pouvoir être changé à tout moment : le lien du
  // pied de page rouvre la fenêtre.
  document.addEventListener("click", function (e) {
    if (e.target.closest("[data-cookies-rouvrir]")) {
      e.preventDefault();
      afficher();
    }
  });

  var choix = lire();
  if (choix === "accepte" || choix === "refuse") {
    diffuser(choix);
  } else {
    afficher();
  }
})();
