# Audit historique des actions irreversibles

Statut : archive non normative. Constat ponctuel conserve pour reference ; reverifier chaque point dans le code et l'interface avant implementation.

## Risques releves

Priorite haute :

- import CSV en masse sans recapitulatif final ;
- envoi groupe d'e-mails de campagne sans confirmation ;
- modification du slug public susceptible d'invalider des liens partages ;
- changement du type d'un formulaire deja utilise.

Priorite moyenne :

- envoi unitaire d'une invitation ou d'une relance ;
- marquage manuel d'une invitation comme repondue ;
- generation en masse de liens ;
- activation ou desactivation immediate d'un formulaire public.

Priorite basse :

- sauvegarde instantanee du titre ou de la description ;
- reorganisation immediate des questions.

## Recommandations durables

- Pour une action externe ou en masse, afficher la cible, le volume et l'irreversibilite avant confirmation.
- Pour un changement d'URL publique, expliquer que les anciens liens peuvent cesser de fonctionner.
- Pour une action reversible, preferer un retour explicite et, si possible, une action d'annulation.
- Bloquer les doubles soumissions pendant une mutation.

Le document source contenait des numeros de lignes et des liens locaux devenus obsoletes ; ils ont ete retires lors de l'archivage.
