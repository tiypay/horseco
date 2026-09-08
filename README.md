# HorseCo

Sellerie upcyclée. Cuir artisanal de Toscane sur les zones de sécurité,
cuir de sellerie automobile récupéré en centre VHU pour l'habillage.

Projet étudiant — Séminaire BTS 1, *Recycling & Upcycling*, septembre 2026.
Marque fictive.

---

## Les fichiers

| Fichier | Rôle |
|---|---|
| `index.html` | Site vitrine, une page |
| `questionnaire.html` | Coquille de marque autour du Google Form |
| `questionnaire-hors-ligne.html` | Secours sans réseau, export CSV |
| `google-form/creer-formulaire.gs` | Génère le Google Form (10 questions, FR/EN) |
| `assets/` | CSS, JS, logo |

Site statique : aucun serveur, aucune dépendance à installer.
Double-cliquer sur `index.html` suffit pour le voir.

---

## 1. Ajouter les photos

C'est **la seule chose qui manque** pour que le site ait l'allure d'une
vraie maison. Déposer les fichiers dans `assets/img/` avec ces noms
exacts, puis recharger la page :

| Fichier | Ce qu'on y voit | Cadrage |
|---|---|---|
| `hero.jpg` | Cavalier, cheval, ou détail de selle en mouvement | paysage large |
| `selle.jpg` | La selle Maremma | portrait 4:5 |
| `bottes.jpg` | Les bottes Volterra | portrait 4:5 |
| `cravache.jpg` | La cravache Fucecchio | portrait 4:5 |
| `besace.jpg` | La besace Siena | portrait 4:5 |
| `matiere-toscane.jpg` | Gros plan de cuir fauve, grain visible | paysage 4:3 |
| `matiere-vhu.jpg` | Siège de voiture en cuir, ou casse auto | paysage 4:3 |
| `atelier.jpg` | Établi, outils de sellier, mains au travail | paysage large |

Tant qu'une photo est absente, le site affiche une épure au trait à sa
place — rien ne casse, mais l'effet « maison de luxe » vient des images.

Sources gratuites et libres d'usage : [Pexels](https://www.pexels.com/fr-fr/),
[Unsplash](https://unsplash.com/fr). Chercher *horse riding, saddle,
leather, tannery, car interior leather, scrapyard*.

---

## Le questionnaire est en ligne

**Lien à diffuser** (QR code, enquête de rue) :
<https://docs.google.com/forms/d/e/1FAIpQLSd_B-GZ0P3lBtfHZcepFdf5fCavXH1gQkCQISdLK-naSxXJCA/viewform>

**Lien d'édition** (questions, réponses) :
<https://docs.google.com/forms/d/1cF4zurCwsKZcP__tze-3eETVEJh4ag84GEHH4GXQXzc/edit>

Répondants : *tous les utilisateurs qui ont le lien* — aucun compte Google
requis pour répondre. Le lien est déjà branché dans
`assets/js/form-embed.js`, donc `questionnaire.html` affiche le formulaire
dans l'habillage HorseCo.

Reste à faire : dans le formulaire, onglet **Réponses** → icône Sheets,
pour créer le tableau de dépouillement.

---

## 2. Recréer le Google Form (si besoin)

1. Ouvrir <https://script.google.com/home/start> → **Nouveau projet**
2. Tout sélectionner dans l'éditeur (`Ctrl+A`) et coller
   `google-form/creer-formulaire.gs`
3. **Exécuter** ▶ (fonction `creerFormulaireHorseCo`)
4. Autoriser : *Examiner les autorisations* → compte → *Paramètres avancés*
   → *Accéder à Sans titre (non sécurisé)* → *Autoriser*
   (le script n'écrit que dans votre Drive)
5. Le journal d'exécution affiche deux liens :
   - **lien à diffuser** → celui du QR code
   - **lien d'édition** → pour les réponses

Puis dans le formulaire : onglet **Réponses** → icône Sheets, pour créer
le tableau de dépouillement.

### Brancher le formulaire sur le site

Ouvrir `assets/js/form-embed.js` et coller le lien de diffusion à la
première ligne :

```js
var FORM_URL = "https://docs.google.com/forms/d/e/XXXX/viewform";
```

C'est la seule ligne à modifier. La page `questionnaire.html` affiche
alors le formulaire dans l'habillage HorseCo.

---

## 3. Enquête de rue — mercredi 11 h – 13 h

Cible : **50 personnes** (exigence du guide).

- Le QR code pointe vers le **lien Google Form direct**, pas vers le site :
  moins de clics, et ça marche même si le site est en panne.
  Générer le QR sur <https://www.qr-code-generator.com/> ou équivalent.
- Chaque membre de l'équipe remplit le champ **Enquêteur (initiales)** :
  ça permet de vérifier la couverture et de répartir les 50.
- Si le réseau lâche : `questionnaire-hors-ligne.html`, les réponses
  restent dans le téléphone, puis **Exporter CSV** et coller dans le
  Google Sheets.

---

## 4. Mettre en ligne

### Sur raw-x.fr

Copier le contenu de ce dossier dans `raw-x.fr/horseco/` par FTP ou par
le gestionnaire de fichiers de l'hébergeur. Le site sera à
`https://raw-x.fr/horseco/`.

### Sur GitHub Pages

```bash
git remote add origin https://github.com/<compte>/horseco.git
git push -u origin main
```

Puis *Settings → Pages → Source: main, dossier `/ (root)`*.
Le site sort sur `https://<compte>.github.io/horseco/`.

---

## Repères de marque

- **Palette** — papier `#FFFFFF`, sable `#F4F1EC`, encre `#1B1917`,
  orange sellier `#D4601C`
- **Typographies** — EB Garamond (titres, italique) · Archivo (capitales espacées)
- **Emblème** — l'étrier : le seul point où le cavalier, la selle et le sol se touchent
- **Nommage** — noms toscans : Maremma (les *butteri*, cavaliers de Toscane),
  Volterra, Fucecchio et Siena, du district du tannage

### Chiffres avancés

Les parts (68 % de cuir récupéré, 32 % de Toscane) et les garanties sont
des **engagements du dossier projet**, pas des mesures. Le chiffre des
véhicules hors d'usage traités en France (~1,5 million/an) est un ordre
de grandeur public. À présenter comme tel devant le jury.
