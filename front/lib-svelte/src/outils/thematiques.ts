const emplacement: string = '/assets/images/kit-de-sensibilisation';

export const thématiques: { titre: string; cheminAperçu: string; titreEmail: string; description: string }[] = [
  {
    titre: '1. Sécurité des comptes',
    cheminAperçu: `${emplacement}/securite-des-comptes.avif`,
    titreEmail: 'Votre mot de passe peut devenir un point d’entrée pour une attaque.',
    description:
      'Des supports pour sensibiliser aux bonnes pratiques de protection des comptes, des mots de passe et des identifiants professionnels.',
  },
  {
    titre: '2. Authentification et accès',
    cheminAperçu: `${emplacement}/authentification-et-acces.avif`,
    titreEmail: 'Votre mot de passe suffit-il vraiment à vous protéger\u00a0?',
    description:
      'Des modèles pour communiquer sur les bonnes pratiques d’authentification, la gestion des accès et la protection des comptes à privilèges.',
  },
  {
    titre: '3. Hameçonnage',
    cheminAperçu: `${emplacement}/hameconnage.avif`,
    titreEmail: 'Ce message a l’air normal. Il ne l’est peut-être pas.',
    description:
      'Des supports pour sensibiliser aux principales formes de phishing et de messages malveillants, et rappeler les bons réflexes face à un contenu suspect.',
  },
  {
    titre: '4. Données sensibles',
    cheminAperçu: `${emplacement}/donnees-sensibles.avif`,
    titreEmail: 'Où finissent vraiment les documents que vous partagez\u00a0?',
    description:
      'Des modèles pour sensibiliser à l’identification, la manipulation, le stockage et le partage sécurisé des données sensibles et confidentielles. ',
  },
  {
    titre: '5. Mobilité et déplacement',
    cheminAperçu: `${emplacement}/mobilite-et-deplacement.avif`,
    titreEmail: 'Vos données voyagent avec vous. Les protégez-vous\u00a0?',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris at dignissim nunc. Maecenas imperdiet molestie dui.',
  },
  {
    titre: '6. Réagir face à un incident',
    cheminAperçu: `${emplacement}/reagir-face-a-un-incident.avif`,
    titreEmail: 'Un incident cyber\u00a0? Voici exactement quoi faire.',
    description:
      'Des modèles pour expliquer aux collaborateurs comment reconnaître un incident, quels premiers réflexes adopter et comment le signaler rapidement aux personnes ou services concernés.',
  },
];
