export const PROJECT_TYPE_OPTIONS = [
  { value: "site-web", label: "Site web" },
  { value: "e-commerce", label: "Site e-commerce" },
  { value: "application-web", label: "Application web" },
  { value: "application-mobile", label: "Application mobile" },
  { value: "logiciel-metier", label: "Logiciel métier" },
  { value: "digitalisation", label: "Digitalisation d'un processus" },
  { value: "autre", label: "Autre besoin" },
] as const;

export type BriefFormValues = {
  projectName: string;
  projectType: string;
  objective: string;
  users: string;
  firstFlow: string;
  existingTools: string;
  integrations: string;
  constraints: string;
};

function clean(value: string, fallback = "Non précisé") {
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : fallback;
}

function projectTypeLabel(value: string) {
  return (
    PROJECT_TYPE_OPTIONS.find((option) => option.value === value)?.label ??
    clean(value)
  );
}

/**
 * Fonction pure et locale : le composant client l'utilise pour produire le
 * texte copiable/téléchargeable, sans requête, date ou identifiant caché.
 */
export function buildProjectBrief(values: BriefFormValues): string {
  return [
    "MINI CAHIER DES CHARGES",
    "",
    "Ce document est un point de départ à préciser avec les personnes concernées.",
    "Les réponses ont été traitées dans le navigateur et ne sont pas transmises.",
    "",
    "1. Projet",
    `Nom ou activité : ${clean(values.projectName)}`,
    `Type de projet : ${projectTypeLabel(values.projectType)}`,
    "",
    "2. Objectif",
    clean(values.objective),
    "",
    "3. Utilisateurs concernés",
    clean(values.users),
    "",
    "4. Premier flux ou première version",
    clean(values.firstFlow),
    "",
    "5. Outils et données existants",
    clean(values.existingTools),
    "",
    "6. Intégrations et contraintes à étudier",
    `Paiement, livraison, stock ou autres connexions : ${clean(values.integrations)}`,
    `Contraintes, échéance indicative ou priorité : ${clean(values.constraints)}`,
    "",
    "7. Questions à vérifier ensuite",
    "- Quelles données sont indispensables au premier parcours ?",
    "- Qui peut consulter, saisir, modifier ou valider chaque information ?",
    "- Quelles intégrations sont réellement nécessaires dès le départ ?",
    "- Comment tester le parcours avec les utilisateurs concernés ?",
  ].join("\n");
}
