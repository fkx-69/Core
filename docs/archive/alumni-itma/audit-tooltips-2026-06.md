# Audit UX historique des tooltips

Statut : archive non normative. La liste originale etait liee a un instant precis du frontend et referencait notamment un composant supprime.

## Constats conserves

Les tooltips etaient surtout recommandes pour :

- les boutons composes uniquement d'une icone ;
- la navigation lorsque la barre laterale est repliee ;
- les actions d'envoi, d'import, de validation et de rejet ;
- les statuts dont le libelle seul n'explique pas la consequence ;
- les commandes de tri et de pagination lorsque leur etat est ambigu.

## Regles durables

- Un bouton icone doit avoir un nom accessible ; le tooltip ne remplace pas `aria-label`.
- Ne pas ajouter de tooltip aux controles dont le texte visible est deja explicite, sauf information complementaire utile.
- Expliquer la consequence des actions sensibles dans une confirmation, pas uniquement dans une info-bulle.
- Reutiliser le composant partage `ActionTooltip` lorsque le tooltip est justifie.
- Verifier clavier, lecteur d'ecran, mobile et mode sidebar repliee.

Les references de fichiers et numeros de lignes ont ete retires : plusieurs avaient diverge du code courant.
