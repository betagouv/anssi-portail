import { EntrepôtQuestionVraieFausse } from '../metier/mini-tests/vrai-faux/entrepotQuestionVraieFausse.js';
import { QuestionVraieFausse } from '../metier/mini-tests/vrai-faux/questionVraieFausse.js';

export class EntrepôtQuestionVraieFausseStatique implements EntrepôtQuestionVraieFausse {
  async tous(): Promise<QuestionVraieFausse[]> {
    return [
      {
        idQuestion: 'tailleEntreprisesVictimes',
        idéeReçue: {
          emoji: '🏢',
          texte: 'Les grandes entreprises sont les principales victimes des rançongiciels, pas les PME et TPE.',
        },
        réponse: 'FAUX. Les grandes entreprises sont les principales victimes des rançongiciels, pas les PME et TPE.',
        explications: [
          'Les PME, TPE et ETI sont la catégorie la plus touchée.',
          "En 2025, parmi les victimes d'attaques par rançongiciel portées à la connaissance de l'ANSSI, les PME, TPE et ETI représentent 37 % des cas — c'est la catégorie la plus affectée. Les attaques cybercriminelles ciblent indistinctement la plupart des secteurs et zones géographiques, de façon opportuniste.",
        ],
        source: 'ANSSI, Panorama de la cybermenace 2025, section 1.A — pages 10-11.',
        idéeReçueEstVraie: false,
      },
      {
        idQuestion: 'attaquantConvaincCollaborateur',
        idéeReçue: {
          emoji: '🎭',
          texte: "Un attaquant peut convaincre un collaborateur d'installer lui-même le logiciel qui le compromettra.",
        },
        idéeReçueEstVraie: true,
        explications: [
          'Les arnaques au faux support informatique se multiplient.',
          "En 2025, l'ANSSI a observé plusieurs cas d'arnaques au faux support informatique : l'attaquant se fait passer pour le service IT et incite l'employé à télécharger un outil légitime d'accès à distance, qui devient le vecteur d'intrusion initial. Ces techniques (faux support, hameçonnage vocal, MFA Fatigue) s'appuient sur une bonne connaissance des processus internes.",
        ],
        réponse:
          "VRAI. Un attaquant peut convaincre un collaborateur d'installer lui-même le logiciel qui le compromettra.",
        source: 'ANSSI, Panorama de la cybermenace 2025, section 2.B — page 30.',
      },
      {
        idQuestion: 'installerLogicielCompromission',
        idéeReçue: {
          emoji: '📥',
          texte:
            "Installer un logiciel gratuit téléchargé sur Internet peut compromettre tous les mots de passe de l'entreprise.",
        },
        idéeReçueEstVraie: true,
        explications: [
          'Un cas concret a touché plusieurs entreprises en 2025.',
          "En février 2025, plusieurs entreprises de l'agroalimentaire ont identifié un code malveillant (l'infostealer EpiBrowser) sur de nombreux postes. Le déploiement résultait de l'installation d'un logiciel gratuit se présentant comme un navigateur Chromium. Une fois installé, le programme collectait les identifiants et mots de passe renseignés par les utilisateurs.",
        ],
        réponse:
          "VRAI. Installer un logiciel gratuit téléchargé sur Internet peut compromettre tous les mots de passe de l'entreprise.",
        source: 'ANSSI, Panorama de la cybermenace 2025, section 1.A — page 14.',
      },
      {
        idQuestion: 'conséquenceAttaquePrestataire',
        idéeReçueEstVraie: false,
        explications: [
          'Les attaquants se servent des prestataires comme rebond vers leurs clients.',
          "En 2025, l'ANSSI a été témoin de nombreuses compromissions d'entités par des attaquants se latéralisant depuis les systèmes d'information de prestataires vers leurs clients. Dans un cas observé, l'attaquant a exfiltré des ressources clientes chez un prestataire puis utilisé les interconnexions et authentifiants volés pour se propager sur les SI de plusieurs clients.",
        ],

        réponse: 'FAUX. Une cyberattaque chez mon prestataire informatique reste sans conséquence pour mon entreprise.',
        idéeReçue: {
          emoji: '🔗',
          texte: 'Une cyberattaque chez mon prestataire informatique reste sans conséquence pour mon entreprise.',
        },
        source: 'ANSSI, Panorama de la cybermenace 2025, section 3.C — page 48',
      },
      {
        idQuestion: 'paralysieActivitéRançongiciel',
        idéeReçueEstVraie: false,
        explications: [
          'Plusieurs semaines de fonctionnement dégradé sont fréquentes.',
          "En 2025, des établissements scolaires ont dû fonctionner en mode dégradé pendant plusieurs semaines suite à un rançongiciel. Une autre compromission traitée par l'ANSSI a entraîné, après des mesures d'endiguement précipitées, un arrêt total et une perturbation des activités sur le long cours. L'ANSSI rappelle qu'un PCA et un PRA préparés en amont sont indispensables.",
        ],
        réponse: 'FAUX. Une attaque par rançongiciel paralyse rarement une activité plus de quelques jours.',
        idéeReçue: {
          emoji: '⏳',
          texte: 'Une attaque par rançongiciel paralyse rarement une activité plus de quelques jours.',
        },
        source: 'ANSSI, Panorama de la cybermenace 2025, section 1.A et encadré « endiguement » — pages 11-12.',
      },
      {
        idQuestion: 'payerRançonRécupèreDonnées',
        idéeReçueEstVraie: false,
        explications: [
          'Plusieurs semaines de fonctionnement dégradé sont fréquentes.',
          "En 2025, des établissements scolaires ont dû fonctionner en mode dégradé pendant plusieurs semaines suite à un rançongiciel. Une autre compromission traitée par l'ANSSI a entraîné, après des mesures d'endiguement précipitées, un arrêt total et une perturbation des activités sur le long cours. L'ANSSI rappelle qu'un PCA et un PRA préparés en amont sont indispensables.",
        ],
        réponse: 'FAUX. Payer la rançon permet de récupérer ses données chiffrées.',
        idéeReçue: {
          emoji: '💰',
          texte: 'Payer la rançon permet de récupérer ses données chiffrées.',
        },
        source:
          'ANSSI + Ministère de la Justice, guide « Attaques par rançongiciels, tous concernés » (août 2020), page 29.',
      },
    ];
  }
}
