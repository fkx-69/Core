# Organisation des apps Django - Plateforme Alumni

Ce document propose une organisation professionnelle des differentes apps Django du projet Alumni.

L'objectif est de separer clairement les responsabilites :

- gestion des comptes et permissions ;
- gestion des alumnis ;
- gestion du parcours professionnel ;
- gestion des formulaires ;
- gestion des campagnes et relances ;
- import/export des donnees ;
- statistiques et rapports.

## Vue globale des apps

```text
config/
  settings.py
  urls.py
  asgi.py
  wsgi.py

apps/
  accounts/
  alumni/
  careers/
  surveys/
  campaigns/
  data_exchange/
  analytics/
  core/
```

## 1. App `accounts`

L'app `accounts` gere les utilisateurs internes, les roles et les permissions.

Elle correspond a la partie securite et controle d'acces de l'application.

### Classes principales

```text
Utilisateur
Role
Permission
RolePermission
```

### Modeles Django proposes

```python
class Role(models.Model):
    nom = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)


class Permission(models.Model):
    code = models.CharField(max_length=150, unique=True)
    nom = models.CharField(max_length=150)
    description = models.TextField(blank=True)


class RolePermission(models.Model):
    role = models.ForeignKey(Role, on_delete=models.CASCADE)
    permission = models.ForeignKey(Permission, on_delete=models.CASCADE)
    date_attribution = models.DateTimeField(auto_now_add=True)


class Utilisateur(AbstractUser):
    role = models.ForeignKey(Role, on_delete=models.PROTECT)
    nom = models.CharField(max_length=150)
    email = models.EmailField(unique=True)
    actif = models.BooleanField(default=True)
    dernier_acces = models.DateTimeField(null=True, blank=True)
```

### Responsabilites

- Authentification des utilisateurs.
- Gestion des roles : administrateur, responsable de suivi, consultation.
- Gestion des permissions unitaires.
- Controle des acces selon le role.

## 2. App `alumni`

L'app `alumni` gere les informations personnelles et academiques des anciens etudiants.

Elle contient la fiche centrale d'un alumnus.

### Classes principales

```text
Alumnus
Filiere
```

### Modeles Django proposes

```python
class Filiere(models.Model):
    nom = models.CharField(max_length=150)
    departement = models.CharField(max_length=150, blank=True)
    niveau = models.CharField(max_length=100, blank=True)


class Alumnus(models.Model):
    filiere = models.ForeignKey(Filiere, on_delete=models.PROTECT)
    matricule = models.CharField(max_length=100, unique=True, null=True, blank=True)
    nom = models.CharField(max_length=150)
    prenom = models.CharField(max_length=150)
    email = models.EmailField(unique=True, null=True, blank=True)
    telephone = models.CharField(max_length=30, blank=True)
    niveau_etude = models.CharField(max_length=100, blank=True)
    annee_sortie = models.PositiveIntegerField(null=True, blank=True)
    ville_residence = models.CharField(max_length=150, blank=True)
    pays_residence = models.CharField(max_length=150, blank=True)
    statut_dossier = models.CharField(max_length=30, choices=StatutDossier.choices)
    date_creation = models.DateTimeField(auto_now_add=True)
    date_derniere_maj = models.DateTimeField(auto_now=True)
```

### Responsabilites

- Ajouter, modifier, supprimer et consulter les alumnis.
- Rechercher et filtrer les alumnis.
- Gerer les filieres et niveaux de formation.
- Centraliser les informations personnelles et academiques.

## 3. App `careers`

L'app `careers` gere la situation professionnelle et le parcours des alumnis.

Elle est separee de `alumni` afin de ne pas melanger les donnees personnelles avec les donnees professionnelles.

### Classes principales

```text
SituationProfessionnelle
Entreprise
SecteurActivite
```

### Modeles Django proposes

```python
class SecteurActivite(models.Model):
    nom = models.CharField(max_length=150, unique=True)


class Entreprise(models.Model):
    secteur_activite = models.ForeignKey(SecteurActivite, on_delete=models.PROTECT)
    nom = models.CharField(max_length=200)
    ville = models.CharField(max_length=150, blank=True)
    pays = models.CharField(max_length=150, blank=True)
    site_web = models.URLField(blank=True)


class SituationProfessionnelle(models.Model):
    alumnus = models.ForeignKey("alumni.Alumnus", on_delete=models.CASCADE)
    entreprise = models.ForeignKey(Entreprise, on_delete=models.SET_NULL, null=True, blank=True)
    secteur_activite = models.ForeignKey(SecteurActivite, on_delete=models.SET_NULL, null=True, blank=True)
    statut = models.CharField(max_length=50, choices=StatutProfessionnel.choices)
    poste = models.CharField(max_length=150, blank=True)
    date_debut = models.DateField(null=True, blank=True)
    date_fin = models.DateField(null=True, blank=True)
    travaille_dans_domaine = models.BooleanField(null=True, blank=True)
    est_actuelle = models.BooleanField(default=True)
    date_maj = models.DateTimeField(auto_now=True)
```

