import axios from 'axios';
import { récupèreArchiveGénérique, récupèreArchivePersonnalisée } from './manipulationZip';

let logo = $state<File | null>(null);
let cacheArchive = $state<Uint8Array<ArrayBuffer> | null>(null);
let pdfs = $state<Uint8Array<ArrayBuffer>[]>([]);
let générationEnCours = $state(false);

export const archiveKit = {
  get logo() {
    return logo;
  },
  get pdfs() {
    return pdfs;
  },
  get générationEnCours() {
    return générationEnCours;
  },

  définisLogo(nouveauLogo: File | null) {
    logo = nouveauLogo;
    cacheArchive = null;
  },

  async génère(): Promise<Uint8Array<ArrayBuffer>> {
    if (cacheArchive) {
      return cacheArchive;
    }

    try {
      générationEnCours = true;
      const { data } = await axios.get<ArrayBuffer>('/api/outils/kit-de-sensibilisation-interne', {
        responseType: 'arraybuffer',
      });

      if (logo) {
        [cacheArchive, pdfs] = await récupèreArchivePersonnalisée(data, logo);
      } else {
        cacheArchive = récupèreArchiveGénérique(data);
      }
    } finally {
      générationEnCours = false;
    }
    return cacheArchive;
  },
};
