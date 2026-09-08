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

  /* Film du hero : muet et en boucle.
     Certains navigateurs exigent un appel explicite à play() malgré
     l'attribut autoplay ; s'ils refusent, l'affiche reste affichée.
     Si la personne a demandé moins d'animations, on ne lance rien. */
  var film = document.querySelector('.media--film video');
  if (film) {
    film.muted = true;             // condition de la lecture automatique
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      film.removeAttribute('autoplay');
      film.pause();
    } else {
      var lancer = function () {
        var essai = film.play();
        if (essai && essai.catch) essai.catch(function () { /* affiche conservée */ });
      };
      lancer();
      // Le premier appel peut arriver avant que la vidéo soit prête, ou
      // pendant que l'onglet est en arrière-plan : on retente aux moments utiles.
      film.addEventListener("canplay", lancer, { once: true });
      document.addEventListener("visibilitychange", function () {
        if (document.visibilityState === "visible" && film.paused) lancer();
      });
      window.addEventListener("pointerdown", lancer, { once: true });
    }
  }

  /* L'épure : la légende commande la zone colorée sur la selle.
     Survol pour prévisualiser, clic pour garder la zone affichée —
     le clic est ce qui fait fonctionner l'ensemble au doigt. */
  var plan = document.querySelector('.epure-photo .plan');
  var notes = document.querySelectorAll('.epure-notes .note');
  if (plan && notes.length) {
    var fixee = "";

    var afficher = function (z) {
      plan.dataset.zone = z;
      notes.forEach(function (b) {
        b.setAttribute("aria-pressed", String(b.dataset.z === fixee));
      });
    };

    notes.forEach(function (b) {
      var z = b.dataset.z;
      b.addEventListener("mouseenter", function () { if (!fixee) afficher(z); });
      b.addEventListener("mouseleave", function () { if (!fixee) afficher(""); });
      b.addEventListener("focus", function () { if (!fixee) afficher(z); });
      b.addEventListener("blur", function () { if (!fixee) afficher(""); });
      b.addEventListener("click", function () {
        fixee = (fixee === z) ? "" : z;
        afficher(fixee);
      });
    });
  }

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
