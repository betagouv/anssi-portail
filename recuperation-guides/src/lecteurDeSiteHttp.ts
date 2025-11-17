import axios from 'axios';

export type LecteurSite = { lis: (url: string) => Promise<string> };

export const lecteurDeSiteHttp = {
  lis: async (url: string) => {
    const reponseChallenge = await axios.get(url);
    const challengeExtrait = (reponseChallenge.data as string).match(
      /var __blnChallengeStore=\{.*"value":"([^"]*)"/
    );
    if (!challengeExtrait) {
      return reponseChallenge.data;
    }
    const challenge = challengeExtrait[1];
    const reponse = await axios.get(url, {
      headers: {
        cookie: `bln_challengejs=${challenge}`,
      },
    });
    return reponse.data;
  },
};
