import axios from 'axios';
import fs from 'node:fs/promises';
import { Guide } from './recuperateurGuide';

export const recupereDocuments = async (guides: Guide[]): Promise<void> => {
  for (const guide of guides) {
    await recupereIllustration(guide);
    await recupereDocumentsLies(guide);
  }
};

const recupereIllustration = async ({ id, image }: Guide): Promise<void> => {
  if (!image) {
    return;
  }
  const reponseImage = await axios.get(image, {
    responseType: 'blob',
  });
  await fs.access(`sortie/${id}`).catch(async () => {
    await fs.mkdir(`sortie/${id}`);
  });
  await fs.writeFile(
    `sortie/${id}/${image.split('/').at(-1)}`,
    reponseImage.data
  );
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
    const reponseDocument = await axios.get(urlDocument, {
      responseType: 'blob',
    });
    await fs.access(`sortie/${id}`).catch(async () => {
      await fs.mkdir(`sortie/${id}`);
    });
    await fs.writeFile(
      `sortie/${id}/${urlDocument.split('/').at(-1)}`,
      reponseDocument.data
    );
    console.log('Document récupéré : ', urlDocument);
  }
};