### Responsabilites

- Suivre l'insertion professionnelle.
- Connaitre les entreprises et secteurs d'activite.
- Mesurer le taux d'emploi.
- Identifier les alumnis travaillant dans leur domaine de formation.

## 4. App `surveys`

L'app `surveys` gere les formulaires, les questions et les reponses.

Elle represente la partie collecte de donnees.

### Classes principales

```text
Formulaire
Question
ReponseFormulaire
ReponseQuestion
```

### Modeles Django proposes

```python
class Formulaire(models.Model):
    titre = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    actif = models.BooleanField(default=True)
    date_creation = models.DateTimeField(auto_now_add=True)


class Question(models.Model):
    formulaire = models.ForeignKey(Formulaire, on_delete=models.CASCADE)
    libelle = models.TextField()
    type = models.CharField(max_length=30, choices=TypeQuestion.choices)
    obligatoire = models.BooleanField(default=False)
    ordre = models.PositiveIntegerField()


class ReponseFormulaire(models.Model):
    formulaire = models.ForeignKey(Formulaire, on_delete=models.PROTECT)
    alumnus = models.ForeignKey("alumni.Alumnus", on_delete=models.CASCADE)
    token_invitation = models.CharField(max_length=255, blank=True)
    date_soumission = models.DateTimeField(null=True, blank=True)
    statut = models.CharField(max_length=30, choices=StatutReponse.choices)
    taux_completion = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    adresse_ip = models.GenericIPAddressField(null=True, blank=True)


class ReponseQuestion(models.Model):
    reponse_formulaire = models.ForeignKey(ReponseFormulaire, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.PROTECT)
    valeur = models.TextField(blank=True)
```

### Responsabilites

- Creer des formulaires dynamiques.
- Gerer les questions.
- Enregistrer les reponses des alumnis.
- Conserver le token d'invitation lorsqu'une reponse provient d'une campagne.
- Calculer le taux de completion d'une reponse.

## 5. App `campaigns`

L'app `campaigns` gere les campagnes d'envoi, les invitations personnalisees et les relances.

Elle est responsable du suivi des alumnis contactes, repondants et non-repondants.

### Classes principales

```text
Campagne
InvitationFormulaire
Relance
```

### Modeles Django proposes

```python
class Campagne(models.Model):
    formulaire = models.ForeignKey("surveys.Formulaire", on_delete=models.PROTECT)
    utilisateur = models.ForeignKey("accounts.Utilisateur", on_delete=models.PROTECT)
    nom = models.CharField(max_length=200)
    objet_message = models.CharField(max_length=255, blank=True)
    message = models.TextField(blank=True)
    date_debut = models.DateTimeField(null=True, blank=True)
    date_fin = models.DateTimeField(null=True, blank=True)
    statut = models.CharField(max_length=30, choices=StatutCampagne.choices)


class InvitationFormulaire(models.Model):
    campagne = models.ForeignKey(Campagne, on_delete=models.CASCADE)
    alumnus = models.ForeignKey("alumni.Alumnus", on_delete=models.CASCADE)
    token = models.CharField(max_length=255, unique=True)
    lien_personnalise = models.URLField(max_length=500, unique=True)
    canal = models.CharField(max_length=30, choices=CanalCommunication.choices)
    date_envoi = models.DateTimeField(null=True, blank=True)
    date_expiration = models.DateTimeField(null=True, blank=True)
    statut = models.CharField(max_length=30, choices=StatutInvitation.choices)


class Relance(models.Model):
    invitation = models.ForeignKey(InvitationFormulaire, on_delete=models.CASCADE)
    canal = models.CharField(max_length=30, choices=CanalCommunication.choices)
    message = models.TextField(blank=True)
    date_relance = models.DateTimeField()
    statut_envoi = models.CharField(max_length=50, blank=True)
```

### Responsabilites

- Creer et planifier des campagnes.
- Generer des liens personnalises.
- Envoyer les formulaires par e-mail.
- Gerer l'option WhatsApp.
- Suivre les invitations envoyees, repondues, expirees ou incompletes.
- Organiser les relances.
- Mettre a jour le statut d'une invitation lorsqu'une reponse est soumise avec son token.

## 6. App `data_exchange`

L'app `data_exchange` gere les imports et exports de donnees.

Elle permet d'integrer les fichiers Excel/CSV existants et d'extraire les donnees de la plateforme.

### Classes principales

```text
ImportDonnees
ExportDonnees
```

### Modeles Django proposes

