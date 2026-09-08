/* ============================================================
   HORSECO — Questionnaire d'étude de marché (version hors ligne)
   10 questions + e-mail · FR / EN · collecte terrain sans réseau
   ============================================================

   Cette page est la ROUE DE SECOURS du Google Form : elle
   fonctionne sans connexion, dans la rue, et garde les réponses
   dans le navigateur du téléphone (localStorage). En fin de
   session, « Exporter CSV » sort un fichier ouvrable dans Excel
   ou Google Sheets, à recoller dans le tableau de dépouillement.

   Le questionnaire officiel est le Google Form : questionnaire.html
   ============================================================ */

(function () {
  "use strict";

  var KEY_DATA = "horseco.v1.responses";
  var KEY_LANG = "horseco.v1.lang";
  var KEY_WHO  = "horseco.v1.enqueteur";

  /* ---------- Textes d'interface ---------- */
  var UI = {
    fr: {
      introEyebrow: "Étude de marché · Septembre 2026",
      introTitle: "Quatre-vingt-dix secondes pour nous dire si nous avons raison.",
      introLede: "HorseCo conçoit du matériel équestre haut de gamme à partir de cuir de sièges automobiles récupéré en casse, associé à du cuir artisanal de Toscane sur les points de sécurité. Dix questions, aucune donnée personnelle obligatoire.",
      whoLabel: "Enquêteur (initiales, facultatif)",
      whoPlaceholder: "ex. LM",
      start: "Commencer",
      metaQuestions: "Questions",
      metaTime: "Durée",
      metaTimeVal: "≈ 90 s",
      metaLang: "Langues",
      back: "Retour",
      next: "Suivant",
      skip: "Passer",
      finish: "Terminer",
      multiHint: "Plusieurs réponses possibles.",
      optionalHint: "Facultatif — vous pouvez passer.",
      of: "sur",
      doneTitle: "Merci.",
      doneLede: "Votre réponse est enregistrée. Elle nourrit directement la gamme, les prix et le réseau de distribution de HorseCo.",
      again: "Nouvelle réponse",
      site: "Voir le site",
      tally: function (n) { return n + (n > 1 ? " réponses collectées" : " réponse collectée"); },
      results: "Résultats",
      hideResults: "Masquer",
      export: "Exporter CSV",
      reset: "Vider",
      resetAsk: "Effacer définitivement toutes les réponses enregistrées sur cet appareil ?",
      resetDone: "Réponses effacées",
      exported: "Fichier CSV téléchargé",
      nothing: "Aucune réponse à exporter",
      resultsTitle: "Résultats en direct",
      resultsLede: function (n) { return "Sur " + n + " réponse" + (n > 1 ? "s" : "") + " collectée" + (n > 1 ? "s" : "") + " sur cet appareil."; },
      resultsEmpty: "Aucune réponse pour l'instant. Les résultats s'afficheront ici au fur et à mesure.",
      scaleLow: "Pas du tout séduisant",
      scaleHigh: "Très séduisant"
    },
    en: {
      introEyebrow: "Market research · September 2026",
      introTitle: "Ninety seconds to tell us whether we are right.",
      introLede: "HorseCo builds high-end riding equipment from car-seat leather reclaimed at scrapyards, paired with artisan Italian leather on every safety-critical part. Ten questions, no personal data required.",
      whoLabel: "Interviewer (initials, optional)",
      whoPlaceholder: "e.g. LM",
      start: "Start",
      metaQuestions: "Questions",
      metaTime: "Length",
      metaTimeVal: "≈ 90 s",
      metaLang: "Languages",
      back: "Back",
      next: "Next",
      skip: "Skip",
      finish: "Finish",
      multiHint: "Select all that apply.",
      optionalHint: "Optional — you may skip this.",
      of: "of",
      doneTitle: "Thank you.",
      doneLede: "Your answer has been recorded. It feeds straight into HorseCo's range, pricing and distribution.",
      again: "New response",
      site: "Visit the site",
      tally: function (n) { return n + (n > 1 ? " responses collected" : " response collected"); },
      results: "Results",
      hideResults: "Hide",
      export: "Export CSV",
      reset: "Clear",
      resetAsk: "Permanently delete every response stored on this device?",
      resetDone: "Responses cleared",
      exported: "CSV file downloaded",
      nothing: "No responses to export",
      resultsTitle: "Live results",
      resultsLede: function (n) { return "Based on " + n + " response" + (n > 1 ? "s" : "") + " collected on this device."; },
      resultsEmpty: "No responses yet. Results will appear here as they come in.",
      scaleLow: "Not appealing at all",
      scaleHigh: "Very appealing"
    }
  };

  /* ---------- Les 10 questions, puis la collecte d'e-mail ---------- */
  var Q = [
    {
      id: "q1", type: "single",
      fr: "Vous êtes…", en: "You are…",
      of: ["Cavalier·ère régulier·ère", "Cavalier·ère occasionnel·le", "Propriétaire de cheval",
           "Professionnel du cheval (moniteur, écurie, groom)", "Non-cavalier·ère"],
      oe: ["Regular rider", "Occasional rider", "Horse owner",
           "Equestrian professional (instructor, stable, groom)", "Not a rider"]
    },
    {
      id: "q2", type: "single",
      fr: "Votre tranche d'âge", en: "Your age group",
      of: ["Moins de 18 ans", "18 – 25 ans", "26 – 40 ans", "41 – 60 ans", "Plus de 60 ans"],
      oe: ["Under 18", "18 – 25", "26 – 40", "41 – 60", "Over 60"]
    },
    {
      id: "q3", type: "single",
      fr: "Quel budget consacrez-vous par an à l'équipement équestre ?",
      en: "How much do you spend on riding equipment per year?",
      of: ["Aucun", "Moins de 200 €", "200 – 500 €", "500 – 1 500 €", "1 500 – 3 000 €", "Plus de 3 000 €"],
      oe: ["None", "Under €200", "€200 – 500", "€500 – 1,500", "€1,500 – 3,000", "Over €3,000"]
    },
    {
      id: "q4", type: "multi",
      fr: "Quand vous achetez du matériel équestre, qu'est-ce qui compte le plus ?",
      en: "When buying riding gear, what matters most to you?",
      of: ["Sécurité et solidité", "Confort du cheval", "Prix", "Esthétique et design",
           "Notoriété de la marque", "Origine des matériaux", "Impact environnemental"],
      oe: ["Safety and durability", "Comfort for the horse", "Price", "Look and design",
           "Brand reputation", "Where the materials come from", "Environmental impact"]
    },
    {
      id: "q5", type: "scale",
      fr: "Un équipement équestre haut de gamme fait de cuir automobile récupéré, avec du cuir artisanal italien sur les zones de sécurité : qu'en pensez-vous ?",
      en: "High-end riding equipment made from reclaimed car leather, with artisan Italian leather on the safety-critical parts: how appealing is that?"
    },
    {
      id: "q6", type: "multi",
      fr: "Qu'est-ce qui vous freinerait le plus ?", en: "What would hold you back the most?",
      of: ["Un doute sur la solidité", "L'hygiène ou l'odeur", "Un prix trop élevé",
           "L'esthétique", "L'idée d'un matériau de seconde main", "Rien, aucun frein"],
      oe: ["Doubts about durability", "Hygiene or smell", "Too expensive",
           "The look", "The idea of second-hand material", "Nothing, no reservations"]
    },
    {
      id: "q7", type: "single",
      fr: "Combien paieriez-vous une paire de bottes d'équitation HorseCo ?",
      en: "What would you pay for a pair of HorseCo riding boots?",
      of: ["Moins de 150 €", "150 – 300 €", "300 – 500 €", "500 – 800 €", "Plus de 800 €"],
      oe: ["Under €150", "€150 – 300", "€300 – 500", "€500 – 800", "Over €800"]
    },
    {
      id: "q8", type: "single",
      fr: "Seriez-vous prêt·e à payer plus cher pour un produit recyclé fabriqué en France ?",
      en: "Would you pay more for a recycled product made in France?",
      of: ["Oui, jusqu'à 20 % de plus", "Oui, jusqu'à 10 % de plus", "Seulement au même prix", "Non, je le veux moins cher"],
      oe: ["Yes, up to 20% more", "Yes, up to 10% more", "Only at the same price", "No, I want it cheaper"]
    },
    {
      id: "q9", type: "single",
      fr: "Quelle pièce vous intéresserait le plus ?", en: "Which piece would interest you most?",
      of: ["La selle", "Les bottes", "La cravache", "La besace et la petite maroquinerie", "Les accessoires du cheval (licol, tapis)"],
      oe: ["The saddle", "The boots", "The riding crop", "The bag and small leather goods", "Horse accessories (halter, saddle pad)"]
    },
    {
      id: "q10", type: "single",
      fr: "Où achèteriez-vous ce type de produit ?", en: "Where would you buy this kind of product?",
      of: ["Sur le site de la marque", "En sellerie spécialisée", "Sur un concours ou un salon équestre",
           "Dans un pop-up store", "Sur une marketplace en ligne"],
      oe: ["On the brand's website", "In a specialist tack shop", "At a horse show or trade fair",
           "In a pop-up store", "On an online marketplace"]
    },
    {
      id: "email", type: "text", optional: true,
      fr: "Votre e-mail, pour être averti·e de nos annonces",
      en: "Your email, to hear about our announcements",
      subFr: "Lancement de la collection, pop-up stores, salons — rien d'autre, et désinscription à tout moment.",
      subEn: "Collection launch, pop-up stores, trade fairs — nothing else, unsubscribe any time.",
      ph: "prenom@exemple.fr"
    }
  ];

  /* Nombre de vraies questions : le champ e-mail n'en est pas une. */
  var COUNT = Q.filter(function (q) { return q.id !== "email"; }).length;

  /* ---------- Stockage ---------- */
  function load(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function save(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* navigation privée */ } }

  function responses() {
    try { return JSON.parse(load(KEY_DATA) || "[]"); } catch (e) { return []; }
  }
  function pushResponse(rec) {
    var all = responses();
    all.push(rec);
    save(KEY_DATA, JSON.stringify(all));
  }

  /* ---------- État ---------- */
  var stored = load(KEY_LANG);
  var lang = stored === "en" || stored === "fr"
    ? stored
    : ((navigator.language || "fr").slice(0, 2) === "en" ? "en" : "fr");

  var view = "intro";        // intro | quiz | done | results
  var step = 0;
  var answers = {};
  var who = load(KEY_WHO) || "";

  var stage = document.getElementById("stage");
  var bar = document.getElementById("bar");
  var toastEl = document.getElementById("toast");
  var toastTimer = null;

  /* ---------- Utilitaires ---------- */
  function t() { return UI[lang]; }
  function label(q) { return lang === "fr" ? q.fr : q.en; }
  function sub(q) { return lang === "fr" ? q.subFr : q.subEn; }
  function options(q) { return lang === "fr" ? q.of : q.oe; }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.dataset.show = "true";
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.dataset.show = "false"; }, 2600);
  }

  /* ---------- Rendu ---------- */
  function render() {
    stage.textContent = "";
    document.documentElement.lang = lang;
    document.querySelectorAll(".lang button").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.lang === lang));
    });
    document.getElementById("btn-results").textContent = view === "results" ? t().hideResults : t().results;
    document.getElementById("btn-export").textContent = t().export;
    document.getElementById("btn-reset").textContent = t().reset;
    document.getElementById("tally").textContent = t().tally(responses().length);

    if (view === "intro")   { bar.style.width = "0%";   renderIntro(); }
    if (view === "quiz")    { bar.style.width = (step / Q.length * 100) + "%"; renderQuestion(); }
    if (view === "done")    { bar.style.width = "100%"; renderDone(); }
    if (view === "results") { bar.style.width = "100%"; renderResults(); }
  }

  function renderIntro() {
    var card = el("div", "q-card q-intro");

    card.appendChild(el("p", "eyebrow", t().introEyebrow));
    card.appendChild(el("h1", null, t().introTitle));
    card.appendChild(el("p", "lede", t().introLede));

    var meta = el("div", "q-meta");
    [[t().metaQuestions, String(COUNT)], [t().metaTime, t().metaTimeVal], [t().metaLang, "FR / EN"]]
      .forEach(function (pair) {
        var d = el("div");
        d.appendChild(el("span", "k", pair[0]));
        d.appendChild(el("span", "v", pair[1]));
        meta.appendChild(d);
      });
    card.appendChild(meta);

    var wrapWho = el("div");
    var lab = el("label", "q-count", t().whoLabel);
    lab.setAttribute("for", "who");
    lab.style.display = "block";
    lab.style.marginBottom = "0.6rem";
    var input = el("input", "q-field");
    input.id = "who";
    input.type = "text";
    input.maxLength = 6;
    input.placeholder = t().whoPlaceholder;
    input.value = who;
    input.addEventListener("input", function () {
      who = input.value.trim();
      save(KEY_WHO, who);
    });
    wrapWho.appendChild(lab);
    wrapWho.appendChild(input);
    card.appendChild(wrapWho);

    var start = el("button", "btn", t().start);
    start.type = "button";
    start.style.justifySelf = "start";
    start.addEventListener("click", function () {
      answers = {};
      step = 0;
      view = "quiz";
      render();
    });
    card.appendChild(start);

    stage.appendChild(card);
  }

  function renderQuestion() {
    var q = Q[step];
    var isEmail = q.id === "email";
    var card = el("div", "q-card");

    card.appendChild(el("p", "q-count",
      isEmail ? "HorseCo" : (step + 1) + " " + t().of + " " + COUNT));
    card.appendChild(el("h2", "q-title", label(q)));

    if (isEmail) card.appendChild(el("p", "q-hint", sub(q)));
    if (q.type === "multi") card.appendChild(el("p", "q-hint", t().multiHint));
    if (q.optional) card.appendChild(el("p", "q-hint", t().optionalHint));

    if (q.type === "single" || q.type === "multi") {
      var list = el("div", "opts");
      options(q).forEach(function (text, i) {
        var b = el("button", "opt");
        b.type = "button";
        b.dataset.shape = q.type === "single" ? "round" : "square";
        var picked = q.type === "multi"
          ? (answers[q.id] || []).indexOf(i) > -1
          : answers[q.id] === i;
        b.setAttribute("aria-pressed", String(picked));
        b.appendChild(el("span", "box"));
        b.appendChild(el("span", null, text));
        b.addEventListener("click", function () {
          if (q.type === "single") {
            answers[q.id] = i;
            render();
            setTimeout(advance, 220);
          } else {
            var cur = answers[q.id] || [];
            var at = cur.indexOf(i);
            if (at > -1) cur.splice(at, 1); else cur.push(i);
            answers[q.id] = cur;
            b.setAttribute("aria-pressed", String(at === -1));
          }
        });
        list.appendChild(b);
      });
      card.appendChild(list);
    }

    if (q.type === "scale") {
      var scale = el("div", "scale");
      var row = el("div", "scale-row");
      for (var v = 1; v <= 5; v++) {
        (function (val) {
          var b = el("button", null, String(val));
          b.type = "button";
          b.setAttribute("aria-pressed", String(answers[q.id] === val));
          b.setAttribute("aria-label", val + " / 5");
          b.addEventListener("click", function () {
            answers[q.id] = val;
            render();
            setTimeout(advance, 220);
          });
          row.appendChild(b);
        })(v);
      }
      var ends = el("div", "scale-ends");
      ends.appendChild(el("span", null, t().scaleLow));
      ends.appendChild(el("span", null, t().scaleHigh));
      scale.appendChild(row);
      scale.appendChild(ends);
      card.appendChild(scale);
    }

    if (q.type === "text") {
      var field = el("input", "q-field");
      field.type = "email";
      field.placeholder = q.ph;
      field.autocomplete = "email";
      field.inputMode = "email";
      field.value = answers[q.id] || "";
      field.addEventListener("input", function () { answers[q.id] = field.value.trim(); });
      field.addEventListener("keydown", function (e) { if (e.key === "Enter") advance(); });
      card.appendChild(field);
    }

    var nav = el("div", "q-nav");
    var back = el("button", "link-back", "← " + t().back);
    back.type = "button";
    back.hidden = step === 0;
    back.addEventListener("click", function () { step = Math.max(0, step - 1); render(); });
    nav.appendChild(back);

    var last = step === Q.length - 1;
    var needsNext = q.type === "multi" || q.type === "text" || last;
    if (needsNext) {
      var answered = q.type === "multi"
        ? (answers[q.id] || []).length > 0
        : (answers[q.id] != null && answers[q.id] !== "");
      var next = el("button", "btn",
        last ? t().finish : (answered || !q.optional ? t().next : t().skip));
      next.type = "button";
      next.addEventListener("click", advance);
      nav.appendChild(next);
    } else {
      nav.appendChild(el("span"));
    }
    card.appendChild(nav);

    stage.appendChild(card);
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function advance() {
    if (step < Q.length - 1) {
      step += 1;
      render();
    } else {
      submit();
    }
  }

  function submit() {
    var rec = { ts: new Date().toISOString(), lang: lang, who: who };
    Q.forEach(function (q) {
      var a = answers[q.id];
      if (a == null || a === "") { rec[q.id] = ""; return; }
      if (q.type === "multi") {
        rec[q.id] = a.map(function (i) { return q.of[i]; }).join(" | ");
      } else if (q.type === "single") {
        rec[q.id] = q.of[a];
      } else {
        rec[q.id] = String(a);
      }
    });
    pushResponse(rec);
    view = "done";
    render();
  }

  function renderDone() {
    var card = el("div", "q-card q-intro");
    card.appendChild(el("p", "eyebrow", "HorseCo"));
    card.appendChild(el("h1", null, t().doneTitle));
    card.appendChild(el("p", "lede", t().doneLede));

    var row = el("div");
    row.style.display = "flex";
    row.style.flexWrap = "wrap";
    row.style.gap = "0.9rem";

    var again = el("button", "btn", t().again);
    again.type = "button";
    again.addEventListener("click", function () {
      answers = {};
      step = 0;
      view = "quiz";
      render();
    });
    row.appendChild(again);

    var site = el("a", "btn", t().site);
    site.href = "index.html";
    row.appendChild(site);

    card.appendChild(row);
    stage.appendChild(card);
  }

  /* ---------- Résultats ---------- */
  function renderResults() {
    var all = responses();
    var box = el("div", "results");

    box.appendChild(el("p", "eyebrow", "HorseCo"));
    box.appendChild(el("h2", "q-title", t().resultsTitle));

    if (!all.length) {
      box.appendChild(el("p", "q-hint", t().resultsEmpty));
      stage.appendChild(box);
      return;
    }
    box.appendChild(el("p", "q-hint", t().resultsLede(all.length)));

    Q.forEach(function (q) {
      if (q.type === "text") return;
      var block = el("div", "result-block");
      block.appendChild(el("h3", null, label(q)));

      var buckets, keys;
      if (q.type === "scale") {
        keys = ["1", "2", "3", "4", "5"];
        buckets = { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 };
      } else {
        keys = q.of.slice();
        buckets = {};
        keys.forEach(function (k) { buckets[k] = 0; });
      }

      var total = 0;
      all.forEach(function (r) {
        var v = r[q.id];
        if (!v) return;
        total += 1;
        String(v).split(" | ").forEach(function (part) {
          if (buckets[part] != null) buckets[part] += 1;
        });
      });

      keys.forEach(function (k, i) {
        var pct = total ? Math.round(buckets[k] / total * 100) : 0;
        var row = el("div", "bar-row");
        row.appendChild(el("span", null, q.type === "scale" ? k + " / 5" : options(q)[i]));
        var track = el("span", "track");
        var fill = el("i");
        fill.style.width = pct + "%";
        track.appendChild(fill);
        row.appendChild(track);
        row.appendChild(el("span", "pct", pct + " %"));
        block.appendChild(row);
      });

      box.appendChild(block);
    });

    stage.appendChild(box);
  }

  /* ---------- Export CSV ---------- */
  function exportCsv() {
    var all = responses();
    if (!all.length) { toast(t().nothing); return; }

    var cols = ["ts", "lang", "who"].concat(Q.map(function (q) { return q.id; }));
    var head = ["Horodatage", "Langue", "Enqueteur"].concat(Q.map(function (q) { return q.fr; }));

    function cell(v) {
      var s = v == null ? "" : String(v);
      return '"' + s.replace(/"/g, '""') + '"';
    }

    var lines = [head.map(cell).join(";")];
    all.forEach(function (r) {
      lines.push(cols.map(function (c) { return cell(r[c]); }).join(";"));
    });

    // BOM UTF-8 + point-virgule : Excel français ouvre le fichier correctement.
    var blob = new Blob(["﻿" + lines.join("\r\n")], { type: "text/csv;charset=utf-8;" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "horseco-reponses-" + new Date().toISOString().slice(0, 10) + ".csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    toast(t().exported);
  }

  /* ---------- Branchements ---------- */
  document.querySelectorAll(".lang button").forEach(function (b) {
    b.addEventListener("click", function () {
      lang = b.dataset.lang;
      save(KEY_LANG, lang);
      render();
    });
  });

  document.getElementById("btn-results").addEventListener("click", function () {
    view = view === "results" ? "intro" : "results";
    render();
  });
  document.getElementById("btn-export").addEventListener("click", exportCsv);
  document.getElementById("btn-reset").addEventListener("click", function () {
    if (!responses().length) { toast(t().nothing); return; }
    if (!window.confirm(t().resetAsk)) return;
    save(KEY_DATA, "[]");
    view = "intro";
    render();
    toast(t().resetDone);
  });

  render();
})();
