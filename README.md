# HorseCo

Sellerie recyclée. Cuir artisanal de Toscane sur les zones de sécurité,
cuir de sellerie automobile récupéré en centre VHU pour l'habillage.

Projet étudiant — Séminaire BTS 1, thème *Recycling*, septembre 2026.
Marque fictive.

---

## Les fichiers

| Fichier | Rôle |
|---|---|
| `index.html` | Site vitrine, une page |
| `questionnaire.html` | Coquille de marque autour du Google Form |
| `questionnaire-hors-ligne.html` | Secours sans réseau, export CSV |
| `google-form/creer-formulaire.gs` | Génère le Google Form (10 questions, FR/EN) |
| `assets/` | CSS, JS, logo, photos, film |

Site statique : aucun serveur, aucune dépendance à installer.
Double-cliquer sur `index.html` suffit pour le voir.

---

## 1. Le film du hero

`assets/video/hero.mp4` — le film de présentation, **muet et en boucle**,
à la place de la photo d'accueil.

Préparé depuis le master `202609081235.mp4` (conservé à la racine du
dossier parent, avec son son) :

- piste audio **supprimée**, pas seulement coupée
- filigrane « CapCut AI » **recadré** (132 px rognés en haut)
- 60 → 30 images/s, H.264 CRF 27, `faststart`
- **74,3 Mo → 7,7 Mo**

Le film est tourné à la verticale (1080×1760) : dans une bande large il
est cadré à 42 % de la hauteur, là où se tiennent les mains et le
cavalier. `assets/img/hero.jpg` sert d'affiche pendant le chargement et
de repli si la lecture est refusée.

Pour remplacer le film : réencoder avec les mêmes réglages, ou déposer
un `hero.mp4` déjà léger au même endroit.

---

## 2. Les photos

Les huit visuels sont **déjà en place** dans `assets/img/` — générés avec
Gemini, puis redimensionnés et compressés (16,8 Mo → 1,0 Mo au total).

Pour en remplacer un : déposer un fichier au même nom, même cadrage,
et recharger. Rien d'autre à modifier. Si un fichier manque, le site
affiche une épure au trait à sa place plutôt que de casser.

| Fichier | Ce qu'on y voit | Cadrage |
|---|---|---|
| `hero.jpg` | Cavalier, cheval, ou détail de selle en mouvement | paysage large |
| `selle.jpg` | La selle Maremma | portrait 4:5 |
| `filet.jpg` | Le filet Volterra | portrait 4:5 |
| `cravache.jpg` | La cravache Fucecchio | portrait 4:5 |
| `besace.jpg` | La besace Siena | portrait 4:5 |
| `teintes/*.jpg` | Chaque pièce en havane, bordeaux et noir (la photo d’origine est la teinte cognac) | portrait 4:5 |
| `matiere-toscane.jpg` | Gros plan de cuir fauve, grain visible | paysage 4:3 |
| `matiere-vhu.jpg` | Siège de voiture en cuir, ou casse auto | paysage 4:3 |
| `atelier.jpg` | Établi, outils de sellier, mains au travail | paysage large |

`hero.jpg` ne s'affiche plus en fond d'accueil : il sert d'affiche au
film (voir section 1).

Attention si vous régénérez des images : **vider le dossier
Téléchargements des anciens `Gemini_Generated_Image_*.jpg` avant**, sinon
on récupère un fichier d'un autre projet sans s'en apercevoir.

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

## 3. Recréer le Google Form (si besoin)

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

## 4. Enquête de rue — mercredi 11 h – 13 h

Cible : **50 personnes** (exigence du guide).

- Le QR code pointe vers le **lien Google Form direct**, pas vers le site :
  moins de clics, et ça marche même si le site est en panne.
  Générer le QR sur <https://www.qr-code-generator.com/> ou équivalent.
- Le questionnaire enchaîne directement sur la première question : il n'y a
  **aucun champ à remplir par l'enquêteur**, la personne interrogée ne voit
  que ce qui la concerne. Pour répartir les 50, comptez de votre côté
  (chacun sait combien il en a fait).
