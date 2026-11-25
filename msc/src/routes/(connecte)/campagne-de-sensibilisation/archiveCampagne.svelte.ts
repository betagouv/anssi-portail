import axios from '@anssi-portail/axios';

type Campagne = {
  archive: Uint8Array<ArrayBuffer>;
  pdfs: Uint8Array<ArrayBuffer>[];
};

const récupèreCampagne = async (logoÀAppliquer: File | null): Promise<Campagne> => {
  const { récupèreArchiveGénérique, récupèreArchivePersonnalisée } = await import('./manipulationZip');
  const { data } = await axios.get<ArrayBuffer>('/api/outils/campagne-de-sensibilisation', {
    responseType: 'arraybuffer',
  });

  if (logoÀAppliquer) {
    const [archive, pdfs] = await récupèreArchivePersonnalisée(data, logoÀAppliquer);
    return { archive, pdfs };
  }

  return { archive: récupèreArchiveGénérique(data), pdfs: [] };
};

export const creeArchiveCampagne = () => {
  let logo = $state<File | null>(null);
  let promesseCampagne: Promise<Campagne> | null = null;
  return {
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
};
