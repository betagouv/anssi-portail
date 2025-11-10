import axios from 'axios';

export const lecteurDeSiteHttp = {
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
};