- Si le réseau lâche : `questionnaire-hors-ligne.html`, les réponses
  restent dans le téléphone, puis **Exporter CSV** et coller dans le
  Google Sheets.

---

## 5. Mettre en ligne — horseco.raw-x.fr

Le domaine `raw-x.fr` sert déjà **SortMyPC** depuis GitHub Pages
(compte `tiypay`, DNS géré chez Hostinger). HorseCo va donc sur son
propre **sous-domaine**, ce qui laisse les deux projets indépendants et
met la marque en tête d'adresse :

```
https://horseco.raw-x.fr
```

Le fichier `CNAME` à la racine contient déjà ce nom, et `.nojekyll`
évite que GitHub Pages ignore des fichiers.

### a. Pousser le dépôt

```bash
git remote add origin https://github.com/tiypay/horseco.git
git push -u origin main
```

### b. Activer Pages

Dépôt → **Settings** → **Pages** :
- Source : `Deploy from a branch`, branche `main`, dossier `/ (root)`
- Custom domain : `horseco.raw-x.fr`

### c. Créer l'enregistrement DNS chez Hostinger

Panneau Hostinger → **Domaines** → `raw-x.fr` → **Éditeur DNS** →
ajouter :

| Type | Nom | Pointe vers | TTL |
|---|---|---|---|
| CNAME | `horseco` | `tiypay.github.io` | par défaut |

**Ne touchez à rien d'autre** : les enregistrements existants font
tourner SortMyPC.

### d. Attendre, puis forcer le HTTPS

Comptez 5 à 30 minutes de propagation. Quand GitHub affiche
« DNS check successful », cochez **Enforce HTTPS** : le certificat est
délivré automatiquement, gratuitement.

Pour vérifier depuis le PC :

```bash
nslookup horseco.raw-x.fr
```

### Après chaque mise à jour

Incrémenter les `?v=` sur les liens CSS et JS dans les trois pages HTML,
sinon les visiteurs déjà venus garderont l'ancienne version en cache.

### Solution de repli sans DNS

Si le sous-domaine coince le jour J, on peut se rabattre sur
`https://tiypay.github.io/horseco/` — mais **il faut d'abord retirer le
nom de domaine personnalisé**, sinon GitHub Pages redirige cette adresse
vers `horseco.raw-x.fr` qui ne répond pas encore :

1. Supprimer le fichier `CNAME` à la racine du dépôt, et pousser
2. Dépôt → Settings → Pages → vider le champ **Custom domain**

Le site repasse alors sur l'adresse `github.io`. Les liens internes sont
tous relatifs, donc rien d'autre à changer.

---

## Repères de marque

- **Baseline** — Sellerie d'exception
- **Signature** — Du circuit à l'élégance
- **Palette**, relevée sur les pastilles du moodboard et sur le cuir du logo :
  cognac `#904913`, or vieilli `#7A4900`, noir · cuir `#421906` et `#2A1108`,
  crème `#EFE2D0` · parchemin `#FAF6F0`, sable `#F0E7DA`, encre `#2A1A10`
- **Typographies** — EB Garamond (titres, italique) · Archivo (capitales espacées)
- **Logo** — apposé comme un patch de cuir embossé, à la manière des
  brosses de pansage du moodboard (`assets/img/logo-horseco.png`,
  découpé depuis `assets/img/moodboard.png`)
- **Nommage** — noms toscans : Maremma (les *butteri*, cavaliers de Toscane),
  Volterra, Fucecchio et Siena, du district du tannage

### Chiffres avancés

Les parts (68 % de cuir récupéré, 32 % de Toscane) et les garanties sont
des **engagements du dossier projet**, pas des mesures. Le chiffre des
véhicules hors d'usage traités en France (~1,5 million/an) est un ordre
de grandeur public. À présenter comme tel devant le jury.
