const domaines = [
  { id: 'RSSI', libelle: 'Cybersécurité / SSI' },
  { id: 'DSI', libelle: 'Numérique et systèmes d’information' },
  { id: 'METIER', libelle: 'Direction métier' },
  { id: 'DPO', libelle: 'Protection des données' },
  { id: 'JURI', libelle: 'Juridique' },
  { id: 'RISQ', libelle: 'Gestion des risques' },
  { id: 'DG', libelle: 'Direction générale' },
  { id: 'autre', libelle: 'Autre' },
] as const;

export const codesDomainesDeSpecialite = domaines.map(d => d.id);