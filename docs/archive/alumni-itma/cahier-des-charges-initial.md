# CAHIER DES CHARGES

## **Application de gestion et de suivi des alumnis – ITMA**

## **1. Contexte et objectifs**

Dans le cadre de l’amélioration du suivi des diplômés (alumnis), l’entreprise souhaite mettre en place une application web centralisée permettant :

- de collecter et mettre à jour les informations des alumnis
- d’automatiser l’envoi de formulaires (e-mail et WhatsApp (optionnel))
- de suivre les réponses en temps réel
- d’analyser les données via un dashboard

L’objectif est de disposer d’un outil fiable, automatisé et exploitable pour le pilotage académique et stratégique.

## **2. Objectifs fonctionnels**

L’application devra permettre :

- la gestion complète des alumnis
- l’envoi automatisé de formulaires personnalisés
- le suivi des interactions (envoyé, ouvert, répondu)
- la relance automatique des non-répondants
- l’analyse des données collectées
- la génération de rapports exploitables

## **3. Périmètre du projet**

### Inclus

- Application web complète (frontend + backend)
- Intégration e-mail
- Intégration WhatsApp (optionnel)
- Dashboard interactif
- Base de données alumni
- Système de campagnes et relances

### Non inclus (phase 1)

- Application mobile native
- Intégration avec systèmes externes complexes (ERP, etc.)
- Intelligence artificielle avancée

## **4. Description des fonctionnalités**

### **4.1 Gestion des alumnis**

- Création, modification, suppression d’alumnis
- Import en masse via fichier CSV/Excel
- Gestion des doublons
- Fiche détaillée par alumni

Champs principaux :

nom, prénom, promotion, filière, téléphone, e-mail, statut professionnel, entreprise, localisation, date de mise à jour

### **4.2 Génération et gestion des formulaires**

- Création de formulaires personnalisables

- Génération d’un lien unique par alumni

- Suivi du statut (non envoyé, envoyé, ouvert, rempli)

- Sauvegarde automatique des réponses

### **4.3 Système d’envoi (e-mail et WhatsApp (optionnel))**

#### Envoi automatisé :

- messages personnalisés
- envoi en masse
- templates prédéfinis

#### Suivi :

- message envoyé
- message livré
- message lu
- lien cliqué
- formulaire rempli

#### Relances automatiques :

- relance J+3
- relance J+7
- relance finale

### **4.4 Gestion des campagnes**

- Création de campagnes (ex : Enquête 2026)
- Association d’un formulaire à une campagne
- Suivi des performances par campagne

### **4.5 Dashboard et analyse**

Le dashboard devra permettre :

- visualisation des indicateurs clés
- filtres par promotion, filière, année
- graphiques interactifs

Indicateurs :

- taux de réponse
- taux de remplissage
- taux d’insertion professionnelle
- répartition géographique
- secteurs d’activité
- évolution des réponses

### **4.6 Export et reporting**

- Export des données en CSV / Excel
- Génération de rapports
- Historique des campagnes

### **4.7 Gestion des utilisateurs**

- rôles (administrateur, agent, lecteur)
- gestion des accès

## **5. Contraintes techniques**

Technologies recommandées :

- Frontend : React / Next.js
- Backend : Django / Node.js
- Base de données : PostgreSQL
- Hébergement : VPS ou Cloud

Exigences :

- sécurité des données
- conformité RGPD (consentement)
- performance sur plusieurs centaines d’alumnis

## **6. Intégrations externes**

### E-mail

- SMTP entreprise ou service externe

### WhatsApp (optionnel)

- envoi de messages automatisés
- suivi des statuts

## **7. Estimation des coûts**

### **7.1 Coût WhatsApp (optionnel)**

Les messages WhatsApp Business sont payants.

- coût estimé : \~0,0033 € par message (\~2 FCFA)
- pour 1000 alumnis :
  - 1 envoi : \~2 000 FCFA
  - avec 3 relances : \~7 000 FCFA

**coût maîtrisé mais dépend du volume**

### **7.2 Coût e-mail**

Options :

- SMTP interne : gratuit
- services externes : Brevo, Mailgun, Amazon SES

**souvent gratuit ou très faible coût pour <1000 emails**

## **8. Planning prévisionnel**

Phase 1 : conception (1 semaine)\
Phase 2 : développement backend (2 à 3 semaines)\
Phase 3 : développement frontend (2 à 3 semaines)\
Phase 4 : intégration e-mail et WhatsApp (optionnel) (1 semaine)\
Phase 5 : tests et déploiement (1 semaine)

**durée totale estimée** : 6 à 8 semaines

## **9. Risques et contraintes**

- blocage WhatsApp si spam (nécessite consentement)
- qualité des données initiales
- faible taux de réponse
- erreurs dans les numéros ou e-mails

## **10. Facteurs de succès**

- base de données propre
- messages bien formulés
- relances intelligentes
- dashboard clair et utile

## **11. Évolutions futures possibles**

- intégration LinkedIn
- analyse prédictive (emploi)
- chatbot WhatsApp
- segmentation avancée

## **Conclusion**

Ce projet permettra à l’ITMA de disposer d’un outil moderne de suivi des alumnis, facilitant la collecte de données et leur exploitation pour la prise de décision.

---

Mon objectif est de faire un prototype de cet projet avec vite mais sans backend.
Utilise shadcn pour l'ui. ( Si tu veux ajouter une commande demande toi s'il n'est pas dans shadcn aven de l'implementer)
