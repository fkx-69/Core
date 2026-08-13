# Actions SEO restantes

Date de rédaction : **12 août 2026**

Ce document distingue ce qui est versionné et vérifiable dans le dépôt de ce
qui nécessite encore des faits, des choix ou des comptes externes. Aucune
action externe mentionnée ci-dessous n'est considérée comme réalisée.

## Implémenté dans le dépôt

- L'accueil présente l'offre avec le H1 « Agence de développement logiciel à
  Bamako », le sous-texte sur les sites web, applications web, applications
  mobiles et logiciels métier sur mesure au Mali, ainsi que le slogan secondaire.
- Six pages de services sont disponibles, dont la création e-commerce et la
  digitalisation des processus d'entreprise. Leur contenu reste conditionnel
  pour les paiements, la livraison, le stock, les intégrations et la reprise de
  données.
- La page À propos décrit le périmètre, l'approche, Bamako/Mali et le caractère
  conceptuel des démos sans ajouter de personne, client, résultat ou
  certification non vérifiable.
- Le cluster `/ressources` comprend un hub, deux guides datés du 12 août 2026
  et un générateur de cahier des charges local. Les réponses du générateur ne
  sont ni envoyées ni persistées ; la copie et le téléchargement `.txt` se font
  dans le navigateur.
- Les ressources sont cataloguées dans `lib/resources-data.ts` et alimentent le
  hub, le sitemap et les tests. Les métadonnées, canoniques, Open Graph, Twitter
  et les données structurées Article/BreadcrumbList ou
  WebApplication/BreadcrumbList sont générées côté serveur.
- Le sitemap décrit exactement les 16 URL publiques prévues, sans `lastModified`
  artificiel. Les routes `/demos/*` conservent `noindex, nofollow`.
- La navigation inclut Ressources, son état actif respecte les frontières de
  segment, et le footer relie À propos, les ressources et les guides.

## Reste à faire

### Identité, coordonnées et mentions légales

1. Réunir les vraies coordonnées et l'identité légale de l'entité qui exploite
   Core : dénomination, forme, immatriculation si applicable, adresse et canal
   de contact réellement surveillé.
2. Faire valider ces informations par la personne responsable, puis compléter
   les mentions légales et les textes de confidentialité correspondants.
3. Ne renseigner aucun téléphone, e-mail, adresse détaillée, horaire ou numéro
   administratif dans le SEO avant cette validation.

### Formulaire et canal de contact

1. Choisir le canal d'envoi réel du formulaire (e-mail, CRM, webhook ou autre)
   et son destinataire opérationnel.
2. Définir le consentement, la notice d'information, la durée de conservation,
   la gestion des erreurs, l'anti-abus et les droits d'accès avant toute mise en
   production.
3. Configurer les secrets et le destinataire dans l'environnement de déploiement
   puis remplacer la démonstration uniquement après un test de bout en bout.

### Données d'établissement et preuve éditoriale

1. Ajouter des données `LocalBusiness` seulement après vérification d'une
   adresse, d'un téléphone, d'horaires et d'une entité correspondante. Pour le
   moment, l'Organisation existante ne doit pas être transformée en fiche
   locale plus précise.
2. Documenter les membres de l'équipe ou auteurs uniquement lorsqu'ils sont
   identifiés, consentants et vérifiables. Aucun profil ou auteur individuel ne
   doit être déduit du contenu actuel.
3. Publier des études de cas, logos ou avis seulement avec l'autorisation
   correspondante, le contexte du projet et une formulation fidèle aux faits.
   Les démos conceptuelles ne doivent pas être recyclées en références clients.
4. Obtenir de vrais avis auprès de personnes ou organisations autorisées, puis
   préciser leur source et leur date. Ne pas ajouter `Review` ou
   `AggregateRating` avant cette étape.

### Signaux externes et mesure

1. Ouvrir ou valider la propriété Google Search Console, puis vérifier la
   propriété, soumettre le sitemap canonique, inspecter les pages publiques et
   suivre les éventuels problèmes d'indexation. Cette validation n'a pas été
   faite par le dépôt.
2. Créer ou revendiquer une fiche Google Business Profile uniquement si les
   informations d'établissement sont réelles, cohérentes et éligibles.
3. Obtenir des liens et mentions externes pertinents (partenaires, annuaires ou
   publications) sans achat de liens ni texte artificiel ; conserver la source
   et le contexte de chaque mention.
4. Mettre en place le suivi des Core Web Vitals et des rapports Search Console,
   définir la fréquence de lecture, le responsable et les seuils de décision.
   Aucun suivi externe n'est déclaré comme actif ici.

### Backlog éditorial conditionnel

1. Après observation des requêtes, des contacts et des pages existantes,
   décider si de nouvelles pages sont réellement utiles : par exemple une
   question métier ou une zone géographique seulement lorsqu'un périmètre réel
   et un contenu distinct existent.
2. Tenir une carte des intentions, URL canoniques, liens internes et
   responsables éditoriaux pour éviter la cannibalisation entre les services,
   les guides et les variantes géographiques.
3. Refuser les pages satellites produites par simple permutation de ville,
   secteur ou mot-clé. Chaque nouvelle page doit apporter une information
   vérifiable, un besoin utilisateur identifiable et un maillage justifié.

### Plan de suivi 30 / 60 / 90 jours

- **Jours 0–30 :** vérifier l'identité et les coordonnées, choisir le canal de
  contact, valider les mentions légales, connecter Search Console et établir un
  état initial (indexation, requêtes, clics, impressions, CTR, erreurs et Core
  Web Vitals).
- **Jours 31–60 :** observer les demandes et les requêtes, améliorer les pages
  qui répondent déjà à une intention réelle, corriger les problèmes techniques
  mesurés et recueillir seulement des preuves clients autorisées.
- **Jours 61–90 :** comparer les indicateurs à l'état initial, décider du
  backlog conditionnel, renforcer les liens externes pertinents et documenter
  les décisions de conservation, de fusion ou de non-création de pages.

Les métriques minimales à suivre sont les impressions, clics, CTR et positions
par intention dans Search Console, les pages réellement indexées, les entrées
organiques vers les services/ressources, les clics vers le contact et l'outil,
les erreurs d'exploration et les Core Web Vitals. Elles serviront à décider de
la suite ; elles ne constituent pas une promesse de trafic ou de conversion.
