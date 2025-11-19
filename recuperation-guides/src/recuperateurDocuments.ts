import axios from 'axios';
import { createWriteStream } from 'node:fs';
import fs from 'node:fs/promises';
import { join } from 'node:path';
import { Guide } from './recuperateurGuide';

export const recupereDocuments = async (guides: Guide[]): Promise<void> => {
  for (const guide of guides) {
    await recupereIllustration(guide);
    await recupereDocumentsLies(guide);
  }
};

async function telecharge(url: string, id: string = ''): Promise<void> {
  const chemin = join('sortie', id, decodeURI(url.split('/').at(-1)!));
  const reponse = await axios.get(url, {
    responseType: 'stream',
  });
  await fs.access(join(`sortie`, id)).catch(async () => {
    await fs.mkdir(join(`sortie`, id));
  });

  const fluxDeSortie = createWriteStream(chemin);
  reponse.data.pipe(fluxDeSortie);

  return new Promise((resolve, reject) => {
    fluxDeSortie.on('finish', resolve);
    fluxDeSortie.on('error', (erreur) => {
      console.log('Erreur de récupération du document', id, erreur);
      resolve();
    });
  });
}

const recupereIllustration = async ({ id, image }: Guide): Promise<void> => {
  if (!image) {
    return;
  }
  await telecharge(image, id);
  console.log('Image récupérée : ', image);
};

const recupereDocumentsLies = async ({
  id,
  documents,
}: Guide): Promise<void> => {
  const donneesDocuments = documents.split('\n').filter((d) => !!d.trim());
  for (const donneesDocument of donneesDocuments) {
    const urlDocument = donneesDocument.slice(
      donneesDocument.indexOf('https://')
    );

    await telecharge(urlDocument);
    console.log('Document récupéré : ', urlDocument);
  }
};
