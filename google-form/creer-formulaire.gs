/**
 * ============================================================
 *  HORSECO — Générateur du questionnaire Google Forms
 *  Séminaire BTS 1 · Recycling · Septembre 2026
 *  10 questions + collecte d'e-mail · bilingue FR / EN
 * ============================================================
 *
 *  MODE D'EMPLOI (2 minutes)
 *  -------------------------
 *  1. Aller sur  https://script.google.com/home/start
 *  2. « Nouveau projet »
 *  3. Tout sélectionner dans l'éditeur (Ctrl+A) et coller CE fichier
 *  4. Bouton « Exécuter » ▶  (fonction : creerFormulaireHorseCo)
 *  5. Google demande une autorisation :
 *        « Examiner les autorisations » → choisir son compte
 *        → « Paramètres avancés » → « Accéder à Sans titre (non sécurisé) »
 *        → « Autoriser »
 *     (c'est normal : le script écrit dans VOTRE Drive, rien d'autre)
 *  6. Ouvrir le journal d'exécution (Ctrl+Entrée) : les liens s'affichent.
 *
 *        ▸ LIEN À DIFFUSER  → à mettre dans le QR code
 *        ▸ LIEN D'ÉDITION   → pour voir les réponses
 *
 *  7. Dans le formulaire : onglet « Réponses » → icône Sheets
 *     pour créer le tableau de dépouillement.
 *
 *  Le formulaire est bilingue : chaque question et chaque réponse
 *  porte le français puis l'anglais, comme l'exige le guide
 *  (« questions traduites aussi en anglais »).
 * ============================================================
 */