```python
class ImportDonnees(models.Model):
    utilisateur = models.ForeignKey("accounts.Utilisateur", on_delete=models.PROTECT)
    nom_fichier = models.CharField(max_length=255)
    format = models.CharField(max_length=20)
    date_import = models.DateTimeField(auto_now_add=True)
    nb_lignes = models.PositiveIntegerField(default=0)
    nb_crees = models.PositiveIntegerField(default=0)
    nb_mis_a_jour = models.PositiveIntegerField(default=0)
    nb_erreurs = models.PositiveIntegerField(default=0)


class ExportDonnees(models.Model):
    utilisateur = models.ForeignKey("accounts.Utilisateur", on_delete=models.PROTECT)
    format = models.CharField(max_length=20)
    filtre = models.JSONField(null=True, blank=True)
    date_export = models.DateTimeField(auto_now_add=True)
    chemin_fichier = models.CharField(max_length=500, blank=True)
```

### Responsabilites

- Importer les alumnis depuis Excel ou CSV.
- Controler les erreurs d'import.
- Mettre a jour les fiches existantes.
- Exporter les alumnis et statistiques.
- Journaliser les operations d'import/export.

## 7. App `analytics`

L'app `analytics` gere les rapports, indicateurs et calculs statistiques.

Elle ne doit pas forcement contenir beaucoup de tables, car plusieurs statistiques peuvent etre calculees directement depuis les autres apps.

### Classes principales

```text
RapportStatistique
ServiceStatistiques
```

### Modeles et services Django proposes

```python
class RapportStatistique(models.Model):
    utilisateur = models.ForeignKey("accounts.Utilisateur", on_delete=models.PROTECT)
    titre = models.CharField(max_length=200)
    periode_debut = models.DateField(null=True, blank=True)
    periode_fin = models.DateField(null=True, blank=True)
    format = models.CharField(max_length=20, blank=True)
    date_generation = models.DateTimeField(auto_now_add=True)


class ServiceStatistiques:
    def calculer_taux_reponse(self):
        pass

    def calculer_taux_insertion(self):
        pass

    def repartir_par_filiere(self):
        pass

    def repartir_par_secteur(self):
        pass

    def repartir_par_pays(self):
        pass
```

### Responsabilites

- Calculer le taux de reponse.
- Calculer le taux d'insertion professionnelle.
- Produire les repartitions par filiere, secteur, pays et annee.
- Generer les donnees du dashboard.
- Generer des rapports statistiques.

## 8. App `core`

L'app `core` contient les elements partages par tout le projet.

Elle evite la duplication de constantes, choix, classes utilitaires et comportements communs.

### Classes principales

```text
StatutDossier
StatutProfessionnel
TypeQuestion
StatutCampagne
CanalCommunication
StatutInvitation
StatutReponse
BaseModel
```

### Classes Django proposees

```python
class BaseModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class StatutDossier(models.TextChoices):
    COMPLET = "COMPLET", "Complet"
    INCOMPLET = "INCOMPLET", "Incomplet"
    A_VERIFIER = "A_VERIFIER", "A verifier"


class StatutProfessionnel(models.TextChoices):
    EMPLOYE = "EMPLOYE", "Employe"
    INDEPENDANT = "INDEPENDANT", "Independant"
    EN_RECHERCHE = "EN_RECHERCHE", "En recherche"
    POURSUITE_ETUDES = "POURSUITE_ETUDES", "Poursuite d'etudes"
    INACTIF = "INACTIF", "Inactif"
    AUTRE = "AUTRE", "Autre"


class TypeQuestion(models.TextChoices):
    TEXTE = "TEXTE", "Texte"
    EMAIL = "EMAIL", "E-mail"
    TELEPHONE = "TELEPHONE", "Telephone"
    NOMBRE = "NOMBRE", "Nombre"
    DATE = "DATE", "Date"
    CHOIX = "CHOIX", "Choix"
    BOOLEEN = "BOOLEEN", "Booleen"


class StatutCampagne(models.TextChoices):
    BROUILLON = "BROUILLON", "Brouillon"
    PROGRAMMEE = "PROGRAMMEE", "Programmee"
    EN_COURS = "EN_COURS", "En cours"
    TERMINEE = "TERMINEE", "Terminee"
    ANNULEE = "ANNULEE", "Annulee"


class CanalCommunication(models.TextChoices):
    EMAIL = "EMAIL", "E-mail"
    WHATSAPP = "WHATSAPP", "WhatsApp"


class StatutInvitation(models.TextChoices):
    EN_ATTENTE = "EN_ATTENTE", "En attente"
    ENVOYE = "ENVOYE", "Envoye"
    REPONDU = "REPONDU", "Repondu"
    NON_REPONDU = "NON_REPONDU", "Non repondu"
    EXPIRE = "EXPIRE", "Expire"
    INCOMPLET = "INCOMPLET", "Incomplet"


class StatutReponse(models.TextChoices):
    BROUILLON = "BROUILLON", "Brouillon"
    SOUMISE = "SOUMISE", "Soumise"
    INCOMPLETE = "INCOMPLETE", "Incomplete"
    VALIDEE = "VALIDEE", "Validee"
```

