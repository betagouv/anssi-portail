import axios from 'axios';
import { récupèreArchiveGénérique, récupèreArchivePersonnalisée } from './manipulationZip';

type Kit = {
  archive: Uint8Array<ArrayBuffer>;
  pdfs: Uint8Array<ArrayBuffer>[];
};

let logo = $state<File | null>(null);
let promesseKit: Promise<Kit> | null = null;

const récupèreKit = async (logoÀAppliquer: File | null): Promise<Kit> => {
  const { data } = await axios.get<ArrayBuffer>('/api/outils/kit-de-sensibilisation-interne', {
    responseType: 'arraybuffer',
  });

  if (logoÀAppliquer) {
    const [archive, pdfs] = await récupèreArchivePersonnalisée(data, logoÀAppliquer);
    return { archive, pdfs };
  }

  return { archive: récupèreArchiveGénérique(data), pdfs: [] };
};

export const archiveKit = {
  get logo() {
    return logo;
  },

  définisLogo(nouveauLogo: File | null) {
    logo = nouveauLogo;
    promesseKit = null;
  },

  génère(): Promise<Kit> {
    promesseKit ??= récupèreKit(logo).catch((erreur) => {
      promesseKit = null;
      throw erreur;
    });
    return promesseKit;
  },
};
