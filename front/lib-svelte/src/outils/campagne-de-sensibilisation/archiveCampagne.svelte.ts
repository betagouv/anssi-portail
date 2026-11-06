import axios from 'axios';
import { récupèreArchiveGénérique, récupèreArchivePersonnalisée } from './manipulationZip';

type Campagne = {
  archive: Uint8Array<ArrayBuffer>;
  pdfs: Uint8Array<ArrayBuffer>[];
};

let logo = $state<File | null>(null);
let promesseCampagne: Promise<Campagne> | null = null;

const récupèreCampagne = async (logoÀAppliquer: File | null): Promise<Campagne> => {
  const { data } = await axios.get<ArrayBuffer>('/api/outils/campagne-de-sensibilisation', {
    responseType: 'arraybuffer',
  });

  if (logoÀAppliquer) {
    const [archive, pdfs] = await récupèreArchivePersonnalisée(data, logoÀAppliquer);
    return { archive, pdfs };
  }

  return { archive: récupèreArchiveGénérique(data), pdfs: [] };
};

export const archiveCampagne = {
  get logo() {
    return logo;
  },

  définisLogo(nouveauLogo: File | null) {
    logo = nouveauLogo;
    promesseCampagne = null;
  },

  génère(): Promise<Campagne> {
    promesseCampagne ??= récupèreCampagne(logo).catch((erreur) => {
      promesseCampagne = null;
      throw erreur;
    });
    return promesseCampagne;
  },
};
