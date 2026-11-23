const formatMois = new Intl.DateTimeFormat('fr-FR', { month: 'short', year: '2-digit', timeZone: 'UTC' });
const formatDate = new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
const formatNombre = new Intl.NumberFormat('fr-FR');

export const libelleDuMois = (mois: string): string => {
  const [annee, numeroDuMois] = mois.split('-').map(Number);
  return formatMois.format(new Date(Date.UTC(annee, numeroDuMois - 1, 1)));
};

export const formateDate = (date: Date): string => formatDate.format(date);

export const formateNombre = (nombre: number): string => formatNombre.format(nombre);
