import axios from 'axios';
import fs from 'node:fs/promises';
import { Guide } from './recuperateurGuide';

export const recupereDocuments = async (guides: Guide[]): Promise<void> => {
  for (const guide of guides) {
    if (guide.image) {
      const reponseImage = await axios.get(guide.image, {
        responseType: 'blob',
      });
      await fs.access(`sortie/${guide.id}`).catch(async () => {
        await fs.mkdir(`sortie/${guide.id}`);
      });
      await fs.writeFile(
        `sortie/${guide.id}/${guide.image.split('/').at(-1)}`,
        reponseImage.data
      );
      console.log('Image récupérée : ', guide.image);
    }
  }
};
