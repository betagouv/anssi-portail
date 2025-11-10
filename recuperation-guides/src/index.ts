import { RecuperateurDAdressesDesGuides } from './recuperateurDAdressesDesGuides';
import axios from 'axios';

console.log('Récupération des guides de sécurité...');
const recuperateurDeGuides = new RecuperateurDAdressesDesGuides({
  lis: async (url: string) => {
    const reponseChallenge = await axios.get(url);
    const challengeExtrait = (reponseChallenge.data as string).match(
      /var __blnChallengeStore=\{.*,"value":"([^"]*)"/
    )!;
    const challenge = challengeExtrait[1];
    const reponse = await axios.get(url, {
      headers: {
        cookie: `bln_challengejs=${challenge}`,
      },
    });
    return reponse.data;
  },
});

const adresses = await recuperateurDeGuides.recupere(
  'https://cyber.gouv.fr/publications?field_type_de_publication_target_id%5B934%5D=934&field_type_de_publication_target_id%5B936%5D=936'
);

console.log(adresses);