function creerFormulaireHorseCo() {

  var form = FormApp.create('HorseCo — Étude de marché / Market research');

  form.setTitle('HorseCo — Étude de marché / Market research')
      .setDescription(
        "HorseCo conçoit du matériel équestre haut de gamme à partir de cuir de sièges " +
        "automobiles récupéré en centre VHU, associé à du cuir artisanal de Toscane sur " +
        "tous les points de sécurité.\n\n" +
        "10 questions · environ 90 secondes · aucune donnée personnelle obligatoire.\n\n" +
        "— — —\n\n" +
        "HorseCo builds high-end riding equipment from car-seat leather reclaimed at " +
        "scrapyards, paired with artisan Italian leather on every safety-critical part.\n\n" +
        "10 questions · about 90 seconds · no personal data required."
      )
      .setConfirmationMessage(
        "Merci ! Votre réponse nourrit directement la gamme, les prix et la distribution de HorseCo.\n\n" +
        "Thank you! Your answer feeds straight into HorseCo's range, pricing and distribution."
      )
      .setProgressBar(true)
      .setShowLinkToRespondAgain(true)
      .setCollectEmail(false)
      .setAllowResponseEdits(false);

  /* --------------------------------------------------------
     Repère terrain : qui a fait passer le questionnaire.
     Permet de répartir les 50 personnes entre les membres
     de l'équipe et de vérifier la couverture.
     -------------------------------------------------------- */
  form.addTextItem()
      .setTitle('Enquêteur — initiales / Interviewer — initials')
      .setHelpText('Rempli par le membre de l\'équipe, pas par la personne interrogée.')
      .setRequired(false);

  form.addPageBreakItem()
      .setTitle('Vous et le cheval / You and horses');

  /* ---------- 1 ---------- */
  qcm(form, '1. Vous êtes… / You are…', [
    'Cavalier·ère régulier·ère — Regular rider',
    'Cavalier·ère occasionnel·le — Occasional rider',
    'Propriétaire de cheval — Horse owner',
    'Professionnel du cheval (moniteur, écurie, groom) — Equestrian professional',
    'Non-cavalier·ère — Not a rider'
  ], true);

  /* ---------- 2 ---------- */
  qcm(form, '2. Votre tranche d\'âge / Your age group', [
    'Moins de 18 ans — Under 18',
    '18 – 25 ans — 18 to 25',
    '26 – 40 ans — 26 to 40',
    '41 – 60 ans — 41 to 60',
    'Plus de 60 ans — Over 60'
  ], true);

  /* ---------- 3 ---------- */
  qcm(form, '3. Quel budget consacrez-vous par an à l\'équipement équestre ? / How much do you spend on riding equipment per year?', [
    'Aucun — None',
    'Moins de 200 € — Under €200',
    '200 – 500 € — €200 to 500',
    '500 – 1 500 € — €500 to 1,500',
    '1 500 – 3 000 € — €1,500 to 3,000',
    'Plus de 3 000 € — Over €3,000'
  ], true);

  /* ---------- 4 ---------- */
  cases(form, '4. Quand vous achetez du matériel équestre, qu\'est-ce qui compte le plus ? / When buying riding gear, what matters most?', [
    'Sécurité et solidité — Safety and durability',
    'Confort du cheval — Comfort for the horse',
    'Prix — Price',
    'Esthétique et design — Look and design',
    'Notoriété de la marque — Brand reputation',
    'Origine des matériaux — Where the materials come from',
    'Impact environnemental — Environmental impact'
  ], 'Plusieurs réponses possibles. / Select all that apply.', true);

  form.addPageBreakItem()
      .setTitle('Le concept HorseCo / The HorseCo concept')
      .setHelpText(
        'HorseCo récupère le cuir des sièges de voitures en fin de vie, le remet en état, ' +
        'et le monte en selles, bottes et cravaches. Le cuir artisanal de Toscane est réservé ' +
        'aux zones de sécurité : arçon, sanglons, étrivières.\n\n' +
        'HorseCo reclaims leather from end-of-life car seats, restores it, and turns it into ' +
        'saddles, boots and crops. Artisan Tuscan leather is reserved for the safety-critical ' +
        'parts: tree, girth straps, stirrup leathers.'
      );

  /* ---------- 5 : échelle 1–5 ---------- */
  form.addScaleItem()
      .setTitle('5. Un équipement équestre haut de gamme en cuir automobile récupéré, avec du cuir italien sur les zones de sécurité : qu\'en pensez-vous ? / How appealing is that idea to you?')
      .setBounds(1, 5)
      .setLabels('Pas du tout séduisant — Not appealing', 'Très séduisant — Very appealing')
      .setRequired(true);

  /* ---------- 6 ---------- */
  cases(form, '6. Qu\'est-ce qui vous freinerait le plus ? / What would hold you back the most?', [
    'Un doute sur la solidité — Doubts about durability',
    'L\'hygiène ou l\'odeur — Hygiene or smell',
    'Un prix trop élevé — Too expensive',
    'L\'esthétique — The look',
    'L\'idée d\'un matériau de seconde main — The idea of second-hand material',
    'Rien, aucun frein — Nothing, no reservations'
  ], 'Plusieurs réponses possibles. / Select all that apply.', true);

  form.addPageBreakItem()
      .setTitle('Prix, gamme et achat / Price, range and purchase');

  /* ---------- 7 ---------- */
  qcm(form, '7. Combien paieriez-vous une paire de bottes d\'équitation HorseCo ? / What would you pay for a pair of HorseCo riding boots?', [
    'Moins de 150 € — Under €150',
    '150 – 300 € — €150 to 300',
    '300 – 500 € — €300 to 500',
    '500 – 800 € — €500 to 800',
    'Plus de 800 € — Over €800'
  ], true);

  /* ---------- 8 ---------- */
  qcm(form, '8. Seriez-vous prêt·e à payer plus cher pour un produit recyclé fabriqué en France ? / Would you pay more for a recycled product made in France?', [
    'Oui, jusqu\'à 20 % de plus — Yes, up to 20% more',
    'Oui, jusqu\'à 10 % de plus — Yes, up to 10% more',
    'Seulement au même prix — Only at the same price',
    'Non, je le veux moins cher — No, I want it cheaper'
  ], true);

  /* ---------- 9 ---------- */
  qcm(form, '9. Quelle pièce vous intéresserait le plus ? / Which piece would interest you most?', [
    'La selle — The saddle',
    'Les bottes — The boots',
    'La cravache — The riding crop',
    'La besace et la petite maroquinerie — The bag and small leather goods',
    'Les accessoires du cheval (licol, tapis) — Horse accessories (halter, pad)'
  ], true);

  /* ---------- 10 ---------- */
  qcm(form, '10. Où achèteriez-vous ce type de produit ? / Where would you buy this kind of product?', [
    'Sur le site de la marque — On the brand\'s website',
    'En sellerie spécialisée — In a specialist tack shop',
    'Sur un concours ou un salon équestre — At a horse show or trade fair',
    'Dans un pop-up store — In a pop-up store',
    'Sur une marketplace en ligne — On an online marketplace'
  ], true);

  /* ---------- Collecte d'e-mail ---------- */
  form.addPageBreakItem()
      .setTitle('Rester informé·e / Stay in touch');

  form.addTextItem()
      .setTitle('Votre e-mail, pour être averti·e de nos annonces')
      .setHelpText(
        'Facultatif. Lancement de la collection, pop-up stores, salons — rien d\'autre, ' +
        'et vous pouvez vous désinscrire à tout moment.\n\n' +
        'Your email, to hear about our announcements. Optional: collection launch, ' +
        'pop-up stores, trade fairs — nothing else, unsubscribe any time.'
      )
      .setRequired(false)
      .setValidation(
        FormApp.createTextValidation()
          .setHelpText('Merci de saisir une adresse e-mail valide. / Please enter a valid email address.')
          .requireTextIsEmail()
          .build()
      );

  /* -------------------------------------------------------- */
  var diffusion = form.getPublishedUrl();
  var edition   = form.getEditUrl();

  Logger.log('======================================================');
  Logger.log(' HORSECO — formulaire créé (10 questions + e-mail)');
  Logger.log('======================================================');
  Logger.log(' LIEN À DIFFUSER (QR code, rue) :');
  Logger.log(' ' + diffusion);
  Logger.log('');
  Logger.log(' LIEN D\'ÉDITION (réponses, réglages) :');
  Logger.log(' ' + edition);
  Logger.log('======================================================');

  return { diffusion: diffusion, edition: edition };
}

/* ---------- Raccourcis ---------- */

/** Question à choix unique (boutons radio). */
function qcm(form, titre, choix, requis) {
  form.addMultipleChoiceItem()
      .setTitle(titre)
      .setChoiceValues(choix)
      .setRequired(!!requis);
}

/** Question à choix multiples (cases à cocher). */
function cases(form, titre, choix, aide, requis) {
  var item = form.addCheckboxItem()
      .setTitle(titre)
      .setChoiceValues(choix)
      .setRequired(!!requis);
  if (aide) item.setHelpText(aide);
}