### Responsabilites

- Centraliser les choix (`TextChoices`).
- Fournir un modele abstrait commun.
- Stocker les fonctions utilitaires partagees.
- Eviter les dependances circulaires entre apps.

## Dependances recommandees entre apps

```text
accounts
  ne depend pas des autres apps metier

alumni
  depend de core

careers
  depend de alumni, core

surveys
  depend de alumni, core

campaigns
  depend de accounts, alumni, surveys, core

data_exchange
  depend de accounts, alumni, careers, core

analytics
  depend de accounts, alumni, careers, campaigns, surveys, core

core
  ne depend d'aucune app metier
```

## Solution retenue pour eviter la dependance circulaire

Dans cette organisation, on garde les formulaires et leurs reponses dans la meme app `surveys`, car ils appartiennent au meme domaine metier.

Le probleme a eviter est le suivant :

```text
campaigns.Campagne -> surveys.Formulaire
surveys.ReponseFormulaire -> campaigns.InvitationFormulaire
```

Pour casser cette dependance circulaire, `ReponseFormulaire` ne pointe pas directement vers `InvitationFormulaire`. Elle pointe vers le `Formulaire` rempli et conserve seulement le `token_invitation` lorsque la reponse vient d'une campagne.

```python
class ReponseFormulaire(models.Model):
    formulaire = models.ForeignKey("surveys.Formulaire", on_delete=models.PROTECT)
    alumnus = models.ForeignKey("alumni.Alumnus", on_delete=models.CASCADE)
    token_invitation = models.CharField(max_length=255, blank=True)
    date_soumission = models.DateTimeField(null=True, blank=True)
    statut = models.CharField(max_length=30, choices=StatutReponse.choices)
```

Ensuite, la logique de mise a jour de l'invitation est geree dans un service de l'app `campaigns`.

```python
class InvitationService:
    def marquer_comme_repondue(self, token_invitation):
        invitation = InvitationFormulaire.objects.get(token=token_invitation)
        invitation.statut = StatutInvitation.REPONDU
        invitation.save(update_fields=["statut"])
```

Les dependances deviennent donc :

```text
surveys -> alumni, core
campaigns -> accounts, alumni, surveys, core
```

Ainsi, `campaigns` connait `surveys`, mais `surveys` ne connait pas `campaigns`.

## Repartition finale des classes


| App Django      | Classes principales                                              |
| --------------- | ---------------------------------------------------------------- |
| `accounts`      | `Utilisateur`, `Role`, `Permission`, `RolePermission`            |
| `alumni`        | `Alumnus`, `Filiere`                                             |
| `careers`       | `SituationProfessionnelle`, `Entreprise`, `SecteurActivite`      |
| `surveys`       | `Formulaire`, `Question`, `ReponseFormulaire`, `ReponseQuestion` |
| `campaigns`     | `Campagne`, `InvitationFormulaire`, `Relance`                    |
| `data_exchange` | `ImportDonnees`, `ExportDonnees`                                 |
| `analytics`     | `RapportStatistique`, `ServiceStatistiques`                      |
| `core`          | `BaseModel`, enums et classes communes                           |


## Structure interne recommandee pour chaque app

Chaque app peut suivre cette structure :

```text
app_name/
  __init__.py
  admin.py
  apps.py
  models.py
  serializers.py
  services.py
  selectors.py
  urls.py
  views.py
  tests/
    test_models.py
    test_services.py
    test_views.py
```

### Role des fichiers


| Fichier          | Role                                                           |
| ---------------- | -------------------------------------------------------------- |
| `models.py`      | Declaration des tables Django                                  |
| `admin.py`       | Configuration de l'interface Django Admin                      |
| `serializers.py` | Serialisation des donnees si Django REST Framework est utilise |
| `services.py`    | Logique metier : imports, envois, calculs                      |
| `selectors.py`   | Requetes complexes et filtres de lecture                       |
| `views.py`       | Vues web ou API                                                |
| `urls.py`        | Routes de l'app                                                |
| `tests/`         | Tests unitaires et fonctionnels                                |


## Conclusion

Cette organisation permet de garder une architecture claire :

- `accounts` protege l'application ;
- `alumni` stocke les donnees centrales ;
- `careers` suit l'evolution professionnelle ;
- `surveys` collecte les reponses ;
- `campaigns` gere les envois et relances ;
- `data_exchange` gere les fichiers ;
- `analytics` produit les statistiques ;
- `core` contient les elements communs.

Elle est adaptee a un projet Django evolutif, maintenable et deployable sur un VPS.
