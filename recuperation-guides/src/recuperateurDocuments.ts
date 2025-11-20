import axios from 'axios';
import { createWriteStream } from 'node:fs';
import fs from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';
import { Guide } from './recuperateurGuide';

export const recupereDocuments = async (guides: Guide[]): Promise<void> => {
  for (const guide of guides) {
    await recupereIllustration(guide);
    await recupereDocumentsLies(guide);
  }
};

async function telecharge(
  url: string,
  id: string = '',
  fnTransformation?: (chemin: string, fluxEntree: any) => Promise<void>
): Promise<void> {
  const chemin = join('sortie', id, decodeURI(url.split('/').at(-1)!));
  const reponse = await axios.get(url, {
    responseType: 'stream',
  });
  await fs.access(join(`sortie`, id)).catch(async () => {
    await fs.mkdir(join(`sortie`, id));
  });

  if (fnTransformation) {
    await fnTransformation(chemin, reponse.data);
  } else {
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
}

const recupereIllustration = async ({ id, image }: Guide): Promise<void> => {
  if (!image) {
    return;
  }
  await telecharge(image, id, async (chemin, flux) => {
    const retailleEn234px = sharp().resize(234).avif({ quality: 80 });
    const retailleEn588px = sharp().resize(588).avif({ quality: 80 });

    const cheminSansExtension = chemin.slice(0, chemin.lastIndexOf('.'));
    const flux234 = createWriteStream(cheminSansExtension + '-234.avif');
    const flux588 = createWriteStream(cheminSansExtension + '-588.avif');

    flux.pipe(retailleEn234px).pipe(flux234);
    flux.pipe(retailleEn588px).pipe(flux588);
    return new Promise((resolve) => {
      flux588.on('finish', resolve);
    });
  });
  console.log('Image récupérée : ', image);
};

const recupereDocumentsLies = async ({
  urlDocuments,
}: Guide): Promise<void> => {
  for (const urlDocument of urlDocuments) {
    await telecharge(urlDocument);
    console.log('Document récupéré : ', urlDocument);
  }
};
