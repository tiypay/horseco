/* HorseCo — comportements du site vitrine. Volontairement minimal. */
(function () {
  "use strict";

  /* Réserves d'image.
     Tant qu'une photo n'est pas déposée dans assets/img/, la réserve
     affiche l'épure au trait à la place. Déposez le fichier, rechargez :
     la photo prend sa place, rien d'autre à modifier. */
  function markMissing(img) {
    var box = img.closest(".media");
    if (box) box.dataset.missing = "true";
  }

  document.querySelectorAll(".media img").forEach(function (img) {
    img.addEventListener("error", function () { markMissing(img); });
    // Une image déjà en échec au moment où le script s'exécute.
    if (img.complete && img.naturalWidth === 0) markMissing(img);
  });

  /* Saut d'ancre : compense la hauteur de l'en-tête. */
  var header = document.querySelector("header");
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var offset = header ? header.offsetHeight : 0;
      var top = target.getBoundingClientRect().top + window.scrollY - offset - 8;
      var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: top, behavior: reduce ? "auto" : "smooth" });
      history.replaceState(null, "", id);
    });
  });
})();
