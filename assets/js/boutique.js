/* ============================================================
   HORSECO — Fiche produit et panier
   ------------------------------------------------------------
   Un clic sur une pièce ouvre sa fiche : on choisit la teinte
   du cuir, on l'ajoute au panier. Pas de paiement : le panier
   reste sur l'appareil (stockage local), rien n'est envoyé.
   ============================================================ */

(function () {
  "use strict";

  var CATALOGUE = {
    selle:    { nom: "Maremma",   type: "Selle mixte",          prix: 1890, recup: "68 % de cuir récupéré",
                texte: "Siège et quartiers en cuir récupéré, sanglons et étrivières en cuir de Toscane." },
    filet:    { nom: "Volterra",  type: "Filet",                prix: 190,  recup: "55 % de cuir récupéré",
                texte: "Frontal et muserolle en cuir récupéré, montants et rênes en cuir de Toscane, boucles en laiton." },
    cravache: { nom: "Fucecchio", type: "Cravache de dressage", prix: 110,  recup: "81 % de cuir récupéré",
                texte: "Gainage tressé en cuir récupéré, pommeau en laiton." },
    besace:   { nom: "Siena",     type: "Besace de pansage",    prix: 290,  recup: "88 % de cuir récupéré",
                texte: "Trousse à brosses en cuir récupéré, sangle en cuir de Toscane." }
  };

  // Des teintes sombres, comme un cuir de sellerie : rien de plus.
  var TEINTES = [
    { id: "cognac",   nom: "Cognac",   couleur: "#93501F" },
    { id: "havane",   nom: "Havane",   couleur: "#4E2C1C" },
    { id: "bordeaux", nom: "Bordeaux", couleur: "#5C1426" },
    { id: "noir",     nom: "Noir",     couleur: "#1E1A17" }
  ];

  var CLE = "horseco.panier";
  var MAX = 20;

  function teinte(id) {
    for (var i = 0; i < TEINTES.length; i++) if (TEINTES[i].id === id) return TEINTES[i];
    return null;
  }
  function photo(id, t) {
    return t === "cognac" ? "assets/img/" + id + ".jpg" : "assets/img/teintes/" + id + "-" + t + ".jpg";
  }
  function euros(n) { return n.toLocaleString("fr-FR") + " €"; }

  /* ---------- Panier (stockage local) ---------- */
  function lire() {
    try {
      var v = JSON.parse(localStorage.getItem(CLE) || "[]");
      return Array.isArray(v) ? v.filter(function (l) {
        return l && CATALOGUE[l.id] && teinte(l.teinte) && l.qte >= 1 && l.qte <= MAX;
      }) : [];
    } catch (e) { return []; }
  }
  var panier = lire();

  function enregistrer() {
    try { localStorage.setItem(CLE, JSON.stringify(panier)); } catch (e) { /* navigation privée */ }
    majCompte();
    rendrePanier();
  }

  function ajouter(id, t) {
    for (var i = 0; i < panier.length; i++) {
      if (panier[i].id === id && panier[i].teinte === t) {
        panier[i].qte = Math.min(MAX, panier[i].qte + 1);
        enregistrer();
        return;
      }
    }
    panier.push({ id: id, teinte: t, qte: 1 });
    enregistrer();
  }

  function majCompte() {
    var n = panier.reduce(function (s, l) { return s + l.qte; }, 0);
    document.querySelectorAll("[data-panier-compte]").forEach(function (el) {
      el.textContent = n ? "(" + n + ")" : "";
    });
  }

  /* ---------- Message discret ---------- */
  var toast = document.createElement("div");
  toast.className = "toast";
  toast.setAttribute("role", "status");
  toast.setAttribute("aria-live", "polite");
  document.body.appendChild(toast);
  var minuteur;
  function annoncer(msg) {
    toast.textContent = msg;
    toast.dataset.show = "true";
    clearTimeout(minuteur);
    minuteur = setTimeout(function () { toast.dataset.show = "false"; }, 2600);
  }

  /* ---------- Ouverture / fermeture ---------- */
  var retourFocus = null;
  function ouvrir(el, focus) {
    retourFocus = document.activeElement;
    el.hidden = false;
    document.documentElement.classList.add("verrou");
    if (focus) focus.focus();
  }
  function fermer(el) {
    el.hidden = true;
    if (fiche.hidden && tiroir.hidden) document.documentElement.classList.remove("verrou");
    if (retourFocus && retourFocus.focus) retourFocus.focus();
  }

  /* ---------- Fiche produit ---------- */
  var fiche = document.createElement("div");
  fiche.className = "fiche";
  fiche.hidden = true;
  fiche.setAttribute("role", "dialog");
  fiche.setAttribute("aria-modal", "true");
  fiche.setAttribute("aria-labelledby", "fiche-nom");
  fiche.innerHTML =
    '<div class="fiche-carte">' +
    '  <button type="button" class="fermer" data-fiche-fermer aria-label="Fermer">×</button>' +
    '  <figure class="fiche-media"><img alt=""></figure>' +
    '  <div class="fiche-infos">' +
    '    <p class="caps fiche-type"></p>' +
    '    <h3 id="fiche-nom"></h3>' +
    '    <p class="fiche-prix"></p>' +
    '    <p class="fiche-texte"></p>' +
    '    <p class="fiche-recup"></p>' +
    '    <div class="fiche-teintes">' +
    '      <p class="caps">Teinte · <span class="fiche-teinte-nom"></span></p>' +
    '      <div class="pastilles" role="radiogroup" aria-label="Teinte du cuir">' +
    TEINTES.map(function (t) {
      return '<button type="button" class="pastille" role="radio" aria-checked="false" data-teinte="' + t.id +
        '" aria-label="' + t.nom + '" title="' + t.nom + '" style="--c:' + t.couleur + '"></button>';
    }).join("") +
    '      </div>' +
    '    </div>' +
    '    <button type="button" class="btn btn--solid fiche-ajouter">Ajouter au panier</button>' +
    '  </div>' +
    '</div>';
  document.body.appendChild(fiche);

  var courant = { id: null, teinte: "cognac" };
  var ficheImg = fiche.querySelector(".fiche-media img");

  function choisirTeinte(t) {
    var p = CATALOGUE[courant.id];
    courant.teinte = t;
    fiche.querySelectorAll(".pastille").forEach(function (b) {
      var actif = b.dataset.teinte === t;
      b.setAttribute("aria-checked", String(actif));
      b.tabIndex = actif ? 0 : -1;
    });
    fiche.querySelector(".fiche-teinte-nom").textContent = teinte(t).nom;
    ficheImg.src = photo(courant.id, t);
    ficheImg.alt = p.type + " " + p.nom + ", cuir " + teinte(t).nom.toLowerCase();
  }

  function ouvrirFiche(id) {
    var p = CATALOGUE[id];
    courant.id = id;
    fiche.querySelector(".fiche-type").textContent = p.type;
    fiche.querySelector("#fiche-nom").textContent = p.nom;
    fiche.querySelector(".fiche-prix").textContent = euros(p.prix);
    fiche.querySelector(".fiche-texte").textContent = p.texte;
    fiche.querySelector(".fiche-recup").textContent = p.recup;
    TEINTES.forEach(function (t) { new Image().src = photo(id, t.id); });   // teintes prêtes au clic
    choisirTeinte("cognac");
    ouvrir(fiche, fiche.querySelector("[data-fiche-fermer]"));
  }

  fiche.addEventListener("click", function (e) {
    if (e.target === fiche || e.target.closest("[data-fiche-fermer]")) { fermer(fiche); return; }
    var b = e.target.closest(".pastille");
    if (b) { choisirTeinte(b.dataset.teinte); return; }
    if (e.target.closest(".fiche-ajouter")) {
      var p = CATALOGUE[courant.id];
      ajouter(courant.id, courant.teinte);
      fermer(fiche);
      annoncer(p.type + " " + p.nom + " · " + teinte(courant.teinte).nom + " — ajouté au panier");
    }
  });

  // Flèches gauche / droite dans le groupe de teintes
  fiche.querySelector(".pastilles").addEventListener("keydown", function (e) {
    var sens = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!sens) return;
    e.preventDefault();
    var i = TEINTES.map(function (t) { return t.id; }).indexOf(courant.teinte);
    var suivant = TEINTES[(i + sens + TEINTES.length) % TEINTES.length].id;
    choisirTeinte(suivant);
    fiche.querySelector('.pastille[data-teinte="' + suivant + '"]').focus();
  });

  /* ---------- Tiroir du panier ---------- */
  var tiroir = document.createElement("div");
  tiroir.className = "panier";
  tiroir.hidden = true;
  tiroir.setAttribute("role", "dialog");
  tiroir.setAttribute("aria-modal", "true");
  tiroir.setAttribute("aria-labelledby", "panier-titre");
  tiroir.innerHTML =
    '<div class="panier-voile" data-panier-fermer></div>' +
    '<aside class="panier-tiroir">' +
    '  <div class="panier-tete">' +
    '    <p class="caps" id="panier-titre">Votre panier</p>' +
    '    <button type="button" class="fermer" data-panier-fermer aria-label="Fermer le panier">×</button>' +
    '  </div>' +
    '  <ul class="panier-liste"></ul>' +
    '  <p class="panier-vide">Votre panier est vide.</p>' +
    '  <div class="panier-pied">' +
    '    <div class="panier-total"><span>Total</span><span class="panier-total-v"></span></div>' +
    '    <p class="panier-note">Le paiement en ligne ouvrira avec le lancement de la collection.</p>' +
    '    <button type="button" class="btn" data-panier-fermer>Continuer la visite</button>' +
    '  </div>' +
    '</aside>';
  document.body.appendChild(tiroir);

  function rendrePanier() {
    var liste = tiroir.querySelector(".panier-liste");
    liste.innerHTML = "";
    panier.forEach(function (l, i) {
      var p = CATALOGUE[l.id], t = teinte(l.teinte);
      var li = document.createElement("li");
      li.className = "panier-ligne";
      li.innerHTML =
        '<img src="' + photo(l.id, l.teinte) + '" alt="">' +
        '<div>' +
        '  <p class="type">' + p.type + '</p>' +
        '  <h4>' + p.nom + '</h4>' +
        '  <p class="teinte"><i style="--c:' + t.couleur + '"></i>' + t.nom + '</p>' +
        '  <div class="qte">' +
        '    <button type="button" data-moins="' + i + '" aria-label="Un exemplaire de moins">−</button>' +
        '    <span>' + l.qte + '</span>' +
        '    <button type="button" data-plus="' + i + '" aria-label="Un exemplaire de plus">+</button>' +
        '  </div>' +
        '</div>' +
        '<div class="fin">' +
        '  <p class="prix">' + euros(p.prix * l.qte) + '</p>' +
        '  <button type="button" class="retirer" data-retirer="' + i + '">Retirer</button>' +
        '</div>';
      liste.appendChild(li);
    });
    var vide = panier.length === 0;
    liste.hidden = vide;
    tiroir.querySelector(".panier-vide").hidden = !vide;
    tiroir.querySelector(".panier-total").hidden = vide;
    tiroir.querySelector(".panier-note").hidden = vide;
    tiroir.querySelector(".panier-total-v").textContent =
      euros(panier.reduce(function (s, l) { return s + CATALOGUE[l.id].prix * l.qte; }, 0));
  }

  tiroir.addEventListener("click", function (e) {
    if (e.target.closest("[data-panier-fermer]")) { fermer(tiroir); return; }
    var b = e.target.closest("[data-plus], [data-moins], [data-retirer]");
    if (!b) return;
    var cle = b.hasAttribute("data-plus") ? "plus" : b.hasAttribute("data-moins") ? "moins" : "retirer";
    var i = +b.dataset[cle], l = panier[i];
    if (!l) return;
    if (cle === "plus") l.qte = Math.min(MAX, l.qte + 1);
    else if (cle === "moins" && l.qte > 1) l.qte -= 1;
    else panier.splice(i, 1);
    enregistrer();
    // Le focus reste sur le même bouton s'il existe encore
    var meme = tiroir.querySelector("[data-" + cle + '="' + i + '"]');
    (meme || tiroir.querySelector(".fermer")).focus();
  });

  /* ---------- Branchements ---------- */
  document.addEventListener("click", function (e) {
    if (e.target.closest("[data-panier-ouvrir]")) {
      e.preventDefault();
      ouvrir(tiroir, tiroir.querySelector(".fermer"));
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (!fiche.hidden) fermer(fiche);
    else if (!tiroir.hidden) fermer(tiroir);
  });

  // Un panier modifié dans un autre onglet se met à jour ici aussi.
  window.addEventListener("storage", function (e) {
    if (e.key !== CLE) return;
    panier = lire();
    majCompte();
    rendrePanier();
  });

  // Chaque pièce de la collection devient cliquable : on la reconnaît à sa photo.
  document.querySelectorAll(".tile").forEach(function (tile) {
    var img = tile.querySelector(".media img");
    var corps = tile.querySelector(".tile-body");
    if (!img || !corps) return;
    var id = (img.getAttribute("src") || "").split("/").pop().replace(/\.jpg.*$/, "");
    var p = CATALOGUE[id];
    if (!p) return;
    tile.dataset.produit = id;

    var points = document.createElement("span");
    points.className = "tile-teintes";
    points.setAttribute("aria-hidden", "true");
    points.innerHTML = TEINTES.map(function (t) { return '<i style="--c:' + t.couleur + '"></i>'; }).join("");

    var cta = document.createElement("button");
    cta.type = "button";
    cta.className = "tile-cta";
    cta.textContent = "Choisir sa teinte";
    cta.setAttribute("aria-label", "Choisir la teinte : " + p.type + " " + p.nom);

    corps.appendChild(points);
    corps.appendChild(cta);
    tile.addEventListener("click", function () { ouvrirFiche(id); });
  });

  majCompte();
  rendrePanier();
})();
